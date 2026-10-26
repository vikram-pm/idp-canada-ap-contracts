# PRD · Intelligent Document Processing (v0.2)

**Author:** Vikram Seenivasan · **Status:** prototype complete, synthetic data · **Changes since v0.1:** see [DECISIONS.md](DECISIONS.md)

## Problem
Back-office teams rekey 15+ fields per invoice and read every NDA end to end. Errors cost money (missed input tax credits, duplicate payments, late discovery of risky NDA terms). Canada adds four tax regimes, bilingual documents and provincial law.

## Goals and scope
Cut handling time by 20 to 30% without lowering accuracy; make every AI decision traceable.

| | In MVP | Later | Non-goal |
|---|---|---|---|
| Documents | Vendor invoices (EN/FR), NDAs | PO/SOW matching, receipts | HR or payroll documents |
| Actions | Extract, validate, route, review, audit | ERP posting | Releasing payments automatically |
| Decisions | AI proposes, humans approve anything flagged | Learning from corrections | AI approving NDA risk |

## Personas
| Persona | Primary job | Screens |
|---|---|---|
| AP Analyst | Clear the invoice queue fast and correctly | Queue, Invoice review |
| Contracts Reviewer | Triage NDAs, catch risky clauses | Queue, NDA review |
| Finance Controller | Clean close, no CRA exposure | Ops dashboard, Audit trail |
| Privacy / InfoSec | Keep personal data in approved systems | Audit trail |
| Ops Manager | Throughput and cost per document | Ops dashboard |

## User stories (must-have)
| ID | Story | Acceptance criteria |
|---|---|---|
| US-01 | Upload invoices and NDAs into the queue | PDF/PNG/JPG up to 20 MB, multi-file, drag-and-drop; in the queue within ~30 s |
| US-02 | See where each value came from | Source text outlined on the PDF; no source means Missing, never a guess |
| US-03 | Queue sorted by risk | Critical issues first, then most recent |
| US-04 | Tax checked by place of supply | Rate vs bill-to province within $0.02; expected vs found shown |
| US-05 | QST number enforced for Quebec suppliers | Missing or malformed blocks approval |
| US-06 | Risky NDAs go to Legal | Non-Canadian law or Quebec party always reviewed |
| US-07 | Every correction has a reason | Reason required; visible in the audit trail |
| US-08 | Append-only audit trail | AI and human actions, before/after, timestamp |
| US-09 | No document is lost when AI fails | Routed to Manual with Retry AI extraction |
| US-10 | Small differences don't create work | Equivalent values auto-resolved with an explanation |

## Human-in-the-loop rules
| Condition | Route |
|---|---|
| All critical fields verified, no NDA risk | Auto-approve (5% sampled for spot audit, configurable) |
| Critical field missing, invalid or inconsistent | Review, field highlighted |
| Non-Canadian governing law or Quebec party | Review, always |
| AI unavailable or unreadable document | Manual, with Retry AI extraction |

## KPIs
| Metric | Baseline | Target | Method |
|---|---|---|---|
| Field-level accuracy | n/a | 95%+ | `eval_idp.py` vs ground truth |
| Document-level accuracy | n/a | 85%+ | All fields correct per document |
| Routing accuracy | n/a | 100% on test pack | Expected vs actual route (currently 8/8) |
| Straight-through rate | 0% | 40 to 60% | Auto-approved / all |
| Handle time per invoice | ~9 min (to validate) | -30% | Timed sessions, review timestamps |

## Non-functional
Under 30 s from upload to review-ready · English and French documents · Canadian display formats · model ID is configuration · WCAG 2.1 AA review UI.
