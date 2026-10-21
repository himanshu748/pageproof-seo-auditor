# PageProof — TinyFish SEO Page Auditor

A real local single-page auditor. **TinyFish Search** observes a query response, **Fetch** shows extractable content, and **Browser** provides rendered DOM and actual navigation receipts. Deterministic checks turn that evidence into prioritized fixes. No language model is asked to follow website instructions or invent SEO metrics.

The exact authenticated TinyBounties brief was read before implementation. See [acceptance checklist](docs/ACCEPTANCE.md) and [design](docs/DESIGN.md). This project sits separately in `seo-auditor/` and preserves the existing Photon, careers and brand projects. No repository AGENTS.md or contribution policy was found in this checkout/ancestors.

## Run

Requires Node 22.13+ and npm. Latest validation on Node 24.9.0. SQLite is experimental on Node 22 and may emit a fixed warning.

```sh
cd seo-auditor
npm ci
npm run check
npm test
npm run build
npm run dev
```

Open http://127.0.0.1:3130. Labeled fixtures work without credentials and make zero API calls. Live reports persist in `evidence/live-<id>.json`; reopen them from the UI without spending credit. Standalone HTML/JSON downloads work for both live and fixture reports. HTML embeds the packaged fonts and their licenses, so it remains styled offline without external font requests. Run `npm start` after building for the compiled server.

`.env.example` is intentionally **empty (zero bytes)**. Create an ignored `.env` using your existing settings. Never put keys in the UI:

```dotenv
TINYFISH_API_KEY=YOUR_EXISTING_KEY
FREE_CREDITS_APPROVED=true
MAX_AUDITS=3
PORT=3130
```

The server also reads the existing `~/.config/tinyfish/credentials.env` without changing it or overriding environment variables. The key is never served. This gate means the operator has verified existing approved free-credit provenance; a wallet balance alone cannot establish it. No checkout/top-up/purchase code exists.

```sh
npm run preflight       # key presence and wallet safety only; no content calls
npm run demo            # synthetic fixtures, explicitly labeled
npm run demo:live       # three genuine public-page audits; consumes durable budget
```

To run one permitted public page instead, use `npm run demo:live -- https://example.com/`. See [demo script](docs/DEMO.md) and [evidence](docs/EVIDENCE.md). Do not reset `.data/budget.sqlite`, switch directories or raise the cap to evade an exhausted approved budget. Failed/unknown attempts count too.

## What is checked

Each finding has **pass / warning / fail / not tested**, supporting evidence, likely impact and a specific fix. Checks cover title, description, headings, canonical URL, robots meta and retrieved X-Robots-Tag, image alt attributes, Open Graph fields, JSON-LD presence/JSON syntax/basic shape, HTTP status and AI extraction readability. Microdata/RDFa presence is observed but not parsed. Canonical/OG destinations are syntax checked, not fetched. Optional link checks are disabled (zero links), explicitly not tested.

Length guidance (title 30–60 characters; description 70–160; extraction warning below 100) is **heuristic**, not a Google rule. Empty image alt prompts manual review of decorative intent. JSON-LD checks do not imply schema.org validity or rich-result eligibility. Robots restrictions can be intentional; warnings ask the owner to review them, not bypass them.

TinyFish Fetch returns live markdown (`ttl:0`); the report shows extraction size, an exact bounded excerpt, and whether DOM title/H1 phrases occur in that excerpt. Search uses the optional target query or URL, US/English, first response page, at most ten displayed results; unsafe URLs are omitted. Exact page matches and snippets are observations of this provider only. Search visibility and robots.txt policy are excluded from score. No Google rank, indexing status, traffic, backlinks, Lighthouse score or Core Web Vitals is measured or invented.

The hygiene formula appears in every UI/HTML/JSON report:

`round(100 × Σ(weight × value) / Σ(measured weight))`

Pass=1, warning=0.5, fail=0; not tested is excluded. Weights: title/headings/robots 3 each; description/canonical/alt/structured/HTTP/readability 2 each; OG 1. Search, robots.txt and optional links have weight 0. Coverage separately shows measured scored checks / all scored checks. With no scored measurements the score is null, never zero or 100. A high score with low coverage is not an all-clear.

## Official integration and limits

