#!/usr/bin/env node
// P01 IDP · local runner. Same logic as the n8n workflow, no n8n or Google Sheets needed.
// It runs prepare.js and validate.js (the exact n8n Code-node bodies) and calls Gemini directly.
//
//   Real run:  GEMINI_API_KEY=xxx node run_local.js testpack
//   Dry run:   node run_local.js testpack --mock testpack/ground_truth.csv   (no API key, fake Gemini)
//   Then:      python3 eval_idp.py --truth testpack/ground_truth.csv --results results
//
// Requires Node 18+ (built-in fetch). Synthetic documents only.

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const inDir = args[0];
const mockIdx = args.indexOf('--mock');
const mockTruth = mockIdx > -1 ? args[mockIdx + 1] : null;
const outIdx = args.indexOf('--out');
const outDir = outIdx > -1 ? args[outIdx + 1] : 'results';
const delayMs = Number(process.env.IDP_DELAY_MS ?? (mockTruth ? 0 : 5000)); // spacing for free-tier rate limits
if (!inDir) { console.error('Usage: node run_local.js <folder> [--mock ground_truth.csv] [--out results]'); process.exit(1); }
if (!mockTruth && !process.env.GEMINI_API_KEY) { console.error('Set GEMINI_API_KEY (or use --mock).'); process.exit(1); }

const here = __dirname;
const { buildDashboard } = require(path.join(here, '..', 'src', 'dashboard.js'));
const AsyncFn = Object.getPrototypeOf(async function () {}).constructor;
const prepareFn = new AsyncFn('$input', fs.readFileSync(path.join(here, '..', 'src', 'prepare.js'), 'utf8'));
const validateFn = new AsyncFn('$', '$input', '$getWorkflowStaticData', fs.readFileSync(path.join(here, '..', 'src', 'validate.js'), 'utf8'));
const staticData = {}; // duplicate detection persists across documents within one run
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const MIME = { '.pdf': 'application/pdf', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };

// ---------- Gemini (real) ----------
async function gemini(model, body) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify(body),
    });
    if (res.ok) return res.json();
    const text = await res.text();
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      const wait = 15000 * attempt;
      console.log(`   Gemini ${res.status}, retrying in ${wait / 1000}s`);
      await sleep(wait);
      continue;
    }
    throw new Error(`Gemini ${res.status}: ${text.slice(0, 300)}`);
  }
}

// ---------- Gemini (mock from ground truth) ----------
function loadTruth(file) {
  const rows = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/).slice(1).map(parseCsvLine);
  const by = {};
  for (const [doc, field, value] of rows) if (!field.startsWith('_')) (by[doc] ||= {})[field] = value;
  return by;
}
function mockResponse(truth, fileName) {
  let fields = truth[fileName];
  if (!fields) { // e.g. a duplicate copy: reuse the original's fields by document ID
    const id = fileName.split('_')[1];
    const orig = Object.keys(truth).find((d) => d.split('_')[1] === id);
    fields = orig ? truth[orig] : {};
  }
  const doc_type = /NDA/i.test(fileName) ? 'nda' : 'invoice';
  const out = { doc_type, language: /_FR/.test(fileName) ? 'fr' : 'en',
    fields: Object.entries(fields).map(([name, value]) => ({ name, value, source_quote: value ? `…${value}…` : '', page: 1, found: !!value })) };
  return { candidates: [{ content: { parts: [{ text: JSON.stringify(out) }] } }] };
}

// ---------- CSV helpers ----------
function parseCsvLine(line) {
  const out = []; let cur = ''; let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true; else if (c === ',') { out.push(cur); cur = ''; } else cur += c;
  }
  out.push(cur); return out;
}
const esc = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
function writeCsv(file, rows) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  fs.writeFileSync(file, [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n') + '\n');
}

// ---------- run ----------
(async () => {
  const truth = mockTruth ? loadTruth(mockTruth) : null;
  const files = fs.readdirSync(inDir).filter((f) => MIME[path.extname(f).toLowerCase()]).sort();
  if (!files.length) { console.error(`No PDF/PNG/JPG files in ${inDir}`); process.exit(1); }
  fs.mkdirSync(outDir, { recursive: true });
  const tabs = { 'Review queue': [], 'Auto-approved': [], 'Manual': [] };
  const audit = [];
  const all = [];
  console.log(`${mockTruth ? 'MOCK' : 'LIVE'} run · ${files.length} documents\n`);

  for (const [i, f] of files.entries()) {
    const buf = fs.readFileSync(path.join(inDir, f));
    const ctx = { helpers: { getBinaryDataBuffer: async () => buf } };
    const input = { first: () => ({ binary: { Document: { fileName: f, mimeType: MIME[path.extname(f).toLowerCase()] } } }) };
    const prep = (await prepareFn.call(ctx, input))[0].json;
    const model = process.env.IDP_MODEL || prep.config.model;

    let r1, r2;
    try {
      r1 = truth ? mockResponse(truth, f) : await gemini(model, prep.body1);
      if (!truth) await sleep(delayMs);
      r2 = truth ? mockResponse(truth, f) : await gemini(model, prep.body2);
    } catch (e) {
      console.log(`✗ ${f}: ${e.message}`);
      r1 = r2 = { candidates: [] }; // malformed output routes to Manual, never auto-approved
    }
    const nodes = { 'Prepare request': { first: () => ({ json: { ...prep, config: { ...prep.config, model } } }) },
                    'Gemini · pass 1': { first: () => ({ json: r1 }) } };
    const out = (await validateFn(n => nodes[n], { first: () => ({ json: r2 }) }, () => staticData))[0].json;

    const tab = ['review', 'audit_sample'].includes(out.route) ? 'Review queue' : out.route === 'auto_approve' ? 'Auto-approved' : 'Manual';
    out.processed_at = new Date().toISOString();
    tabs[tab].push(out);
    all.unshift(out);
    audit.push({ timestamp: new Date().toISOString(), doc_id: out.doc_id, file_name: f, actor_type: 'AI',
      actor: `Gemini (${model}) + rules`, event: `Extracted, validated, routed to ${out.route}`,
      detail: out.why_it_needs_you, retain_until: `${new Date().getFullYear() + 7}-12-31` });
    console.log(`${out.route === 'auto_approve' ? '✓' : '→'} ${f}\n   ${out.route} · ${out.why_it_needs_you}`);
    if (!truth && i < files.length - 1) await sleep(delayMs);
  }

  for (const [name, rows] of Object.entries(tabs)) writeCsv(path.join(outDir, `${name}.csv`), rows);
  writeCsv(path.join(outDir, 'Audit log.csv'), audit);
  fs.writeFileSync(path.join(outDir, 'report.html'), buildDashboard(all, { live: false }));
  console.log(`\nOpen ./${outDir}/report.html in your browser.\nResults in ./${outDir}/  ·  Next: python3 eval_idp.py --truth <ground_truth.csv> --results ${outDir}`);
})();
