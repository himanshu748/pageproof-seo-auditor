# Local demo / recording script

1. In `seo-auditor/`, run `npm ci`, `npm run check`, `npm test`, `npm run build`.
2. `npm run preflight`: verify existing server-side key, approved-credit provenance, auto-reload off/unconfigured, safe rates and remaining durable attempts. Do not purchase or reset budget.
3. Start `FREE_CREDITS_APPROVED=true npm run dev` only for the approved existing free credits. Open http://127.0.0.1:3130.
4. Say: “PageProof uses live TinyFish Search, Fetch and rendered Browser DOM. Every finding shows evidence and a specific fix. The score is a heuristic with coverage, not a Google rank.”
5. Enter `https://example.com/`, confirm permitted public-page access and run **one genuine live audit**. Show the live badge, original timestamp, coverage and evidence for missing descriptions/structured data. Show Search snippets and Fetch extraction separately. Open the score formula.
6. Demo two more genuine pages with `npm run demo:live -- https://docs.tinyfish.ai/for-coding-agents` and `npm run demo:live -- https://www.tinyfish.ai/`. Actual denials/partial outcomes stay labeled; never replace a failure with a fixture. Stop at the three-attempt cap. Saved live receipts can be reopened after a server restart with their original times; say explicitly that replay makes no new calls.
7. Download HTML and JSON; point out evidence, impact, prioritized fixes and unknown-measurement exclusions. No page was modified.
8. Open “Flawed page”, “Broken JSON-LD”, “Blocked access”, “Timeout” and “Redirect”. Say: “These are synthetic test fixtures, separate from the live receipts. No TinyFish calls.”
9. End with the honest limits: no ranking/indexing/traffic/backlink/performance claims, no schema semantic guarantee; remote DNS/Fetch is a provider trust boundary.

Nothing is published or submitted by this script. Recording locally is distinct from approving public/social/bounty submission. Social/rulebook requirements are future approval-gated actions.

## Prepared submission demo, 14 October

The original three-audit sequence above has already run. Do not rerun it against this exhausted budget. The user expressly approved one fourth audit of the coding-agent docs; it succeeded. `submission/PageProof-demo.mp4` begins with that new run, then shows older live receipts and a labeled malformed JSON-LD fixture. The edited capture timeline is in `submission/VIDEO-PROVENANCE.json`. It trims waiting and is not a continuous screen recording. The local cap is four and exhausted. More live calls require new explicit approval.

Replay offline by starting the server with `FREE_CREDITS_APPROVED=false`, choosing the saved receipts and using fixtures. This mode uses no TinyFish content calls. A clean checkout gets a new budget database; that is not permission to make extra calls in the present session.
