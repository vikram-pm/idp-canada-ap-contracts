// IDP reviewer front end: S1 Queue · S2 Invoice review · S3 NDA review · S4 Audit · S5 Ops.
// Server-rendered from n8n static data. Actions arrive as query params and are written to the audit log.
function renderApp(sd, q) {
  sd.results = sd.results || []; sd.audit = sd.audit || [];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const now = () => new Date().toISOString();
  const find = (id) => sd.results.find((r) => r.doc_id === id);
  const fieldsOf = (r) => { try { return JSON.parse(r.fields_json || '{}'); } catch { return {}; } };
  const flagged = (r) => { const f = fieldsOf(r), res = r.resolutions || {}; return Object.entries(f).filter(([k, v]) => (v.reasons || []).length && !res[k]); };
  const clean = (t) => String(t || '').replace(/\s*\((TEST ENTITY|ENTITE TEST)\)/gi, '');
  const short = (m, k) => { const R = [[/QST charged but no QST/, 'Missing QST number'], [/GST\/HST charged but no/, 'Missing GST/HST number'], [/not in the .* format/, 'Invalid tax number'], [/QST charged but place/, 'QST outside Quebec'], [/Expected (HST|GST|QST)/, 'Tax rate mismatch'], [/Subtotal \+ taxes/, "Totals don't add up"], [/Ambiguous date/, 'Ambiguous date'], [/duplicate/i, 'Possible duplicate'], [/Non-Canadian governing law/, 'Non-Canadian governing law'], [/Quebec party/, 'Quebec party: French version?'], [/disagree/, 'Two reads disagree'], [/privacy clause/i, 'No privacy clause']]; for (const [re, l] of R) if (re.test(m)) return l; return /not found/.test(m) ? 'Missing ' + String(k).replace(/_raw$/, '').replace(/_/g, ' ') : m.slice(0, 40); };
  const docLabel = (r) => r.invoice_number || (String(r.file_name).match(/NDA-\d+/) || [r.doc_type === 'nda' ? 'NDA' : r.doc_id])[0];
  const party = (r) => r.doc_type === 'nda' ? (clean(r.supplier_or_party).split(/;\s*/).find((x) => !/cognizant/i.test(x)) || clean(r.supplier_or_party)) : clean(r.supplier_or_party);
  const log = (r, event, detail) => sd.audit.unshift({ timestamp: now(), doc_id: r.doc_id, file_name: r.file_name, actor_type: 'Human', actor: 'Demo reviewer', event, detail: detail || '' });

  // ---------- actions ----------
  let notice = '';
  if (q.reset === '1') { sd.results = []; sd.audit = []; sd.seen = {}; notice = 'Demo data cleared.'; }
  const r0 = q.id ? find(q.id) : null;
  if (r0 && q.act) {
    r0.resolutions = r0.resolutions || {};
    const f = fieldsOf(r0);
    if (q.act === 'resolve' && q.field) {
      const before = (f[q.field] || {}).value || '';
      r0.resolutions[q.field] = { value: q.value ?? before, reason: q.reason || 'Verified on document', at: now() };
      log(r0, `Resolved ${q.field}`, `${before === (q.value ?? before) ? 'Value kept' : `"${before}" → "${q.value}"`} · Reason: ${q.reason || 'Verified on document'}`);
      notice = 'Issue resolved and logged.';
    } else if (q.act === 'exception') {
      r0.status = 'exception'; r0.owner = q.owner || 'AP Lead';
      log(r0, `Sent to exception (owner: ${r0.owner})`, q.reason || ''); notice = `Sent to exception · owner ${r0.owner}.`;
    } else if (q.act === 'approve') {
      if (flagged(r0).length || r0.route === 'manual') notice = r0.route === 'manual' ? 'This document was never read by the AI. Retry extraction or send to exception.' : 'Resolve every issue before approving.';
      else { r0.status = 'approved'; log(r0, 'Approved', 'All issues resolved'); notice = 'Approved and logged.'; }
    } else if (q.act === 'reopen') { r0.status = 'open'; log(r0, 'Reopened', ''); notice = 'Reopened.'; }
  }

  // ---------- shared UI ----------
  const C = { navy: '#000048', blue: '#3C66CE', dblue: '#173793', text: '#000048', muted: '#5A5F7A', line: '#D7DCEA', subtle: '#F4F6FB', canvas: '#EEF1F7' };
  const chip = (t, kind) => { const k = { ok: ['#1F7A45', '#E3F8E7'], warn: ['#B54708', '#FEF0C7'], bad: ['#B42318', '#FEE4E2'], info: ['#3C66CE', '#EEF2FC'], gray: ['#5A5F7A', '#EBEDF3'] }[kind]; return `<span class="chip" style="color:${k[0]};background:${k[1]}">${esc(t)}</span>`; };
  const statusChip = (r) => {
    if (r.status === 'approved') return chip('✓ Approved', 'ok');
    if (r.status === 'exception') return chip('● Exception', 'warn');
    if (r.route === 'manual') return chip('● Manual', 'warn');
    if (r.route === 'audit_sample') return chip('◆ 5% spot audit', 'info');
    return chip('Needs review', 'gray');
  };
  const whyChip = (r) => {
    if (r.status === 'approved') return r.route === 'auto_approve' ? chip('✓ Straight-through', 'ok') : chip('✓ Resolved', 'ok');
    const open = flagged(r);
    if (r.route === 'audit_sample') return chip('◆ 5% spot audit', 'info');
    if (r.route === 'manual') return chip('● ' + (/AI unavailable/.test(r.why_it_needs_you) ? 'AI unavailable · retry' : 'Manual processing'), 'warn');
    if (!open.length) return chip('✓ Ready to approve', 'ok');
    const [k0, v] = open[0]; const msg = short(v.reasons[0], k0);
    return chip((v.status === 'missing' ? '▲ ' : '● ') + msg, v.status === 'missing' ? 'bad' : 'warn') + (open.length > 1 ? ` <span class="muted small">+${open.length - 1} more</span>` : '');
  };
  const url = (p) => '?' + Object.entries(p).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => k + '=' + encodeURIComponent(v)).join('&');
  const NAV = [['queue', 'Document queue'], ['exceptions', 'Exceptions'], ['suppliers', 'Suppliers'], ['audit', 'Audit log'], ['ops', 'Ops dashboard']];
  const shell = (active, body, opts = {}) => page(`
    <aside class="nav"><div class="brand">IDP · AP &amp; Contracts</div><div class="brandsub">Cognizant Canada (internal)</div>
      ${NAV.map(([k, l]) => `<a class="navi ${k === active ? 'on' : ''}" href="${url({ view: k })}">${l}</a>`).join('')}
      <div class="navfoot">Synthetic data only</div></aside>
    <main class="main">${notice ? `<div class="notice">${esc(notice)}</div>` : ''}${body}</main>`, opts);
  const page = (inner, opts = {}) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>IDP · ${esc(opts.title || 'Document queue')}</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:Inter,"Segoe UI",system-ui,Arial,sans-serif;color:${C.text};background:#fff;font-size:15px}
