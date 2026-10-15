# Evidence ledger

Automated tests and synthetic fixture reports are separate from genuine live receipts. `npm run demo` creates only `fixture-*.json/html`. Genuine provider runs create `live-<UUID>.json` with `mode: live`, actual timestamps and observed outputs. They never contain the key, raw browser CDP/session data or raw provider error messages. Stored evidence is not evidence of public deployment or bounty submission.

Genuine live verification and later local UI checks are recorded separately below. Nothing was published or submitted by this task.

## Genuine live audits — 12 October 2026, Asia/Kolkata

| Public page | Local time | Hygiene heuristic | Scored coverage | Genuine receipt |
| --- | --- | --- | --- | --- |
| https://example.com/ | 22:24:10 | 59/100 | 10/10 | `live-85c7a01e-c421-4f04-a4e8-a4f3ccc13639.json` |
| https://docs.tinyfish.ai/for-coding-agents | 22:25:22 | 100/100 | 10/10 | `live-ca03cd02-b235-4186-b42b-386c34e98d7a.json` |
| https://www.tinyfish.ai/ | 22:27:26 | 91/100 | 10/10 | `live-fb1bd0f1-72b4-444b-bb80-7500d9be6979.json` |

First and third were initiated through the real local browser UI; the second ran the real terminal demo script. All three have actual TinyFish Fetch content and Browser main-document GET 200 receipts. The first two also have genuine TinyFish Search results/snippets; **Search failed for the third**, marked not tested and excluded from score. No results were replaced with synthetic content. Search results may be in a different language even when en was requested; exact returned snippets are preserved.

Example Domain currently has no H1 or description; its heading failure was independently checked against the current public HTML. The docs snapshot had two blocked requests and reached the bounded settle deadline. The homepage snapshot had fifteen blocked requests and also reached the deadline. **100% scored coverage describes these snapshots, not complete unlimited rendering or search visibility.** Limited rendering is visible in receipt metadata and the current UI/HTML renderer.

Browser teardown was immediately confirmed for the first two; the homepage teardown was initially **unconfirmed**. The original receipts are retained honestly. `browser-cleanup.json`, if present, is a later independent read-only provider usage observation, with session/identity/CDP identifiers omitted. The subsequent usage response at 22:30:07 IST confirmed all three sessions ended, with end times 22:24:11, 22:25:23 and 22:27:49 IST. Its provider status/end times are the evidence of session state; no active state is inferred from a local timer alone.

Three of three durable attempts were used. `preflight-after-live.txt` confirms the wallet remained safe, auto-reload unconfigured, free Search/Fetch rates verified, and cap exhausted. No wallet top-up or purchase was requested. No additional content retries were attempted.

## Automated and UI checks

- `tests.txt`: 25/25 passing tests, including synthetic official-SDK transport contracts, no retries, DNS/redirect/robots safeguards, restart caps and concurrent request guard.
- `typecheck.txt`, `build.txt`: TypeScript check and compiled build passed.
- `dependency-audit.json`: zero reported dependency vulnerabilities at verification time.
- `secret-check.json`: zero occurrences of the actual existing key in this app's source/docs/evidence; `.env.example` is zero bytes. This is a known-key scan, not proof that arbitrary public website content has no sensitive data.
- `fixture-*.json/html`, `fixture-demo.txt`: deliberately valid/flawed/malformed/blocked/redirect/timeout scenarios, all **synthetic**, with no provider calls.
- Manual real browser UI: live request → genuine report; filter Fails showed only failed checks; actual HTML download saved `live-1.html`; JSON endpoint/export tested automatically. Responsive 390×844 viewport had document width 390 and all 13 finding cards. No horizontal overflow. Fixtures and live receipts showed distinct badges/timestamps.
- No live deliberate blocking/redirect/timeout fault injection into third-party websites was performed; those scenario tests use labeled fixtures/contracts. No universal browser/prompt-injection/SSRF or SEO-ranking evaluation is claimed.

The final code adds explicit limited-snapshot notices, a concurrent-DNS guard and disabled live controls after cap exhaustion. These low-impact corrections did not rerun provider calls or rewrite the original live JSON receipts. Saved HTML reports are safe derivatives rendered from those receipts.

No public deployment, social post, bounty claim/submission, or audited-site modification was performed.

## Custom-design refinement verification, 14 October 2026

