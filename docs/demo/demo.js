// Hosts the real reviewer UI (renderApp) inside an iframe and replaces the n8n backend
// with in-browser equivalents: navigation, uploads, pipeline animation and saved state.
(function () {
  var KEY = 'idp-demo-v1';
  var SD = load();
  var Q = '?';
  var frame = document.getElementById('app');
  var STEPS = ['upload', 'prepare', 'read1', 'read2', 'rules', 'route'];
  var queue = Promise.resolve();

  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.results) return s; } catch (e) {}
    return { results: [], audit: [] };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(SD)); } catch (e) {} }

  // Rewrites the server-rendered page so its links, actions and uploads call this controller.
  function shim(html, qs) {
    html = html
      .split('new URLSearchParams(location.search)').join('new URLSearchParams(window.__q)')
      .split("location.href='?'+p.toString()").join("parent.demoNav('?'+p.toString())")
      .replace(/location\.href='(\?[^']*)'/g, "parent.demoNav('$1')")
      .split('location.reload()},20000)').join('location.reload()},3500)')
      .split('location.reload()').join('parent.demoNav(window.__q)')
      .split("fetch('/webhook/idp-upload',").join('parent.demoUpload(')
      .split('var left=k<Q.length-1?22:0').join('var left=k<Q.length-1?3:0')
      .split('Cognizant Canada (internal)').join('Concept · synthetic data');
    var inject = '<script>window.__q=' + JSON.stringify(qs) + ';' +
      "document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^=\"?\"]');if(a&&!e.defaultPrevented){e.preventDefault();parent.demoNav(a.getAttribute('href'))}});</script>";
    return html.replace('</body>', inject + '</body>');
  }

  function nav(qs) {
    Q = qs || '?';
    var q = {};
    new URLSearchParams(Q).forEach(function (v, k) { q[k] = v; });
    var html = renderApp(SD, q);
    save();
    frame.srcdoc = shim(html, Q);
    updateStats();
  }
  window.demoNav = nav;

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function setStep(i, state) {
    var el = document.querySelector('[data-step="' + STEPS[i] + '"]');
    if (el) el.setAttribute('data-state', state);
  }
  function resetSteps() { for (var i = 0; i < STEPS.length; i++) setStep(i, 'idle'); }

  function toB64(buf) {
    var bytes = new Uint8Array(buf), s = '';
    for (var i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  }

  // One document through the pipeline: same validate + store logic as n8n, recorded AI responses.
  function processDoc(name, pdfB64, mime) {
    queue = queue.then(async function () {
      var log = document.getElementById('runlog');
      var sample = SAMPLES[name];
      var docId = 'DOC-' + Date.now().toString(36).toUpperCase();
      log.textContent = 'Processing ' + name + '…';
      resetSteps();
      for (var i = 0; i < STEPS.length - 1; i++) {
        setStep(i, 'active'); await sleep(i === 2 || i === 3 ? 650 : 380); setStep(i, 'done');
      }
      var fail = { error: { message: 'AI not connected in the web demo' } };
      var prep = { config: CFG, docId: docId, receivedAt: new Date().toISOString(), fileName: name };
      var out = (await runValidate(prep, sample ? sample.r1 : fail, sample ? sample.r2 : fail, SD))[0].json;
      if (!sample) out.why_it_needs_you = 'AI not connected in the web demo (only the 8 sample documents have recorded AI responses). In the n8n version Gemini reads any document.';
      SD.results = [Object.assign({}, out, { processed_at: new Date().toISOString(), pdf: pdfB64, mime: mime || 'application/pdf',
        status: out.route === 'auto_approve' ? 'approved' : 'open', resolutions: {} })].concat(SD.results).slice(0, 60);
      SD.audit = [{ timestamp: new Date().toISOString(), doc_id: out.doc_id, file_name: name, actor_type: 'AI', actor: 'Gemini + rules',
        event: 'Extracted, validated, routed to ' + out.route.replace('_', ' '), detail: out.why_it_needs_you }].concat(SD.audit).slice(0, 500);
      setStep(5, out.route === 'auto_approve' ? 'ok' : out.route === 'manual' ? 'warn' : 'flag');
      var label = { auto_approve: 'Auto-approved', review: 'Needs review', audit_sample: 'Spot audit', manual: 'Manual' }[out.route];
      log.innerHTML = '<b>' + (out.invoice_number || name) + '</b> → ' + label + (out.route === 'auto_approve' ? '' : ' · ' + out.why_it_needs_you.replace(/</g, '&lt;'));
      save();
      var w = frame.contentWindow;
      var v = new URLSearchParams(Q).get('view') || 'queue';
      if (!(w && w.__hold) && ['queue', 'exceptions', 'ops', 'audit', 'suppliers'].indexOf(v) > -1) nav(Q);
      else updateStats();
    });
    return queue;
  }

  // Called by the upload panel inside the app (replaces the POST to /webhook/idp-upload).
  window.demoUpload = function (opts) {
    var f = opts && opts.body && opts.body.get('Document');
    if (!f) return Promise.resolve();
    return f.arrayBuffer().then(function (buf) {
      var s = SAMPLES[f.name];
      processDoc(f.name, s ? s.pdf : toB64(buf), f.type || 'application/pdf');
    });
  };

  window.demoSample = function (name) { var s = SAMPLES[name]; processDoc(name, s.pdf, 'application/pdf'); };
  window.demoAll = function () { Object.keys(SAMPLES).forEach(function (n) { window.demoSample(n); }); };
  window.demoReset = function () { SD = { results: [], audit: [] }; resetSteps(); document.getElementById('runlog').textContent = 'Demo cleared. Pick a sample document to start.'; nav('?'); };
  window.demoGo = function (qs) { nav(qs); document.getElementById('demo').scrollIntoView({ behavior: 'smooth' }); };

  function updateStats() {
    var n = SD.results.length, auto = SD.results.filter(function (r) { return r.route === 'auto_approve'; }).length;
    var el = document.getElementById('livestats');
    if (el) el.textContent = n ? n + ' processed · ' + auto + ' auto-approved · ' + (n - auto) + ' need a person' : 'No documents yet';
  }

  // Sample chips
  var chips = document.getElementById('samples');
  Object.keys(SAMPLES).forEach(function (n) {
    var b = document.createElement('button');
    b.className = 'chipbtn';
    b.textContent = n.replace(/^\d+_/, '').replace(/\.pdf$/, '').replace(/_/g, ' ');
    b.title = n;
    b.onclick = function () { window.demoSample(n); };
    chips.appendChild(b);
  });

  nav('?');
})();
