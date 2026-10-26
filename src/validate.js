// ===== n8n Code node: "Validate & route (Canadian rules)" =====
// Mode: Run Once for All Items. Input: response of "Gemini · pass 2".
// Reads pass 1 and config from earlier nodes by name.

const prep = $('Prepare request').first().json;
const cfg = prep.config;

function parseGemini(resp) {
  if (!resp || !resp.candidates) return { doc_type: 'other', language: 'other', fields: [], _parseError: 'AI unavailable' };
  const text = resp?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
  try { return JSON.parse(text.replace(/```json|```/g, '').trim()); }
  catch (e) { return { doc_type: 'other', language: 'other', fields: [], _parseError: String(e) }; }
}
const p1 = parseGemini($('Gemini · pass 1').first().json);
const p2 = parseGemini($input.first().json);

const toMap = (r) => Object.fromEntries((r.fields || []).map(f => [f.name, f]));
const f1 = toMap(p1), f2 = toMap(p2);
const docType = p1.doc_type === p2.doc_type ? p1.doc_type : 'other';

// ---------- helpers ----------
const norm = (s) => String(s ?? '').toLowerCase().replace(/[\s\u00a0\u202f$.,:]/g, '');
function money(raw) {
  if (!raw) return null;
  let s = String(raw).replace(/[^\d.,-]/g, '');
  if (!s) return null;
  const lastDot = s.lastIndexOf('.'), lastComma = s.lastIndexOf(',');
  if (lastComma > lastDot) {                       // French: 4 240,00
    const dec = s.length - lastComma - 1;
    s = dec === 2 ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  } else { s = s.replace(/,/g, ''); }              // English: 4,240.00
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}
const PROV_NAMES = { 'ontario':'ON','quebec':'QC','québec':'QC','british columbia':'BC','colombie-britannique':'BC','alberta':'AB','manitoba':'MB','saskatchewan':'SK','nova scotia':'NS','nouvelle-écosse':'NS','new brunswick':'NB','nouveau-brunswick':'NB','newfoundland':'NL','terre-neuve':'NL','prince edward island':'PE','île-du-prince-édouard':'PE','yukon':'YT','northwest territories':'NT','nunavut':'NU' };
const POSTAL_FIRST = { A:'NL',B:'NS',C:'PE',E:'NB',G:'QC',H:'QC',J:'QC',K:'ON',L:'ON',M:'ON',N:'ON',P:'ON',R:'MB',S:'SK',T:'AB',V:'BC',Y:'YT' };
function province(raw) {
  const s = String(raw || '').trim();
  const code = s.toUpperCase().match(/\b(ON|QC|BC|AB|MB|SK|NS|NB|NL|PE|YT|NT|NU)\b/);
  if (code) return code[1];
  const low = s.toLowerCase();
  for (const [k, v] of Object.entries(PROV_NAMES)) if (low.includes(k)) return v;
  const pc = s.toUpperCase().match(/\b([ABCEGHJKLMNPRSTVXY])\d[A-Z]\s?\d[A-Z]\d\b/);
  return pc ? POSTAL_FIRST[pc[1]] || null : null;
}
// Simplified rate table. VERIFY with the tax team before use. Rates change.
const RATES = { ON:{hst:0.13}, NS:{hst:0.14}, NB:{hst:0.15}, NL:{hst:0.15}, PE:{hst:0.15},
  QC:{gst:0.05,qst:0.09975}, BC:{gst:0.05,pst:0.07}, MB:{gst:0.05,pst:0.07}, SK:{gst:0.05,pst:0.06},
  AB:{gst:0.05}, NT:{gst:0.05}, NU:{gst:0.05}, YT:{gst:0.05} };
const near = (a, b) => a != null && b != null && Math.abs(a - b) <= cfg.amountTolerance;