a{color:inherit;text-decoration:none}.muted{color:${C.muted}}.small{font-size:13px}
.nav{position:fixed;inset:0 auto 0 0;width:232px;background:${C.navy};color:#fff;padding:28px 12px}
.brand{font-weight:700;font-size:15px;padding:0 12px;white-space:nowrap}.fn{max-width:190px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nw{white-space:nowrap}.brandsub{font-size:12px;color:#AEB6D9;padding:4px 12px 28px}
.navi{display:block;padding:9px 16px;border-radius:6px;margin-bottom:8px;font-size:15px}.navi:hover{background:#0B0B5C}.navi.on{background:${C.dblue};font-weight:600}
.navfoot{position:absolute;bottom:24px;left:24px;font-size:12px;color:#AEB6D9}
.main{margin-left:232px;padding:32px 32px 48px}
h1{font-size:28px;margin:0}.sub{color:${C.muted};margin:6px 0 0}
.head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:20px}
.btn{display:inline-block;padding:10px 16px;border-radius:8px;border:1px solid ${C.line};background:#fff;font-weight:600;font-size:14px;cursor:pointer;color:${C.text};font-family:inherit}
.btn.primary{background:${C.navy};border-color:${C.navy};color:#fff}.btn.dis{background:#E3E6EF;border-color:#E3E6EF;color:#8A8FA6;cursor:not-allowed}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px}.kpis.k6{grid-template-columns:repeat(3,1fr)}
.kpi{border:1px solid ${C.line};border-radius:10px;padding:14px 16px}.kpi .l{font-size:13px;color:${C.muted};font-weight:500}.kpi .v{font-size:28px;font-weight:700;margin:4px 0}
.tabs{display:flex;gap:32px;border-bottom:1px solid ${C.line};margin-bottom:16px}.tab{padding:8px 0;color:${C.muted}}.tab.on{color:${C.text};font-weight:600;border-bottom:2px solid ${C.navy}}
table{border-collapse:collapse;width:100%}th{background:${C.subtle};color:${C.muted};font-size:13px;font-weight:600;text-align:left;padding:12px}
th:first-child{border-radius:6px 0 0 6px}th:last-child{border-radius:0 6px 6px 0}td{padding:14px 12px;border-bottom:1px solid ${C.line};vertical-align:middle}
tr.row:hover td{background:${C.subtle};cursor:pointer}.chip{display:inline-block;padding:4px 10px;border-radius:12px;font-size:12px;font-weight:600;white-space:nowrap}
.notice{background:#EEF2FC;color:${C.blue};padding:10px 14px;border-radius:8px;margin-bottom:16px;font-weight:500}
.empty{padding:48px;text-align:center;color:${C.muted};border:1px dashed ${C.line};border-radius:10px}
/* review */
.top{position:fixed;top:0;left:0;right:0;height:64px;background:${C.navy};color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 24px;z-index:5}
.crumb{color:#fff;font-weight:500}.keys{color:#AEB6D9;font-size:13px}
.split{display:grid;grid-template-columns:50% 50%;position:fixed;top:64px;bottom:0;left:0;right:0}
.docpane{background:${C.canvas};padding:16px 24px;display:flex;flex-direction:column;gap:8px}.docpane iframe{flex:1;width:100%;border:1px solid ${C.line};background:#fff;border-radius:2px}
.panel{overflow:auto;padding:24px 24px 96px}.ph{display:flex;justify-content:space-between;align-items:flex-start}.ph h2{font-size:22px;margin:0}
.sec{font-size:13px;font-weight:600;color:${C.muted};margin:20px 0 8px;text-transform:uppercase;letter-spacing:.2px}
.f{display:grid;grid-template-columns:170px 1fr 136px 44px;align-items:center;gap:8px;border:1px solid ${C.line};border-radius:6px;padding:11px 14px;margin-bottom:8px}
.f .lab{color:${C.muted}}.f .val{font-weight:500;word-break:break-word}.f .src{color:${C.blue};font-weight:600;font-size:13px;cursor:help}
.f.bad{border-color:#B42318;background:#FFF6F5}.f.warn{border-color:#E8A302;background:#FFFBEB}
.why{border-radius:6px;padding:12px 14px;margin:-4px 0 12px;font-size:14px}.why.bad{background:#FFF6F5}.why.warn{background:#FFFBEB}
.why .acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;align-items:center}
.why input,.why select{padding:9px 10px;border:1px solid ${C.line};border-radius:8px;font:inherit;font-size:14px;color:${C.text};background:#fff}
.foot{position:fixed;bottom:0;left:50%;right:0;height:64px;border-top:1px solid ${C.line};background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 24px}
.drawer{position:fixed;top:0;right:0;bottom:0;width:520px;background:#fff;border-left:1px solid ${C.line};box-shadow:-8px 0 24px rgba(0,0,72,.12);z-index:10;overflow:auto;padding:28px}
.scrim{position:fixed;inset:0;background:rgba(0,0,72,.25);z-index:9}
.ev{display:grid;grid-template-columns:12px 1fr;gap:12px;padding-bottom:18px}.dot{width:12px;height:12px;border-radius:6px;margin-top:4px}
.bars{display:flex;align-items:flex-end;gap:28px;height:220px;padding:16px 8px 0}.bar{width:64px;border-radius:4px 4px 0 0}
.card{border:1px solid ${C.line};border-radius:10px;padding:20px}
.upwrap{position:fixed;inset:0;background:rgba(0,0,72,.35);z-index:20;align-items:center;justify-content:center}
.upbox{background:#fff;border-radius:12px;padding:24px;width:620px;max-width:94vw;box-shadow:0 12px 40px rgba(0,0,72,.25)}
.drop{display:flex;flex-direction:column;align-items:center;gap:6px;border:2px dashed ${C.line};border-radius:10px;padding:32px;cursor:pointer;background:${C.subtle}}.drop:hover{border-color:${C.blue}}
.urow{display:grid;grid-template-columns:1fr 70px 150px;gap:8px;align-items:center;padding:10px 0;border-bottom:1px solid ${C.line}}
.dragcover{display:none;position:fixed;inset:12px;border:3px dashed ${C.blue};border-radius:16px;background:rgba(238,242,252,.9);z-index:30;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:${C.blue};pointer-events:none}
</style></head><body>${inner}
<script>
(function(){try{if(location.search.indexOf('act=')>-1||location.search.indexOf('reset=')>-1){var p=new URLSearchParams(location.search);['act','field','value','reason','owner','reset'].forEach(function(k){p.delete(k)});history.replaceState(null,'','?'+p.toString())}}catch(e){}
window.go=function(o){var p=new URLSearchParams(location.search);['act','field','value','reason','owner','reset'].forEach(function(k){p.delete(k)});for(var k in o)p.set(k,o[k]);location.href='?'+p.toString()};
document.addEventListener('keydown',function(e){if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;var a=document.getElementById('approve'),x=document.getElementById('exc');if(e.key==='a'&&a&&!a.disabled)a.click();if(e.key==='x'&&x)x.click()});
${opts.live ? "setInterval(function(){if(!window.__hold&&(!document.activeElement||document.activeElement===document.body))location.reload()},6000);" : ''}})();
</script></body></html>`;

  const view = q.view || (q.id ? 'doc' : 'queue');
  const sorted = [...sd.results].sort((a, b) => (flagged(b).filter(([, v]) => v.status === 'missing').length - flagged(a).filter(([, v]) => v.status === 'missing').length) || String(b.processed_at).localeCompare(String(a.processed_at)));
  const needs = sd.results.filter((r) => !['approved', 'exception'].includes(r.status));  // includes Manual: they need a person too
  const exc = sd.results.filter((r) => r.status === 'exception');
  const autoA = sd.results.filter((r) => r.route === 'auto_approve');
  const stp = sd.results.length ? Math.round((autoA.length / sd.results.length) * 100) : 0;
  const amount = (r) => r.doc_type === 'invoice' && r.total !== '' && r.total != null ? '$' + Number(r.total).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'n/a';
  const time = (t) => { try { return new Date(t).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' }); } catch { return ''; } };
  const kpi = (l, v, s) => `<div class="kpi"><div class="l">${l}</div><div class="v">${v}</div><div class="muted small">${s}</div></div>`;
  const docTable = (rows) => rows.length ? `<table><tr><th>Document</th><th>Type</th><th>Supplier or party</th><th>Prov.</th><th>Amount (CAD)</th><th>Why it needs you</th><th>Received</th><th>Status</th></tr>
    ${rows.map((r) => `<tr class="row" onclick="location.href='${url({ view: 'doc', id: r.doc_id })}'"><td><b>${esc(docLabel(r))}</b><div class="muted small fn" title="${esc(r.file_name)}">${esc(r.file_name)}</div></td>
      <td>${r.doc_type === 'nda' ? 'NDA' : r.doc_type === 'invoice' ? 'Invoice' : 'Other'}${r.language === 'fr' ? ' · FR' : ''}</td><td>${esc(party(r))}</td><td>${esc(r.place_of_supply || r.supplier_province || '')}</td>
      <td>${amount(r)}</td><td>${whyChip(r)}</td><td class="muted nw">${time(r.processed_at)}</td><td>${statusChip(r)}</td></tr>`).join('')}</table>`
    : `<div class="empty">No documents here yet. Click Upload documents or drag files onto this page.</div>`;

  // ---------- S1 queue / exceptions ----------
  if (view === 'queue' || view === 'exceptions') {
    const tab = view === 'exceptions' ? 'exceptions' : (q.tab || 'review');
    const sets = { review: needs, auto: autoA, exceptions: exc, all: sorted };
    const rows = sorted.filter((r) => sets[tab].includes(r));
    const tabs = [['review', `Needs review (${needs.length})`], ['auto', 'Auto-approved'], ['exceptions', `Exceptions (${exc.length})`], ['all', 'All']];
    return shell(view, `<div class="head"><div><h1>${view === 'exceptions' ? 'Exceptions' : 'Document queue'}</h1><p class="sub">Invoices and NDAs waiting for a person. Sorted by risk, then most recent.</p></div>
      <div style="display:flex;gap:12px"><button class="btn primary" onclick="openUp()">Upload documents</button><a class="btn" href="${url({ view: 'queue', tab, reset: '1' })}" onclick="return confirm('Clear all demo data?')">Reset demo</a></div></div>
      <div id="up" class="upwrap" style="display:none" onclick="if(event.target===this)closeUp()"><div class="upbox">
        <div style="display:flex;justify-content:space-between;align-items:center"><h2 style="margin:0;font-size:20px">Upload documents</h2><button class="btn" onclick="closeUp()">✕</button></div>
        <p class="muted small" style="margin:6px 0 16px">Invoices or NDAs · PDF, PNG or JPG · max 20 MB each · synthetic data only</p>
        <label id="drop" class="drop"><input id="files" type="file" multiple accept=".pdf,.png,.jpg,.jpeg" style="display:none" onchange="pick(this.files)"><b>Drop files here</b><span class="muted small">or click to browse</span></label>
        <div id="ulist" style="margin-top:16px"></div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px"><span id="unote" class="muted small">Each document takes about 20 seconds (two Gemini reads + Canadian rules).</span><button id="ugo" class="btn primary" onclick="startUp()" disabled>Upload and process</button></div>
      </div></div>
      <div id="dragcover" class="dragcover">Drop to upload</div>
      <script>
      (function(){var Q=[],busy=false;
        window.openUp=function(){document.getElementById('up').style.display='flex';window.__hold=true};
        window.closeUp=function(){if(busy&&!confirm('Uploads are still running. Close anyway?'))return;document.getElementById('up').style.display='none';window.__hold=false;if(Q.length)location.reload()};
        function row(f,i){return '<div class="urow" id="ur'+i+'"><span>'+f.name.replace(/[<>&]/g,'')+'</span><span class="muted small">'+Math.max(1,Math.round(f.size/1024))+' KB</span><span class="chip" id="us'+i+'" style="color:#5A5F7A;background:#EBEDF3">Ready</span></div>'}
        window.pick=function(list){var ok=/\.(pdf|png|jpe?g)$/i;for(var j=0;j<list.length;j++){var f=list[j];if(!ok.test(f.name)||f.size>20*1024*1024){alert(f.name+': PDF, PNG or JPG up to 20 MB only');continue}if(!Q.some(function(x){return x.name===f.name&&x.size===f.size}))Q.push(f)}
          document.getElementById('ulist').innerHTML=Q.map(row).join('');document.getElementById('ugo').disabled=!Q.length||busy};
        function set(i,t,fg,bg){var s=document.getElementById('us'+i);if(s){s.textContent=t;s.style.color=fg;s.style.background=bg}}
        window.startUp=function(){if(busy||!Q.length)return;busy=true;document.getElementById('ugo').disabled=true;var i=0;
          (function next(){if(i>=Q.length){busy=false;document.getElementById('unote').textContent='All sent. The queue refreshes as each result arrives.';setTimeout(function(){location.reload()},20000);return}
            var k=i,fd=new FormData();fd.append('Document',Q[k],Q[k].name);set(k,'Uploading…','#3C66CE','#EEF2FC');
            fetch('/webhook/idp-upload',{method:'POST',body:fd,mode:'no-cors'}).then(function(){set(k,'Processing ~20 s','#B54708','#FEF0C7');
              var left=k<Q.length-1?22:0;setTimeout(function(){set(k,'✓ Sent to pipeline','#1F7A45','#E3F8E7');i++;next()},left*1000)})
            .catch(function(e){set(k,'▲ Failed','#B42318','#FEE4E2');i++;next()})})()};
        var dc=document.getElementById('dragcover'),depth=0;
        document.addEventListener('dragenter',function(e){e.preventDefault();depth++;dc.style.display='flex'});
        document.addEventListener('dragleave',function(){if(--depth<=0){depth=0;dc.style.display='none'}});
        document.addEventListener('dragover',function(e){e.preventDefault()});
        document.addEventListener('drop',function(e){e.preventDefault();depth=0;dc.style.display='none';if(e.dataTransfer&&e.dataTransfer.files.length){openUp();pick(e.dataTransfer.files)}});
      })();
      </script>
      <div class="kpis">${kpi('Needs review', needs.length, 'open documents')}${kpi('Auto-approved', autoA.length, stp + '% straight-through')}${kpi('Exceptions', exc.length, 'owner assigned')}${kpi('Processed', sd.results.length, 'documents in this demo')}</div>
      <div class="tabs">${tabs.map(([k, l]) => `<a class="tab ${k === tab ? 'on' : ''}" href="${url({ view: 'queue', tab: k })}">${l}</a>`).join('')}</div>${docTable(rows)}`, { live: true, title: 'Document queue' });
  }

  // ---------- S5 ops ----------
  if (view === 'ops') {
    let tot = 0, ver = 0; const reasons = {};
    for (const r of sd.results) { for (const v of Object.values(fieldsOf(r))) { if (v.value || v.status !== 'missing') { tot++; if (v.status === 'verified') ver++; } } for (const z of Object.values(r.resolutions || {})) reasons[z.reason] = (reasons[z.reason] || 0) + 1; }
    const counts = [['Auto-approved', autoA.length, C.blue], ['Needs review', needs.length, '#B7C6EE'], ['Exceptions', exc.length, '#E8A302'], ['Approved by reviewer', sd.results.filter((r) => r.status === 'approved' && r.route !== 'auto_approve').length, C.navy]];
    const mx = Math.max(1, ...counts.map((c) => c[1]));
    const rs = Object.entries(reasons).sort((a, b) => b[1] - a[1]); const rmax = Math.max(1, ...rs.map((x) => x[1]));
    return shell('ops', `<div class="head"><div><h1>Ops dashboard</h1><p class="sub">This demo session · synthetic data · amounts in CAD</p></div></div>
      <div class="kpis k6">${kpi('Verified-field rate', (tot ? Math.round((ver / tot) * 100) : 0) + '%', 'grounded + two reads agree + rules pass')}${kpi('Straight-through rate', stp + '%', 'target 40 to 60%')}${kpi('Processed', sd.results.length, 'documents')}
      ${kpi('Open in review', needs.length, 'waiting for a person')}${kpi('Exceptions', exc.length, 'owner assigned')}${kpi('Reviewer decisions', sd.audit.filter((e) => e.actor_type === 'Human').length, 'logged to audit trail')}</div>
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:16px"><div class="card"><b>Documents by outcome</b><div class="bars">${counts.map(([l, v, c]) => `<div style="text-align:center"><div class="small" style="font-weight:600">${v}</div><div class="bar" style="height:${Math.max(4, (v / mx) * 170)}px;background:${c}"></div><div class="small muted" style="margin-top:6px;width:80px">${l}</div></div>`).join('')}</div></div>
      <div class="card"><b>Top correction reasons</b>${rs.length ? rs.map(([k, v]) => `<div style="margin-top:14px"><div style="display:flex;justify-content:space-between"><span>${esc(k)}</span><b>${v}</b></div><div style="height:8px;background:${C.subtle};border-radius:4px;margin-top:6px"><div style="height:8px;width:${(v / rmax) * 100}%;background:${C.blue};border-radius:4px"></div></div></div>`).join('') : '<p class="muted">No reviewer corrections yet.</p>'}</div></div>`, { live: true, title: 'Ops dashboard' });
  }

  // ---------- suppliers ----------
  if (view === 'suppliers') {
    const sup = {};
    for (const r of sd.results.filter((x) => x.doc_type === 'invoice')) { const f = fieldsOf(r); const k = clean(r.supplier_or_party) || 'Unknown'; const s = sup[k] = sup[k] || { n: 0, prov: r.supplier_province, bn: (f.gst_hst_number || {}).value, qst: (f.qst_number || {}).value }; s.n++; }
    const rows = Object.entries(sup);
    return shell('suppliers', `<div class="head"><div><h1>Suppliers</h1><p class="sub">Built from processed invoices. Registration numbers drive ITC / ITR eligibility.</p></div></div>
      ${rows.length ? `<table><tr><th>Supplier</th><th>Province</th><th>GST/HST number</th><th>QST number</th><th>Invoices</th></tr>${rows.map(([k, s]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(s.prov || '')}</td><td>${esc(s.bn || '') || chip('▲ Missing', 'bad')}</td><td>${s.qst ? esc(s.qst) : s.prov === 'QC' ? chip('▲ Missing', 'bad') : '<span class="muted">n/a</span>'}</td><td>${s.n}</td></tr>`).join('')}</table>` : '<div class="empty">No invoices yet.</div>'}`, { title: 'Suppliers' });
  }

  // ---------- audit log (S4 full page) ----------
  const timeline = (evs) => evs.length ? evs.map((e) => { const human = e.actor_type === 'Human'; return `<div class="ev"><div class="dot" style="background:${human ? C.navy : C.blue}"></div><div><div class="small muted">${time(e.timestamp)} &nbsp;${chip(e.actor, human ? 'gray' : 'info')}</div><div style="font-weight:500;margin-top:6px">${esc(e.event)}</div>${e.detail ? `<div class="small muted" style="margin-top:2px">${esc(e.detail)}</div>` : ''}${!q.id && e.file_name ? `<div class="small muted">${esc(e.file_name)}</div>` : ''}</div></div>`; }).join('') : '<p class="muted">No events yet.</p>';
  if (view === 'audit') return shell('audit', `<div class="head"><div><h1>Audit log</h1><p class="sub">Append-only. Every AI and human action, kept 6+ years for CRA.</p></div></div><div class="card" style="max-width:820px">${timeline(sd.audit)}</div>`, { title: 'Audit log' });

  // ---------- S2 / S3 review ----------
  const r = r0;
  if (!r) return shell('queue', `<div class="empty">Document not found. It may have been cleared. <a style="color:${C.blue}" href="${url({ view: 'queue' })}">Back to queue</a></div>`);
  const done = ['approved', 'exception'].includes(r.status);
  const f = fieldsOf(r), res = r.resolutions || {}, open = r.route === 'manual' ? [['_manual', { reasons: [r.why_it_needs_you] }]] : flagged(r), isNda = r.doc_type === 'nda';
  const LABEL = { supplier_name: 'Legal name', supplier_province: 'Province', gst_hst_number: 'GST/HST number', qst_number: 'QST number', invoice_number: 'Invoice number', invoice_date_raw: 'Invoice date', due_date_raw: 'Due date', payment_terms: 'Payment terms', po_number: 'PO number', bill_to_province: 'Place of supply (bill-to)', subtotal: 'Subtotal', gst_amount: 'GST', hst_amount: 'HST', qst_amount: 'QST', pst_amount: 'PST', total: 'Total', currency: 'Currency', parties: 'Parties', nda_type: 'Type', effective_date: 'Effective date', term: 'Term', confidentiality_period: 'Confidentiality period', governing_law: 'Governing law', privacy_clause: 'Privacy clause', quebec_party: 'Quebec party' };
  const SECTIONS = isNda ? [['Parties and term', ['parties', 'nda_type', 'effective_date', 'term', 'confidentiality_period']], ['Risk checks (Canadian playbook)', ['governing_law', 'privacy_clause', 'quebec_party']]]
    : [['Supplier', ['supplier_name', 'supplier_province', 'gst_hst_number', 'qst_number']], ['Invoice', ['invoice_number', 'invoice_date_raw', 'due_date_raw', 'payment_terms', 'po_number', 'bill_to_province']], ['Amounts', ['currency', 'subtotal', 'gst_amount', 'hst_amount', 'qst_amount', 'pst_amount', 'total']]];
  const dateOpts = (raw) => { const m = String(raw).match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/); if (!m) return []; const mo = (n) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][n - 1]; const iso = (d, mth) => `${m[3]}-${String(mth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return [[`${+m[2]} ${mo(+m[1])} ${m[3]}`, iso(+m[2], +m[1]), 'Supplier uses MM/DD'], [`${+m[1]} ${mo(+m[2])} ${m[3]}`, iso(+m[1], +m[2]), 'Supplier uses DD/MM']]; };
  const js = (o) => esc(JSON.stringify(o));
  const fieldRow = (k) => {
    const v = f[k] || { value: '', status: 'missing', reasons: [] }; const z = res[k]; const reasons = v.reasons || [];
    if (!v.value && !reasons.length && !z) return '';
    const kind = z ? 'ok' : reasons.length ? (v.status === 'missing' ? 'bad' : 'warn') : v.auto ? 'info' : v.status === 'verified' ? 'ok' : v.status === 'check' ? 'warn' : 'bad';
    const label = z ? '✓ Resolved' : reasons.length ? (v.status === 'missing' ? (isNda ? '▲ Risk' : (v.value ? '▲ Invalid' : '▲ Missing')) : '▲ Check') : v.auto ? '✓ Auto-resolved' : (isNda ? '✓ Found' : '✓ Verified');
    const shown = z ? (k === 'invoice_date_raw' && /^\d{4}-/.test(z.value) ? z.value : z.value) : (v.display || v.value);
    let out = `<div class="f ${!z && reasons.length ? kind : ''}"><span class="lab">${esc(LABEL[k] || k)}</span><span class="val">${esc(shown) || '<span class="muted">Not found</span>'}</span><span>${chip(label, kind)}</span><span class="src" title="${esc(v.source_quote ? 'Source: “' + v.source_quote + '”' : 'No source text')}" ${v.source_quote ? `onclick="window.flash && flash('${k}')"` : ''}>${v.source_quote ? 'p' + (v.page || 1) + ' ↗' : 'none'}</span></div>`;
    if (z) out += `<div class="why" style="background:${C.subtle}"><span class="muted small">Resolved · ${esc(z.reason)}</span></div>`;
    if (!z && v.note && !reasons.length) out += `<div class="why" style="background:${C.subtle};padding:8px 14px"><span class="small muted">Note · ${esc(v.note)}</span></div>`;
    if (!z && v.auto && !reasons.length) out += `<div class="why" style="background:#EEF2FC;padding:8px 14px"><span class="small" style="color:#3C66CE">AI auto-resolved · ${esc(v.auto)}${v.display && v.display !== v.value ? ' · printed as “' + esc(v.value) + '”' : ''}</span></div>`;
    if (!z && reasons.length && !['approved'].includes(r.status)) {
      const dates = k === 'invoice_date_raw' ? dateOpts(v.value) : [];
      const isLaw = k === 'governing_law' || k === 'quebec_party';
      out += `<div class="why ${kind}">Why: ${esc(reasons.join(' · '))}<div class="acts">
        ${dates.length ? dates.map(([lbl, iso, why]) => `<button class="btn" onclick='go(${js({ act: 'resolve', field: k, value: iso, reason: why })})'>${esc(lbl)}</button>`).join('')
        : isLaw ? `<button class="btn" onclick='go(${js({ act: 'exception', owner: 'Legal', reason: reasons[0] })})'>Escalate to Legal</button>
           <select id="r_${k}"><option>Approved by Legal</option><option>Client standard terms</option><option>French version on file</option></select><button class="btn" onclick="go({act:'resolve',field:'${k}',reason:document.getElementById('r_${k}').value})">Accept with reason</button>`
        : `<input id="v_${k}" value="${esc(v.value)}" placeholder="Correct value" style="width:200px">
           <select id="r_${k}"><option>Verified on document</option><option>Corrected from document</option><option>Requested from supplier</option><option>Confirmed with supplier</option><option>Not a duplicate</option></select>
           <button class="btn" onclick="go({act:'resolve',field:'${k}',value:document.getElementById('v_${k}').value,reason:document.getElementById('r_${k}').value})">Resolve</button>`}</div></div>`;
    }
    return out;
  };
  const title = isNda ? clean(r.supplier_or_party || 'NDA').replace(/;\s*/, ' × ') : (f.supplier_name || {}).value || r.supplier_or_party || r.file_name;
  const meta = r.route === 'manual' ? ['Not yet read by AI'] : isNda ? [docLabel(r), (f.nda_type || {}).value, r.language === 'fr' ? 'French' : 'English'] : [r.invoice_number, 'Invoice', (r.supplier_province || '') + ' supplier', (f.currency || {}).value || 'CAD'];
  const headChip = r.status === 'approved' ? chip('✓ Approved', 'ok') : r.status === 'exception' ? chip('● Exception · ' + (r.owner || ''), 'warn') : open.length ? chip(`▲ ${open.length} ${isNda ? 'risk flag' : 'issue'}${open.length > 1 ? 's' : ''} to resolve`, 'bad') : chip('✓ Ready to approve', 'ok');
  const marks = Object.entries(f).filter(([, v]) => v.source_quote).map(([k, v]) => ({ k, q: v.source_quote, c: res[k] ? 'ok' : (v.reasons || []).length ? (v.status === 'missing' ? 'bad' : 'warn') : 'ok' }));
  const pdf = r.pdf && /pdf/.test(r.mime || 'application/pdf') ? `<div id="pages" style="flex:1;overflow:auto"></div><script type="application/json" id="pdfdata">${JSON.stringify({ b64: r.pdf, marks }).replace(/</g, '\\u003c')}</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>(function () {
  var D = JSON.parse(document.getElementById('pdfdata').textContent);
  var host = document.getElementById('pages');
  if (!window.pdfjsLib) { host.innerHTML = '<div class="empty">Preview needs an internet connection to load PDF.js.</div>'; return; }
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  var bytes = Uint8Array.from(atob(D.b64), function (c) { return c.charCodeAt(0); });
  var COL = { ok: '#3C66CE', warn: '#E8A302', bad: '#B42318' };
  var norm = function (s) { return String(s).toLowerCase().replace(/[^a-z0-9à-ÿ]/g, ''); };
  window._boxes = {};
  function drawPage(doc, n) {
    return doc.getPage(n).then(function (pg) {
      var w = host.clientWidth - 8;
      var vp0 = pg.getViewport({ scale: 1 });
      var vp = pg.getViewport({ scale: w / vp0.width });
      var wrap = document.createElement('div');
      wrap.style.cssText = 'position:relative;margin:0 auto 12px;width:' + vp.width + 'px;box-shadow:0 1px 3px rgba(0,0,72,.12);background:#fff';
      var cv = document.createElement('canvas');
      cv.width = vp.width * 2; cv.height = vp.height * 2;
      cv.style.width = vp.width + 'px'; cv.style.display = 'block';
      wrap.appendChild(cv); host.appendChild(wrap);
      return pg.render({ canvasContext: cv.getContext('2d'), viewport: pg.getViewport({ scale: 2 * w / vp0.width }) }).promise
        .then(function () { return pg.getTextContent(); })
        .then(function (tc) {
          tc.items.forEach(function (it) {
            var s = norm(it.str);
            if (s.length < 3) return;
            D.marks.forEach(function (m) {
              var q = norm(m.q);
              if (!(q.indexOf(s) > -1 || (s.indexOf(q) > -1 && q.length > 3))) return;
              var t = pdfjsLib.Util.transform(vp.transform, it.transform);
              var h = Math.hypot(t[2], t[3]), x = t[4], y = t[5] - h, wd = it.width * vp.scale;
              var b = document.createElement('div');
              b.style.cssText = 'position:absolute;left:' + (x - 4) + 'px;top:' + (y - 3) + 'px;width:' + (wd + 8) + 'px;height:' + (h + 7) + 'px;border:2px solid ' + COL[m.c] + ';border-radius:4px;transition:background .3s';
              wrap.appendChild(b);
              (window._boxes[m.k] = window._boxes[m.k] || []).push(b);
            });
          });
        });
    });
  }
  window.flash = function (k) {
    (window._boxes[k] || []).forEach(function (b, i) {
      if (!i) b.scrollIntoView({ block: 'center', behavior: 'smooth' });
      b.style.background = 'rgba(60,102,206,.25)';
      setTimeout(function () { b.style.background = 'transparent'; }, 1200);
    });
  };
  pdfjsLib.getDocument({ data: bytes, isEvalSupported: false }).promise.then(function (doc) {
    var chain = Promise.resolve();
    for (var i = 1; i <= doc.numPages; i++) (function (n) { chain = chain.then(function () { return drawPage(doc, n); }); })(i);
    return chain;
  }).catch(function (e) { host.innerHTML = '<div class="empty">Preview failed: ' + e.message + '</div>'; });
})();
</script>`
    : `<div class="empty" style="flex:1">Original not stored for this document.</div>`;
  const audits = sd.audit.filter((e) => e.doc_id === r.doc_id);
  return page(`<div class="top"><a class="crumb" href="${url({ view: 'queue' })}">← Queue &nbsp;/&nbsp; ${esc(docLabel(r))}</a>
    <span class="keys">Keyboard: A approve · X exception</span><a class="btn" href="${url({ view: 'doc', id: r.doc_id, audit: '1' })}">Audit trail</a></div>
  <div class="split"><div class="docpane"><span class="small muted">${esc(r.file_name)} · Language detected: ${r.language === 'fr' ? 'French' : 'English'}</span>${pdf}</div>
  <div class="panel">${notice ? `<div class="notice">${esc(notice)}</div>` : ''}<div class="ph"><div><h2>${esc(title)}</h2><div class="muted" style="margin-top:6px">${meta.filter(Boolean).map(esc).join(' · ')}</div></div>${headChip}</div>
    <p class="small muted">Extracted by Gemini, validated by Canadian rules. Hover “p1 ↗” to see the exact source text.${r.language === 'fr' ? ' French document, fields shown in English.' : ''}</p>
${r.route === 'manual' ? '<div class="why warn" style="margin-top:16px"><b>' + esc(r.why_it_needs_you) + '</b><div class="acts">' + (r.pdf && !done ? '<button class="btn primary" id="retry" onclick="retryAI(this)">Retry AI extraction</button>' : '') + '<span class="small muted">Or send to exception and key the fields manually.</span></div></div><script>window.retryAI=function(btn){btn.disabled=true;btn.textContent=\'Sending…\';var d=JSON.parse(document.getElementById(\'pdfdata\').textContent);var b=Uint8Array.from(atob(d.b64),function(c){return c.charCodeAt(0)});var fd=new FormData();fd.append(\'Document\',new Blob([b],{type:\'application/pdf\'}),' + esc(JSON.stringify(r.file_name || 'document.pdf')).replace(/&quot;/g, '"') + ');fetch(\'/webhook/idp-upload\',{method:\'POST\',body:fd,mode:\'no-cors\'}).then(function(){go({act:\'exception\',owner:\'AI retry\',reason:\'Re-sent to pipeline\'})})}</script>' : ''}
    ${SECTIONS.map(([s, ks]) => { const rows = ks.map(fieldRow).join(''); return rows ? `<div class="sec">${s}</div>${rows}` : ''; }).join('')}</div></div>
  <div class="foot">${done ? `${statusChip(r)}<button class="btn" onclick="go({act:'reopen'})">Reopen</button>`
    : `<button id="exc" class="btn" onclick="go({act:'exception',owner:'AP Lead'})">Send to exception (X)</button><span class="small muted">${open.length ? `Resolve ${open.length} ${isNda ? 'risk flag' : 'issue'}${open.length > 1 ? 's' : ''} to approve` : 'All checks passed'}</span>
       <button id="approve" class="btn ${open.length ? 'dis' : 'primary'}" ${open.length ? 'disabled' : ''} onclick="go({act:'approve'})">Approve (A)</button>`}</div>
  ${q.audit === '1' ? `<a class="scrim" href="${url({ view: 'doc', id: r.doc_id })}"></a><div class="drawer"><div style="display:flex;justify-content:space-between"><div><h2 style="margin:0">Audit trail</h2><div class="muted small" style="margin-top:6px">${esc(r.invoice_number || r.doc_id)} · Append-only · Retain 6+ years</div></div><a class="btn" href="${url({ view: 'doc', id: r.doc_id })}">✕</a></div><div style="margin-top:24px">${timeline(audits)}</div></div>` : ''}`, { title: r.invoice_number || 'Review' });
}
if (typeof module !== 'undefined') module.exports = { renderApp };