- `final-tests-2026-10-14.txt`: 30/30 passing tests. New offline client tests cover reduced-motion entrances, cancellation on preference change, failed saved-report requests, honest synthetic labels and invalid server responses. These are simulated client environments, not OS/browser preference emulation.
- `final-typecheck-2026-10-14.txt` and `final-build-2026-10-14.txt`: current checks pass. The test runner uses Node with the tsx import hook, avoiding unnecessary CLI IPC sockets. Loopback HTTP tests and local server startup required a narrow approved sandbox escalation; no external provider tests were run.
- `design-verification-2026-10-14.json`: source receipt hashes, durable attempt count and responsive verification details. The three original live JSON receipts retain their 12 October timestamps. No new TinyFish audits or budget resets occurred.
- `final-desktop-2026-10-14.jpg`, `final-mobile-2026-10-14.jpg`, `final-live-receipt-2026-10-14.jpg`: actual local browser screenshots. The diagram is labeled as an explanation, while the opened genuine receipt preserves its partial Search result and limited-snapshot notice.
- Both exports were downloaded through the actual updated UI. `final-downloaded-live.json` is byte-identical to the original homepage receipt; `final-downloaded-live.html` is a safely rendered derivative.
- Responsive widths 360, 390, 768, 1024 and 1440 were checked on 13 October; 360px and desktop were rechecked on 14 October. No horizontal page overflow or visible controls below 40px were observed.
- Fonts are real locally served WOFF2 files. Source URLs and OFL licenses are in `public/assets/`. No ImageGen was used; this audit tool uses a structural illustration rather than decorative imagery.

The current standalone HTML renderer follows the same document/ink-blue design, embeds the licensed fonts and retains a restrictive CSP. JSON measurements are unchanged. The suite still passes 30/30 after this export refinement.

## Submission verification, 14 October 2026

One additional live audit was expressly approved by the user, extending the existing lifetime cap from three to four without resetting the database. Receipt `live-30d81fb2-00c4-4973-987b-a4bd13db75f1.json` records a fresh audit of https://docs.tinyfish.ai/for-coding-agents at 13:24:10 UTC (18:54:10 IST). Search, Fetch and Browser all returned genuine evidence. Fetch extracted 10,724 characters; the Browser main-document response was GET 200. All ten scored checks were measured, hygiene 100/100, with six blocked requests and a bounded rendering snapshot. Cleanup was confirmed. The cap is exhausted; no further live calls were made or authorized.

`submission/PageProof-demo.mp4` is an edited presentation of actual local browser captures, with waiting trimmed and explanatory captions. It is not a continuous screen recording. Its fresh run is followed by saved 12 October Example Domain and TinyFish homepage receipts, then an explicitly synthetic malformed JSON-LD fixture. Source captures and timeline provenance are retained in `submission/VIDEO-PROVENANCE.json`. The encoded resolution is a presentation canvas; source browser panes are 668 by 827 pixels. Static screenshot scenes are rendered at 1 fps and encoded at 60 fps with repeated frames. No native 4K capture or audit speed benchmark is claimed.

SDK version 0.8.0 was rechecked against the official npm package on 14 October; the official coding-agent documentation was reread. Submission validation and clean-install results are listed in `submission/READINESS.md`. Source-package secret scanning includes untracked files. One credential-shaped assignment is an intentional offline client fixture; no actual existing key occurs. There is no repository history for these untracked files to scan.

## Fresh-install verification — 15 October 2026

The 14 October clean-install attempts failed honestly with ENOSPC. On 15 October, after free space became available, the exact reviewed ZIP (SHA-256 a682ea1ff191ddfd1d2ae241c99e832c37a42385f149636de026521deda22e12) was extracted into a new temporary directory. `npm ci --offline --no-audit --no-fund` installed 63 packages, with no dependency symlink. Type-check, all 30 tests, compiled build and six-scenario fixture demo passed. A separate compiled `npm start` smoke check loaded all four genuine receipts, returned a byte-identical fresh live JSON export and a standalone HTML export, and identified the synthetic malformed JSON-LD failure. Test credentials and live-credit approval were disabled. No additional TinyFish provider calls occurred.

`evidence/submission-validation.json`, `evidence/clean-server-2026-10-15.json` and `submission/clean-*-2026-10-15.txt` contain these results. The final archive is rebuilt with updated docs/evidence; application code and runtime assets remain byte-identical to the freshly tested checkout. Authenticated TinyBounties was reread on 15 October: unchanged brief/rules, nine builds, Claim this bounty available, exact launch/deadline absent. No claim or submission made.