// ---------- semantic comparison (small differences are resolved automatically) ----------
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONFULL = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const FR = { janv: 0, 'févr': 1, fevr: 1, mars: 2, avr: 3, mai: 4, juin: 5, juil: 6, 'août': 7, aout: 7, sept: 8, oct: 9, nov: 10, 'déc': 11, dec: 11 };
function toDate(raw) {
  const s = String(raw || '').trim().toLowerCase();
  let y, m, d, assumed = false, x;
  if ((x = s.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/))) { y = +x[1]; m = +x[2]; d = +x[3]; }
  else if ((x = s.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{2,4})$/))) {
    y = +x[3] < 100 ? 2000 + +x[3] : +x[3]; const p = +x[1], q = +x[2];
    if (p > 12) { d = p; m = q; } else if (q > 12) { m = p; d = q; } else { m = p; d = q; assumed = p !== q; }  // standard: month/day/year
  } else if ((x = s.match(/^([a-zéû]+)\.?\s+(\d{1,2}),?\s+(\d{4})$/))) { m = MONFULL.indexOf(x[1].slice(0, 3)) + 1; d = +x[2]; y = +x[3]; }
  else if ((x = s.match(/^(\d{1,2})(?:er)?\s+([a-zéû]+)\.?\s+(\d{4})$/))) { const k = x[2].replace(/\.$/, ''); m = (FR[k] ?? FR[k.slice(0, 4)] ?? MONFULL.indexOf(k.slice(0, 3))) + 1; d = +x[1]; y = +x[3]; }
  if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31) return null;
  return { iso: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, label: `${MON[m - 1]} ${d}, ${y}`, assumed };
}
const words = (s) => String(s || '').toLowerCase().replace(/\((test entity|entite test)\)/g, '').split(/[^a-z0-9à-ÿ]+/).filter((w) => w.length > 1 && !['the', 'of', 'and', 'et', 'la', 'le', 'de', 'des', 'inc', 'ltd', 'laws', 'law'].includes(w));
function same(name, x, y) {
  if (!x || !y) return false;
  if (/province/.test(name)) { const p = province(x), q = province(y); return !!p && p === q; }
  if (/amount|total|subtotal/.test(name)) { const p = money(x), q = money(y); return p != null && q != null && Math.abs(p - q) <= 0.01; }
  if (/date/.test(name)) { const p = toDate(x), q = toDate(y); return !!p && !!q && p.iso === q.iso; }
  if (/(_number|currency)$/.test(name)) return norm(x).replace(/[^a-z0-9]/g, '') === norm(y).replace(/[^a-z0-9]/g, '');
  const A = words(x), B = words(y); if (!A.length || !B.length) return false;
  const [s, l] = A.length <= B.length ? [A, B] : [B, A];
  return s.filter((w) => l.includes(w)).length / s.length >= 0.8;   // e.g. "State of New York" vs "New York"
}
const autoNotes = [];
// Fields that are informational only: never a reason to send a document to review.
const INFO_ONLY = ['invoice_number', 'gst_hst_number', 'po_number', 'payment_terms', 'due_date_raw', 'supplier_address', 'bill_to_address'];
// Canadian display formats
const cad = (v) => { const n = money(v); return n == null ? null : '$' + n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };

// ---------- per-field status ----------
const fields = {};
const issues = [];          // { field, severity: 'critical'|'warn'|'info', message }
const names = new Set([...Object.keys(f1), ...Object.keys(f2)]);
for (const n of names) {
  const a = f1[n] || {}, b = f2[n] || {};
  const grounded = !!(a.found && String(a.value || '').trim() && String(a.source_quote || '').trim());
  const exact = norm(a.value) === norm(b.value);
  const agree = exact || same(n, a.value, b.value);
  fields[n] = { value: a.value || '', source_quote: a.source_quote || '', page: a.page ?? null,
                grounded, agree, status: grounded ? (agree ? 'verified' : 'check') : 'missing', reasons: [] };
  if (grounded && !agree) { if (INFO_ONLY.includes(n)) { fields[n].status = 'verified'; fields[n].note = `Two reads differ ("${a.value}" vs "${b.value}"); not a review item`; } else fields[n].reasons.push(`Two reads disagree: "${a.value}" vs "${b.value}"`); }
  if (grounded && agree && !exact && b.value) { fields[n].auto = `Two reads matched in meaning ("${a.value}" = "${b.value}")`; autoNotes.push(n); }
  if (/date/.test(n) && a.value) { const d = toDate(a.value); if (d) { fields[n].display = d.label; if (d.assumed) { fields[n].auto = 'Read as month/day/year (company date standard)'; autoNotes.push(n); } } }
}
const F = (n) => fields[n] || { value: '', status: 'missing', reasons: [], grounded: false };
function flag(field, severity, message) {
  if (severity !== 'critical' || INFO_ONLY.includes(field)) { severity = 'info'; if (fields[field]) fields[field].note = message; issues.push({ field, severity, message }); return; }
  issues.push({ field, severity, message });
  if (fields[field]) {
    fields[field].reasons.push(message);
    if (severity === 'critical') fields[field].status = 'missing';
    else if (fields[field].status === 'verified') fields[field].status = 'check';
  }
}

