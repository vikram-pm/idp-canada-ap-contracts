// Saves each result (and the original file for the preview) inside n8n for the reviewer UI.
// Static data persists only for production runs: publish the workflow.
const r = $input.first().json;
const sd = $getWorkflowStaticData('global');
let pdf = '', mime = '';
try { const part = $('Prepare request').first().json.body1.contents[0].parts[1].inlineData; if (part.data.length < 700000) { pdf = part.data; mime = part.mimeType; } } catch (e) {}
sd.results = [{ ...r, processed_at: new Date().toISOString(), pdf, mime, status: r.route === 'auto_approve' ? 'approved' : 'open', resolutions: {} }, ...(sd.results || [])].slice(0, 100);
sd.audit = [{ timestamp: new Date().toISOString(), doc_id: r.doc_id, file_name: r.file_name, actor_type: 'AI',
  actor: 'Gemini + rules', event: 'Extracted, validated, routed to ' + r.route.replace('_', ' '),
  detail: r.why_it_needs_you }, ...(sd.audit || [])].slice(0, 1000);
return [{ json: { stored: true, doc_id: r.doc_id, route: r.route, app: 'http://localhost:5678/webhook/idp-dashboard' } }];
