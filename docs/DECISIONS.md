# Decisions log

| # | Decision | Why | Trade-off accepted |
|---|---|---|---|
| 1 | Confidence = grounding + two-read agreement + rules, not model self-score | LLM self-confidence is poorly calibrated | Two model calls per document (cost, latency) |
| 2 | Compare the two reads by meaning | Formatting differences ("QC" vs "Quebec") created needless review work | Rare semantic false matches; each auto-resolution is shown |
| 3 | Dates are month/day/year, shown as "Mar 4, 2026"; ambiguous dates auto-resolved | Business standard; removes a low-value question | French/Quebec invoices often use day/month; printed value always shown |
| 4 | QST number mandatory for every Quebec supplier | Business rule; protects input tax refunds | More Quebec invoices go to review |
| 5 | GST/HST number is information only | Business decision to reduce review volume | An invoice can be approved without a claimable ITC |
| 6 | Invoice number and duplicates are notes, not blockers | Business decision | Duplicate payments are no longer stopped automatically |
| 7 | AI failures go to Manual with Retry | No document may vanish | Manual work during outages |
| 8 | Flash-Lite as default model | Flash was frequently overloaded on the free tier | Possibly lower accuracy; measured with the eval script |
| 9 | Page views never write results | Fixed a race condition that lost documents | None |