// ---------- invoice rules ----------
let supplierProv = null, supplyProv = null, totals = {};
if (docType === 'invoice') {
  for (const n of cfg.criticalInvoiceFields.filter((x) => !INFO_ONLY.includes(x))) {
    if (F(n).status !== 'verified') flag(n, 'critical', F(n).status === 'missing' ? `${n} not found in document` : (F(n).reasons[0] || `${n} needs confirmation`));
  }
  supplierProv = province(F('supplier_province').value) || province(F('supplier_address').value);
  // Place of supply: for most services this follows the recipient (bill-to) address, not the supplier.
  supplyProv = province(F('bill_to_province').value) || province(F('bill_to_address').value) || cfg.defaultPlaceOfSupply;

  const sub = money(F('subtotal').value), tot = money(F('total').value);
  const gst = money(F('gst_amount').value), hst = money(F('hst_amount').value);
  const qst = money(F('qst_amount').value), pst = money(F('pst_amount').value);
  totals = { sub, tot, gst, hst, qst, pst };

  // Registration numbers
  // GST/HST registration number: extracted and displayed only (company rule: not a review item).
  const bn = String(F('gst_hst_number').value || '').toUpperCase().replace(/\s/g, '');
  if (fields.gst_hst_number && /^\d{9}RT\d{4}$/.test(bn)) fields.gst_hst_number.display = bn.slice(0, 9) + ' RT' + bn.slice(11);
  // QST number: mandatory for every Quebec supplier (company rule), and required whenever QST is charged.
  const qn = String(F('qst_number').value || '').toUpperCase().replace(/\s/g, '');
  if (!fields.qst_number) fields.qst_number = { value: '', source_quote: '', page: null, grounded: false, agree: true, status: 'missing', reasons: [] };
  if ((supplierProv === 'QC' || qst) && !qn) flag('qst_number', 'critical', supplierProv === 'QC' ? 'Quebec supplier: QST registration number is mandatory and was not found on the invoice.' : 'QST charged but no QST registration number. Input tax refund (ITR) cannot be claimed.');
  else if (qn && !/^\d{10}TQ\d{4}$/.test(qn)) flag('qst_number', 'critical', `QST number "${F('qst_number').value}" is not in the 1234567890 TQ0001 format.`);
  else if (qn) fields.qst_number.display = qn.slice(0, 10) + ' TQ' + qn.slice(12);

  // Expected tax for place of supply
  const r = RATES[supplyProv];
  if (!r) flag('bill_to_province', 'warn', 'Could not determine place of supply. Tax rate not checked.');
  else if (sub != null) {
    if (r.hst && !near(hst ?? gst, sub * r.hst)) flag(hst != null ? 'hst_amount' : 'gst_amount', 'critical', `Expected HST ${(r.hst*100).toFixed(0)}% for ${supplyProv} (${(sub*r.hst).toFixed(2)}), found ${hst ?? gst ?? 'none'}.`);
    if (r.gst && !near(gst, sub * r.gst)) flag('gst_amount', 'critical', `Expected GST 5% for ${supplyProv} (${(sub*r.gst).toFixed(2)}), found ${gst ?? 'none'}.`);
    if (r.qst && !near(qst, sub * r.qst)) flag('qst_amount', 'critical', `Expected QST 9.975% for ${supplyProv} (${(sub*r.qst).toFixed(2)}), found ${qst ?? 'none'}.`);
    if (!r.qst && qst) flag('qst_amount', 'critical', `QST charged but place of supply is ${supplyProv}.`);
    if (r.pst && pst == null) flag('pst_amount', 'info', `${supplyProv} PST may apply. PST is not recoverable as an ITC; confirm with tax team.`);
  }
  // Arithmetic
  if (sub != null && tot != null) {
    const sum = sub + (gst||0) + (hst||0) + (qst||0) + (pst||0);
    if (!near(sum, tot)) flag('total', 'critical', `Subtotal + taxes = ${sum.toFixed(2)} but total is ${tot.toFixed(2)}.`);
  }
  // Ambiguous DD/MM vs MM/DD
  // Ambiguous dates are resolved automatically as month/day/year (company standard) and noted on the field.
  // Duplicate (persists only in production executions of an active workflow)
  const sd = $getWorkflowStaticData('global'); sd.seen = sd.seen || {};
  const key = `${norm(F('supplier_name').value)}|${norm(F('invoice_number').value)}`;
  if (F('invoice_number').value) {
    if (sd.seen[key]) flag('invoice_number', 'info', `Possible duplicate: same supplier and invoice number received ${new Date(sd.seen[key]).toLocaleString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}.`);
    else sd.seen[key] = new Date().toISOString();
  }
}

