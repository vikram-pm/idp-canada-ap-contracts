// False-negative test: plant an error that BOTH AI reads agree on (the hardest case),
// then check whether the document is still auto-approved.
const fs=require('fs');const AF=Object.getPrototypeOf(async function(){}).constructor;
const val=new AF('$','$input','$getWorkflowStaticData',fs.readFileSync(require('path').join(__dirname,'..','src','validate.js'),'utf8'));
const truth={};for(const l of fs.readFileSync(''+require('path').join(__dirname,'..','testpack','ground_truth.csv')+'','utf8').trim().split('\n').slice(1)){const m=l.match(/^([^,]+),([^,]+),("[^"]*"|[^,]*)/);if(!m||m[2].startsWith('_'))continue;(truth[m[1]]=truth[m[1]]||{})[m[2]]=m[3].replace(/^"|"$/g,'');}
const cfg={model:'m',amountTolerance:0.02,spotAuditRate:0,defaultPlaceOfSupply:'ON',criticalInvoiceFields:['supplier_name','invoice_number','invoice_date_raw','subtotal','total'],criticalNdaFields:['parties','governing_law']};
const g=(f,t)=>({candidates:[{content:{parts:[{text:JSON.stringify({doc_type:t,language:'en',fields:Object.entries(f).map(([name,value])=>({name,value,source_quote:value||'x',page:1,found:!!value}))})}]}}]});
async function route(f,t,f2){const o=(await val(n=>({first:()=>({json:n==='Prepare request'?{config:cfg,docId:'D',fileName:'x'}:g(f,t)})}),{first:()=>({json:g(f2||f,t)})},()=>({})))[0].json;return o.route;}
const base=truth['02_INV-MR-1001_MapleRidge_ON.pdf'];
const nda=truth['07_NDA-0193_Northshore_NY-law.pdf'];
const M=[
 ['Subtotal misread (+10%)',f=>({...f,subtotal:'$11,000.00'})],
 ['HST amount misread',f=>({...f,hst_amount:'$1,200.00'})],
 ['Total misread',f=>({...f,total:'$11,800.00'})],
 ['Bill-to province misread (ON→AB)',f=>({...f,bill_to_province:'AB'})],
 ['Supplier province misread (ON→QC)',f=>({...f,supplier_province:'QC'})],
 ['Invoice date misread',f=>({...f,invoice_date_raw:'2026-09-25'})],
 ['Invoice number misread',f=>({...f,invoice_number:'MR-1007'})],
 ['Supplier name misread',f=>({...f,supplier_name:'Maple Ridge Services Inc.'})],
 ['GST/HST number: one digit wrong',f=>({...f,gst_hst_number:'123456780RT0001'})],
 ['Due date misread',f=>({...f,due_date_raw:'2026-12-15'})],
 ['Currency misread (CAD→USD)',f=>({...f,currency:'USD'})],
 ['PO number misread',f=>({...f,po_number:'PO-9999'})],
];
(async()=>{
 const baseRoute=await route(base,'invoice');console.log('baseline (no error):',baseRoute);
 let caught=0;const rows=[];
 for(const [n,fn] of M){const r=await route(fn(base),'invoice');const ok=r!=='auto_approve';caught+=ok;rows.push([n,r,ok?'CAUGHT':'MISSED']);}
 // NDA: governing law changes that should always be caught
 for(const [n,v] of [['NDA law misread as Ontario (was New York)','Ontario'],['NDA law: Delaware','State of Delaware']]){const r=await route({...nda,governing_law:v},'nda');rows.push([n,r,(v==='Ontario')?(r==='auto_approve'?'MISSED':'CAUGHT'):(r!=='auto_approve'?'CAUGHT':'MISSED')]);if(rows.at(-1)[2]==='CAUGHT')caught++;}
 // single-read error (reads disagree) on a critical field
 const r1=await route(base,'invoice',{...base,total:'$11,800.00'});rows.push(['Total: only one read wrong',r1,r1!=='auto_approve'?'CAUGHT':'MISSED']);if(r1!=='auto_approve')caught++;
 const r2=await route(base,'invoice',{...base,invoice_number:'MR-1007'});rows.push(['Invoice no.: only one read wrong',r2,r2!=='auto_approve'?'CAUGHT':'MISSED']);if(r2!=='auto_approve')caught++;
 rows.forEach(r=>console.log(r.join(' | ')));
 console.log(`\ncaught ${caught}/${rows.length}  false negatives ${rows.length-caught}/${rows.length}`);
 
})();
