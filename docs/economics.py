# Economics v2: bottom-up Azure costs (Canada region), re-checked. USD list prices -> CAD at 1.37.
FX=1.37; LAB=40.0; MANUAL_MIN=9.0; STP=0.40; REVIEW_MIN=7.0; AUDIT_RATE,AUDIT_MIN=0.05,3.0; HRS=140; PAGES=1.5
# AI per document (production design: two independent reads from DIFFERENT models)
DI = PAGES*10/1000                              # Azure AI Document Intelligence prebuilt invoice, $10 / 1,000 pages
LLM = (1500*0.44 + 600*1.76)/1e6                # Azure OpenAI GPT-4.1-mini, regional (Canada) ~10% premium
AI_DOC = DI + LLM
GEM = (1000*0.10 + 900*0.40)/1e6*2              # prototype: Gemini 2.5 Flash-Lite, two reads
# Monthly Azure platform (USD), by volume tier
PLAT = {
 2000:  {'App Service (P0v3)':120,'Database (Azure SQL / Cosmos)':60,'Blob storage, immutable retention':10,'Key Vault + private endpoints + DNS':50,'Monitor / Log Analytics':50,'Workflow (Logic Apps)':10},
 10000: {'App Service (P1v3)':250,'Database (Azure SQL / Cosmos)':150,'Blob storage, immutable retention':25,'Key Vault + private endpoints + DNS':50,'Monitor / Log Analytics':125,'Workflow (Logic Apps)':30},
 50000: {'App Service (P1v3 ×2)':500,'Database (Azure SQL / Cosmos)':400,'Blob storage, immutable retention':80,'Key Vault + private endpoints + DNS':60,'Monitor / Log Analytics':300,'Workflow (Logic Apps)':120},
}
SEARCH_OPT = 74   # Azure AI Search Basic, only if the NDA playbook RAG is added
BUILD = 3.25*12*37.5*90; MAINT = 0.20*BUILD
def row(d):
    ai_usd = d*AI_DOC; plat_usd = sum(PLAT[d].values())
    azure_cad = (ai_usd+plat_usd)*FX
    manual_h = d*MANUAL_MIN/60; idp_h = (d*(1-STP)*REVIEW_MIN + d*STP*AUDIT_RATE*AUDIT_MIN)/60
    gross = (manual_h-idp_h)*LAB; net = gross - azure_cad
    return dict(docs=d, ai_usd=ai_usd, plat_usd=plat_usd, azure_cad=azure_cad, rev_now=manual_h/HRS, rev_idp=idp_h/HRS,
                cpd_now=manual_h*LAB/d, cpd_idp=(idp_h*LAB+azure_cad)/d, net_year=net*12, payback=BUILD/(net-MAINT/12))
R=[row(d) for d in (2000,10000,50000)]
if __name__=='__main__':
    print(f'AI per doc: DI ${DI:.4f} + GPT-4.1-mini ${LLM:.4f} = USD ${AI_DOC:.4f} (CAD {AI_DOC*FX*100:.1f}¢); prototype Gemini USD ${GEM:.5f}')
    print(f'Build CAD {BUILD:,.0f}; maintenance CAD {MAINT:,.0f}/yr')
    for r in R: print(f"{r['docs']:>6} docs: AI US${r['ai_usd']:,.0f} + platform US${r['plat_usd']:,} = Azure CAD ${r['azure_cad']:,.0f}/mo | reviewers {r['rev_now']:.1f}->{r['rev_idp']:.1f} | cost/doc ${r['cpd_now']:.2f}->${r['cpd_idp']:.2f} | net/yr ${r['net_year']:,.0f} | payback {r['payback']:.1f} mo")
