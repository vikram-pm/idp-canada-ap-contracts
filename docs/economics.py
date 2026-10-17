# One source of truth for every number on the site and in the case study. All assumptions labelled.
FX = 1.37                      # USD -> CAD (assumption)
LAB = 40.0                     # loaded AP labour, CAD/hour (assumption)
MANUAL_MIN = 9.0               # minutes per document today (assumption, validate in interviews)
STP = 0.40                     # straight-through rate (conservative target)
REVIEW_MIN = 7.0               # minutes per reviewed document with IDP (assumption)
AUDIT_RATE, AUDIT_MIN = 0.05, 3.0
HOURS_PER_REVIEWER = 140       # productive hours per reviewer per month (assumption)
# Prototype AI cost (Gemini 2.5 Flash-Lite, list USD per 1M tokens)
IN_TOK, OUT_TOK, READS = 1000, 900, 2      # per read: 1-page PDF + prompt in, JSON with source quotes out (estimate)
GEM = (IN_TOK*0.10 + OUT_TOK*0.40)/1e6*READS
# Enterprise path (Microsoft): Document Intelligence prebuilt invoice $10/1,000 pages + small LLM for checks/NDAs
PAGES = 1.5
MS_DOC = PAGES*10/1000 + 0.002             # USD per document (LLM part is an estimate)
def scale(docs, ai_usd_per_doc, platform_cad):
    manual_h = docs*MANUAL_MIN/60
    idp_min = docs*(1-STP)*REVIEW_MIN + docs*STP*AUDIT_RATE*AUDIT_MIN
    idp_h = idp_min/60
    ai_cad = docs*ai_usd_per_doc*FX
    gross = (manual_h-idp_h)*LAB
    net = gross - ai_cad - platform_cad
    return dict(docs=docs, reviewers_now=manual_h/HOURS_PER_REVIEWER, reviewers_idp=idp_h/HOURS_PER_REVIEWER,
                ai_cad=ai_cad, platform=platform_cad, net_month=net, net_year=net*12,
                cost_per_doc_now=manual_h*LAB/docs, cost_per_doc_idp=(idp_h*LAB+ai_cad+platform_cad)/docs)
# Build cost to production pilot (assumption): PM .5, designer .5, 2 engineers, QA .25 for 12 weeks at blended CAD $90/h
FTE, WEEKS, RATE = 3.25, 12, 90
BUILD = FTE*WEEKS*37.5*RATE
RUN_MAINT = 0.20*BUILD                       # yearly maintenance (assumption)
PLATFORM = {2000: 500, 10000: 1500, 50000: 4000}   # CAD/month hosting, monitoring, storage (assumption)
rows = [scale(d, MS_DOC, PLATFORM[d]) for d in (2000, 10000, 50000)]
for r in rows:
    r['payback_months'] = BUILD / max(1, r['net_month'] - RUN_MAINT/12)
    r['roi_y1'] = (r['net_year'] - RUN_MAINT - BUILD) / BUILD
if __name__ == '__main__':
    print(f"Gemini prototype AI cost per doc: USD {GEM:.5f}  (= CAD {GEM*FX*1000:.2f} per 1,000 docs)")
    print(f"Microsoft path AI cost per doc: USD {MS_DOC:.4f} (= CAD {MS_DOC*FX:.3f})")
    print(f"Build to pilot: CAD {BUILD:,.0f}; maintenance/yr CAD {RUN_MAINT:,.0f}")
    for r in rows:
        print(f"{r['docs']:>6} docs | reviewers {r['reviewers_now']:.1f}->{r['reviewers_idp']:.1f} | AI CAD {r['ai_cad']:,.0f}/mo | platform {r['platform']:,} | net/yr CAD {r['net_year']:,.0f} | cost/doc {r['cost_per_doc_now']:.2f}->{r['cost_per_doc_idp']:.2f} | payback {r['payback_months']:.1f} mo | yr-1 ROI {r['roi_y1']*100:.0f}%")
