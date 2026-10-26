// ===== n8n Code node: "Prepare request" =====
// Mode: Run Once for All Items. Input: the upload form.

// ---------- CONFIG (single source of truth, edit here) ----------
const config = {
  // Free-tier Flash model. "-latest" aliases move; pin a stable ID from
  // https://ai.google.dev/gemini-api/docs/models before you record demo results.
  model: 'gemini-flash-lite-latest',
  amountTolerance: 0.02,          // CAD rounding tolerance for tax and totals
  spotAuditRate: 0.05,            // 5% of auto-approved docs go to a reviewer
  defaultPlaceOfSupply: 'ON',     // used when bill-to province cannot be read
  criticalInvoiceFields: ['supplier_name', 'invoice_number', 'invoice_date_raw', 'subtotal', 'total'],
  criticalNdaFields: ['parties', 'governing_law'],
};

const item = $input.first();
const binKey = Object.keys(item.binary || {})[0];
if (!binKey) throw new Error('No file received. Upload a PDF, PNG or JPG.');
const meta = item.binary[binKey];
const buf = await this.helpers.getBinaryDataBuffer(0, binKey);

const INVOICE_FIELDS = [
  'supplier_name', 'supplier_address', 'supplier_province', 'gst_hst_number', 'qst_number',
  'bill_to_address', 'bill_to_province', 'invoice_number', 'invoice_date_raw', 'due_date_raw',
  'payment_terms', 'po_number', 'currency', 'subtotal', 'gst_amount', 'hst_amount', 'qst_amount',
  'pst_amount', 'total',
];
const NDA_FIELDS = [
  'parties', 'effective_date', 'nda_type', 'term', 'confidentiality_period',
  'governing_law', 'privacy_clause', 'quebec_party',
];

const schema = {
  type: 'OBJECT',
  properties: {
    doc_type: { type: 'STRING', enum: ['invoice', 'nda', 'other'] },
    language: { type: 'STRING', enum: ['en', 'fr', 'other'] },
    fields: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING' },
          value: { type: 'STRING' },
          source_quote: { type: 'STRING' },
          page: { type: 'INTEGER' },
          found: { type: 'BOOLEAN' },
        },
        required: ['name', 'value', 'source_quote', 'found'],
      },
    },
  },
  required: ['doc_type', 'language', 'fields'],
};

const instructions = `You extract data for Cognizant Canada Accounts Payable and Contracts.
The attached document may be in English or French.

1. Classify doc_type: "invoice" (vendor invoice / facture), "nda" (non-disclosure / confidentiality agreement) or "other".
2. Return one entry in "fields" for EVERY field listed for that type, in the order given.
   Invoice fields: ${INVOICE_FIELDS.join(', ')}
   NDA fields: ${NDA_FIELDS.join(', ')}
3. Rules:
   - Copy each value exactly as printed. Do not convert dates, numbers or currency.
     (TPS = GST, TVH = HST, TVQ = QST, TVP = PST.)
   - source_quote = the exact text span (max 20 words) where you read the value.
   - If a field is not on the document: found=false, value="", source_quote="". Never guess or infer.
   - quebec_party: "Yes" only if a party's address is in Quebec, else "No".
   - Never return bank account, transit, institution or SIN numbers in any field.`;

const pass2 = `

Second, independent read: ignore any earlier answer and re-read the document from the top.
Pay extra attention to tax registration numbers, tax amounts and the invoice date.`;

const mk = (extra, temperature) => ({
  contents: [{
    role: 'user',
    parts: [
      { text: instructions + extra },
      { inlineData: { mimeType: meta.mimeType, data: buf.toString('base64') } },
    ],
  }],
  generationConfig: { temperature, responseMimeType: 'application/json', responseSchema: schema },
});

return [{ json: {
  config,
  docId: 'DOC-' + Date.now().toString(36).toUpperCase(),
  receivedAt: new Date().toISOString(),
  fileName: meta.fileName,
  mimeType: meta.mimeType,
  body1: mk('', 0),
  body2: mk(pass2, 0.4),
}}];
