// Builds the IDP results dashboard as one self-contained HTML page.
// Used by the n8n "Build dashboard" Code node and by run_local.js (report.html).
function buildDashboard(results, opts = {}) {
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ROUTE = {
    review: ['Needs review', '#B42318', '#FEE4E2', '▲'],
    audit_sample: ['5% spot audit', '#3C66CE', '#EEF2FC', '◆'],
    auto_approve: ['Auto-approved', '#1F7A45', '#E3F8E7', '✓'],
    manual: ['Manual', '#B54708', '#FEF0C7', '●'],
  };
  const STATUS = { verified: ['✓ Verified', '#1F7A45', '#E3F8E7'], check: ['▲ Check', '#B54708', '#FEF0C7'], missing: ['▲ Missing', '#B42318', '#FEE4E2'] };
  const chip = (label, fg, bg) => `<span class="chip" style="color:${fg};background:${bg}">${esc(label)}</span>`;
  const n = results.length;
  const count = (r) => results.filter((x) => x.route === r).length;
  const review = count('review') + count('audit_sample'), auto = count('auto_approve'), manual = count('manual');
  const stp = n ? Math.round(((auto + count('audit_sample')) / n) * 100) : 0;
  const money = (v) => (v === '' || v == null ? 'n/a' : '$' + Number(v).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  const time = (t) => { try { return new Date(t).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); } catch { return ''; } };

  const rows = results.map((r) => {
    const [label, fg, bg, icon] = ROUTE[r.route] || ROUTE.manual;
    let fields = {};
    try { fields = JSON.parse(r.fields_json || '{}'); } catch {}
    const fieldRows = Object.entries(fields).filter(([, f]) => f.value || f.status !== 'missing' || (f.reasons || []).length).map(([name, f]) => {
      const [sl, sf, sb] = STATUS[f.status] || STATUS.missing;
      return `<tr><td class="mono">${esc(name)}</td><td>${esc(f.value) || '<span class="muted">not found</span>'}</td><td>${chip(sl, sf, sb)}</td>
        <td class="muted">${f.source_quote ? '“' + esc(f.source_quote) + '”' : ''}${(f.reasons || []).length ? '<div class="why">' + esc(f.reasons.join(' · ')) + '</div>' : ''}</td></tr>`;
    }).join('');
    return `<tr class="doc">
      <td class="muted">${esc(time(r.processed_at || r.received_at))}</td>
      <td><b>${esc(r.invoice_number || r.doc_id)}</b><div class="muted small">${esc(r.file_name)}</div></td>
      <td>${esc(r.doc_type === 'nda' ? 'NDA' : r.doc_type === 'invoice' ? 'Invoice' : 'Other')}${r.language === 'fr' ? ' · FR' : ''}</td>
      <td>${esc(r.supplier_or_party)}</td>
      <td>${esc(r.place_of_supply || '')}</td>
      <td class="num">${r.doc_type === 'invoice' ? money(r.total) : 'n/a'}</td>
      <td>${chip(icon + ' ' + label, fg, bg)}</td>
      <td class="whycell">${esc(r.why_it_needs_you)}
        <details><summary>Fields and sources</summary><table class="fields"><tr><th>Field</th><th>Value</th><th>Status</th><th>Source quote · reason</th></tr>${fieldRows}</table></details></td>
    </tr>`;
  }).join('');

  const kpi = (label, value, sub) => `<div class="kpi"><div class="muted small">${label}</div><div class="big">${value}</div><div class="muted small">${sub}</div></div>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>IDP · Document queue</title>
<style>
:root{--navy:#000048;--blue:#3C66CE;--text:#000048;--muted:#5A5F7A;--line:#D7DCEA;--subtle:#F4F6FB}
*{box-sizing:border-box}body{margin:0;font-family:Inter,"Segoe UI",Arial,sans-serif;color:var(--text);background:#fff}
header{background:var(--navy);color:#fff;padding:18px 32px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
header h1{font-size:20px;margin:0}header .sub{color:#AEB6D9;font-size:13px}
.live{font-size:13px;color:#AEB6D9}.dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#36C0CF;margin-right:6px}
main{padding:24px 32px;max-width:1500px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:24px}
.kpi{border:1px solid var(--line);border-radius:10px;padding:14px 16px}.big{font-size:28px;font-weight:700;margin:4px 0}
.wrap{overflow-x:auto;border:1px solid var(--line);border-radius:10px}
table{border-collapse:collapse;width:100%;font-size:14px}th{background:var(--subtle);color:var(--muted);text-align:left;font-weight:600;padding:10px 12px;white-space:nowrap}
td{padding:12px;border-top:1px solid var(--line);vertical-align:top}.num{text-align:right;white-space:nowrap}
.chip{display:inline-block;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:600;white-space:nowrap}
.muted{color:var(--muted)}.small{font-size:12px}.mono{font-family:ui-monospace,Menlo,monospace;font-size:12px}
.whycell{max-width:520px}details{margin-top:8px}summary{cursor:pointer;color:var(--blue);font-size:13px;font-weight:600}
.fields{margin-top:8px;font-size:13px}.fields td,.fields th{padding:6px 8px}.why{color:#B42318;font-size:12px;margin-top:2px}
.empty{padding:48px;text-align:center;color:var(--muted)}footer{padding:16px 32px;color:var(--muted);font-size:12px}
</style></head><body>
<header><div><h1>IDP · AP &amp; Contracts · Document queue</h1><div class="sub">Cognizant Canada (internal concept) · synthetic data only</div></div>
<div class="live">${opts.live ? '<span class="dot"></span>Live · refreshes every 5 s · <a style="color:#fff" href="?reset=1">Reset demo</a>' : 'Static report · generated ' + esc(new Date().toLocaleString('en-CA'))}</div></header>
<main>
<div class="kpis">${kpi('Processed', n, 'documents')}${kpi('Needs a person', review, 'review queue incl. audits')}${kpi('Auto-approved', auto, 'straight-through')}${kpi('Manual', manual, 'unreadable or unclear')}${kpi('Straight-through rate', stp + '%', 'target 40 to 60%')}</div>
<div class="wrap">${n ? `<table><tr><th>Time</th><th>Document</th><th>Type</th><th>Supplier or party</th><th>Place of supply</th><th>Total (CAD)</th><th>Route</th><th>Why it needs you</th></tr>${rows}</table>` : '<div class="empty">No documents yet. Upload one through the form.</div>'}</div>
</main>
<footer>Extraction: Gemini · Validation: Canadian rules (GST/HST, QST, place of supply, totals, dates, duplicates, NDA playbook) · Every value links to its source quote.</footer>
${opts.live ? '<script>setInterval(()=>{if(!document.querySelector("details[open]"))location.replace(location.pathname)},5000)</script>' : ''}
</body></html>`;
}
if (typeof module !== 'undefined') module.exports = { buildDashboard };
