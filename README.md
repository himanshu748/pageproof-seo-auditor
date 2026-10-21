# PageProof — TinyFish SEO Page Auditor

PageProof compares TinyFish Search results, live Fetch text and rendered Browser DOM for a permitted public HTTPS page. Each finding includes evidence, likely impact and a specific fix, with HTML and JSON exports.

[Watch the demo](https://github.com/user-attachments/assets/b27b752d-d055-4868-b8c7-5cec70ae9b49) · [Download the demo (MP4, 2.6 MB)](https://github.com/himanshu748/pageproof-seo-auditor/raw/refs/heads/codex/publication/seo-auditor/submission/PageProof-demo.mp4) · [Run locally](seo-auditor/README.md) · [Exact bounty brief and acceptance checklist](seo-auditor/docs/ACCEPTANCE.md) · [Genuine evidence and limitations](seo-auditor/docs/EVIDENCE.md)

GitHub's file viewer cannot preview the MP4 stored in the repository. The attachment below plays the original 80-second walkthrough; the download link is available if the player does not load.

https://github.com/user-attachments/assets/b27b752d-d055-4868-b8c7-5cec70ae9b49

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

This repository contains only the reviewed PageProof bundle plus this navigation README and publication records. Preparation documents preserve their original measurement dates. PageProof was submitted on 15 October 2026. TinyBounties showed the SEO Page Auditor bounty as completed on 21 October 2026, awarding 250 points and a $15 gift card. The portal marked the gift card as on its way, with a 5–7 day delivery estimate; receipt of payment is not confirmed.
