# PageProof — TinyFish SEO Page Auditor

PageProof compares TinyFish Search results, live Fetch text and rendered Browser DOM for a permitted public HTTPS page. Each finding includes evidence, likely impact and a specific fix, with HTML and JSON exports.

[Demo video](seo-auditor/submission/PageProof-demo.mp4) · [Run locally](seo-auditor/README.md) · [Exact bounty brief and acceptance checklist](seo-auditor/docs/ACCEPTANCE.md) · [Genuine evidence and limitations](seo-auditor/docs/EVIDENCE.md)

```sh
cd seo-auditor
npm ci
npm run check
npm test
npm run build
npm start
```

Open http://127.0.0.1:3130. Saved live receipts and labeled fixtures work without API calls. Live audits require your existing server-side TinyFish key, explicit approved-credit configuration and a durable request allowance. Never reset or increase an exhausted allowance without authorization.

The demo includes a genuine 14 October 2026 audit, saved genuine receipts from several pages, and a separately labeled synthetic JSON-LD failure. It is an edited walkthrough of real browser captures with explanatory captions and waiting trimmed. Scores are published page-hygiene heuristics, not Google rankings or indexing claims. Bounded rendering and unmeasured features stay visible.

Fresh installation, all 30 tests, type-check, build, fixture demo and compiled-server/export checks passed on 15 October with live provider access disabled. See [validation receipt](seo-auditor/evidence/submission-validation.json).

This repository contains only the reviewed PageProof bundle plus this navigation README and publication records. Preparation documents preserve their original measurement dates. Public posting is authorized; final bounty submission remains pending the owner's approval. No bounty approval, points or payment is claimed.
