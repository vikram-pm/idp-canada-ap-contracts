# Responsible AI assessment

**Verdict:** acceptable for a prototype on synthetic data; not acceptable for real documents until the open items are closed.

| Risk | Control | Status |
|---|---|---|
| AI invents a value | Source quote required, two reads compared by meaning, deterministic rules | Built (quotes not yet checked against PDF text) |
| Reviewers rubber-stamp | Approve disabled on open issues; reason codes; spot audit | Built |
| AI outage silently drops documents | Failures routed to Manual with Retry; approval blocked | Built |
| Personal or banking data sent to an external model | Synthetic data only; prompt forbids returning bank/SIN numbers; redaction before model call | **Open** |
| Free-tier inputs may be used by the provider | Paid tier or an approved enterprise platform for any real data | **Open** |
| Lower accuracy on French or scanned documents | Measure accuracy by language and scan quality | **Open** |
| Wrong tax rule | Tax team sign-off on the rate table | **Open** |
| Date order misread (month/day vs day/month) | Every auto-resolved date shows the printed value; language-aware rule planned | Mitigated |

**Quebec Law 25:** a privacy impact assessment is required before personal information leaves Quebec (for example, to a US-hosted model).
**Accessibility:** status uses icon + label, not colour alone; keyboard shortcuts for review.