Verified 14 October 2026: official `@tiny-fish/sdk` **0.8.0**, the current published version. Read [coding-agent docs](https://docs.tinyfish.ai/for-coding-agents), [Search reference](https://docs.tinyfish.ai/search-api/reference), [Fetch reference](https://docs.tinyfish.ai/fetch-api/reference) and [Browser reference](https://docs.tinyfish.ai/browser-api/reference).

Uses documented `client.wallet.get()`, `client.search.query()`, `client.fetch.getContents()`, `client.browser.sessions.create()` and Browser CDP via Playwright. SDK has no session termination resource in 0.8.0, so cleanup uses the documented `DELETE https://api.browser.tinyfish.ai/{session_id}`. No invented routes, stealth escalation, Vault, saved browser profile or action agent.

Default **three lifetime attempts**, reserving durably in SQLite before provider calls. Cap accepts 1–10 as explicit operator configuration, no automatic resets/replenishment. Per attempt: one wallet check, one Search, one Fetch, one Browser creation, one DELETE cleanup. All SDK retries=0. Search/wallet timeout 12s, Fetch client 25s and per-URL 20s, Browser creation 60s, CDP connect 12s, navigation 20s, settle 3s, active context 40s, cleanup 8s. Browser inactivity timeout 30s. Full workflow may take several minutes; no success is inferred from local timeouts. A lost session-creation response cannot be explicitly terminated without its ID and relies on inactivity expiration.

Wallet must have USD positive balance, no pending top-up, and auto-reload off/unconfigured. Search/Fetch contract rates must be zero; Browser rate must be at most $0.002/minute from approved existing credits. Reject if shared wallet balance fell more than $0.25 from its recorded baseline. This is a conservative stop check, not a provider-enforced spend cap; concurrent other projects can stop this app. Browser teardown is attempted once; unconfirmed cleanup is reported and falls back to inactivity expiry. No purchases or top-ups are attempted on any error.

## URL safety, trust and privacy

- Public HTTPS only; no URL credentials, query strings/fragments, nonstandard ports, private/reserved IPs, metadata, local names, mixed public/private DNS or cross-origin navigation redirects. Enter the permitted final host directly after a www/canonical-host redirect rejection.
- Local HEAD preflight and GET robots.txt use a validated IP pinned to TLS while retaining hostname verification. Every local redirect is validated before retrieval. Robots unknown/denied or explicit access denial prevents Fetch/Browser. Robots responses are reported only when actually retrieved.
- TinyFish Browser starts blank. CDP Fetch pauses and validates every request including redirect hops. Only GET, at most 160 requests; same-origin documents, validated public resources. Blocks workers, popups, service workers, WebSockets, downloads and interactive actions. DOM checks reflect the bounded snapshot; blocked resources can limit rendering. No forms are submitted and audited-site content is not modified.
- Remote TinyFish Fetch resolves/follows redirects independently. Local preflight/final URL validation cannot pin its remote DNS or prove its internal egress isolation. Browser URL checks also cannot pin provider-side DNS. This provider trust boundary is explicit; no claim of complete remote DNS rebinding prevention.
- Website text is inert evidence. Report/UI rendering uses escaped HTML or DOM text nodes and a restrictive CSP. No extracted HTML/scripts/remote assets are embedded in reports. Page scripts may render in the isolated remote browser, subject to GET-only policy; they have no local credentials.
- API key, CDP URLs/session IDs and raw provider exceptions are excluded from receipts/logs. Known key strings and common token/key URL patterns are redacted from reports. Public website excerpts remain evidence; review receipts before sharing. Local files are not uploaded anywhere.
- Server binds loopback, checks Host/Origin and a per-process request token, limits JSON bodies to 4KB, serves only fixed assets. No public hosting, account login or messaging.

## Verification scope

Automated fixtures cover valid/flawed DOM, malformed JSON-LD, blocked access, timeouts, redirects, unknown measurement exclusion, HTML injection, redaction, URL/DNS/robots restrictions, durable caps/restart, wallet gates and local API/download guards. Provider failures in these tests are **synthetic contracts**, not live failure evidence. Genuine live receipts and UI evidence are listed separately in docs/EVIDENCE.md. No broad SEO quality, semantic comprehension or ranking evaluation is claimed.

Publication, paid deployment, social posts and bounty submission remain approval-gated. No bounty points or acceptance are claimed.

## UI refinement, 14 October 2026

The UI follows the installed custom-design guide: document whites, ink blue, Space Grotesk/Public Sans, an original three-source evidence diagram, coordinated Web Animations entrances and reduced-motion handling. Google Fonts assets are licensed and packaged locally to preserve the existing CSP and avoid runtime third-party font requests. See `public/assets/provenance.json` and the included OFL licenses. Tool surfaces use a structural diagram rather than decorative raster imagery.

30 automated tests now pass, including reduced-motion and failed saved-report client states. Responsive checks span 360 to 1440px. Screenshot and export evidence is in `evidence/design-verification-2026-10-14.json`. These checks reopen the original live receipts and use labeled fixtures; no new TinyFish audit or budget reset occurred.

## Submission package

See [submission readiness](submission/READINESS.md), the [entry draft](submission/ENTRY.md), and [download the edited demo video](https://github.com/himanshu748/pageproof-seo-auditor/raw/refs/heads/codex/publication/seo-auditor/submission/PageProof-demo.mp4). GitHub's file viewer cannot preview the MP4; the download opens the original video. A fourth live audit was explicitly authorized and completed on 14 October. The local lifetime cap is now four and exhausted; no more calls are approved. Fresh audit evidence, saved older receipts and synthetic fixtures are labeled separately. See [publication receipts](../PUBLICATION.md) for the original publication history. The bounty was submitted on 15 October and verified as completed on 21 October 2026, awarding 250 points and a $15 gift card marked as on its way.

Fresh-install verification on 15 October cleared the previous disk-space blocker: the reviewed ZIP installed 63 locked packages from the local npm cache in a new directory, then passed all 30 tests, type-check, build and fixture demo. Compiled-server smoke checks verified saved receipts and HTML/JSON exports with live access disabled. See `evidence/submission-validation.json` and `evidence/clean-server-2026-10-15.json`. No additional TinyFish calls were made.