// ---------- Canadian display formats ----------
for (const [n, f] of Object.entries(fields)) {
  if (!f.value) continue;
  if (/amount|total|subtotal/.test(n)) { const c = cad(f.value); if (c) f.display = c; }
  else if (/province/.test(n)) { const p = province(f.value); if (p) f.display = p; }
}

// ---------- NDA rules (Canadian playbook) ----------
if (docType === 'nda') {
  for (const n of cfg.criticalNdaFields) if (F(n).status !== 'verified') flag(n, 'critical', F(n).status === 'missing' ? `${n} not found in document` : (F(n).reasons[0] || `${n} needs confirmation`));
  const law = String(F('governing_law').value || '').toLowerCase();
  const canadian = /canada|ontario|quebec|québec|british columbia|alberta|manitoba|saskatchewan|nova scotia|new brunswick|newfoundland|prince edward island/.test(law);
  if (law && !canadian) flag('governing_law', 'critical', `Non-Canadian governing law ("${F('governing_law').value}"). Legal sign-off required.`);
  if (/^(yes|oui|true)/i.test(String(F('quebec_party').value || ''))) flag('quebec_party', 'critical', 'Quebec party: check whether a French version is required (Charter of the French Language).');
  if (F('privacy_clause').status === 'missing') flag('privacy_clause', 'warn', 'No privacy clause found. Expect a PIPEDA (or Law 25) reference if personal information is exchanged.');
}

// ---------- guardrails added after false-negative testing ----------
if (docType === 'invoice') {
  // Currency: non-CAD needs FX and tax treatment confirmed by a person.
  const cur = String(F('currency').value || '').toUpperCase().replace(/[^A-Z]/g, '');
  if (cur && cur !== 'CAD') flag('currency', 'critical', `Non-CAD invoice (${cur}): confirm FX rate and tax treatment.`);
  // Dates: catch impossible or stale dates the two reads could both get wrong.
  const inv = toDate(F('invoice_date_raw').value), due = toDate(F('due_date_raw').value);
  const today = new Date().toISOString().slice(0, 10);
  if (inv && inv.iso > today) flag('invoice_date_raw', 'critical', `Invoice date ${inv.label} is in the future.`);
  if (inv && (Date.parse(today) - Date.parse(inv.iso)) / 864e5 > 365) flag('invoice_date_raw', 'critical', `Invoice date ${inv.label} is more than a year old.`);
  if (inv && due && due.iso < inv.iso) flag('invoice_date_raw', 'critical', `Due date ${due.label} is before the invoice date.`);
}
// NDAs: always reviewed by a person during the pilot (legal risk; low volume).
if (docType === 'nda') flag('_policy', 'critical', 'NDA: human review required during pilot.');

// ---------- route ----------
const critical = issues.filter(i => i.severity === 'critical');
let route;
if (docType === 'other' || p1._parseError || p2._parseError) route = 'manual';
else if (critical.length) route = 'review';
else route = Math.random() < cfg.spotAuditRate ? 'audit_sample' : 'auto_approve';

const why = route === 'audit_sample' ? '5% spot audit'
  : route === 'manual' ? (p1._parseError === 'AI unavailable' || p2._parseError === 'AI unavailable' ? 'AI unavailable (Gemini overloaded). Retry AI extraction or key the fields manually.' : 'Unclear document type or unreadable')
  : issues.filter(i => i.severity !== 'info').map(i => i.message).join(' | ') || 'None';

return [{ json: {
  doc_id: prep.docId, received_at: prep.receivedAt, file_name: prep.fileName,
  doc_type: docType, language: p1.language, route,
  why_it_needs_you: why,
  critical_issues: critical.length,
  supplier_or_party: F('supplier_name').value || F('parties').value || '',
  supplier_province: supplierProv || '', place_of_supply: supplyProv || '',
  invoice_number: F('invoice_number').value || '', total: totals.tot ?? '',
  fields_json: JSON.stringify(fields), model: cfg.model,
  auto_resolved: autoNotes.join(', '),
}}];
