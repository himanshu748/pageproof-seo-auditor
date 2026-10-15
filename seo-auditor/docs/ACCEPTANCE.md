# SEO Page Auditor acceptance — exact brief read 12 October 2026

Source: authenticated https://www.tinybounties.com/crm?view=board → SEO Page Auditor, Student Bounty Drop 001. Read before implementation. No claim or submission made.

## Exact brief transcription

AI search is changing how pages get found. Build an auditor that checks whether AI search and fetch tools can actually read and understand a page, and how that ties to SEO and ranking. Use TinyFish Search to see how a page shows up, Fetch to see what an AI tool extracts from it, then report what's missing and how to fix it.

Submission requirements:
1. Takes a URL (and optionally a target search query).
2. Uses TinyFish Search and Fetch.
3. Report covers what AI tools can and can't read, visibility gaps, and concrete fixes.
4. Demo on several real pages.
5. Short explanation of how TinyFish is used.

Approval criteria:
1. Search and Fetch both contribute meaningfully.
2. Audits live pages rather than saved copies.
3. Findings are specific and actionable, not generic SEO tips.
4. Works for any URL.
5. Connects how readable a page is to AI tools with how visible it is in search.

Scoring: 1 endpoint 50 points; 2 endpoints 100 points; 3+ endpoints 200 points. Endpoints must contribute meaningfully; padding does not qualify. Looking for an audit a site owner would act on the same day. 18 days to build, individual entries, top 3 builds approved. No bounty points or approval claimed.

## Build acceptance checklist

- [x] Live permitted public URL, optional target query, responsive single-page UI.
- [x] Search result/snippet observations and Fetch readable-text evidence contribute meaningfully.
- [x] Official SDK and documented TinyFish Browser CDP supply rendered DOM, with deterministic checks.
- [x] Title, description, headings, canonical, robots, alt, OG, JSON-LD presence/parsing.
- [x] Every finding: pass/warning/fail/not tested, source evidence, likely impact, specific fix.
- [x] HTTP/redirect/robots.txt claims only from actual responses; failures stay not tested.
- [x] Length thresholds explicitly heuristic; measurable-only score formula and coverage.
- [x] Prioritized fixes; safe standalone HTML and JSON downloads.
- [x] Fixtures for valid/flawed/malformed/blocked/redirect/timeout; fixtures clearly labeled.
- [x] Genuine redacted live demo on several pages, separate from synthetic provider tests.
- [x] Server secrets, empty .env.example, environment configuration, redacted logs, inert website data.
- [x] SSRF checks for input, local pinned retrieval, browser requests and final URLs.
- [x] Approved existing free-credit gate, safe wallet, durable bounded calls, no retry/purchase/top-up.
- [x] Runnable code, README, tests, demo script and evidence receipts.
- [x] Nothing published, deployed, socially posted, or submitted.

The brief's “any URL” is narrowed by the user's explicit permitted-public-URL and SSRF requirements. HTTP, login walls, private targets and restricted access are rejected. Search results cannot establish Google ranking, indexing, traffic, backlinks, Lighthouse or Core Web Vitals. Optional link checking is omitted and labeled not tested. JSON-LD syntax/presence is checked, not schema.org validity or rich-result eligibility.

Verification details and candid limitations: [EVIDENCE.md](EVIDENCE.md). Third live Search failed; limited snapshots and initial unconfirmed cleanup are preserved. No bounty acceptance claimed.

## Submission gates rechecked 14 October 2026

The authenticated SEO Page Auditor brief was unchanged and still unclaimed (seven builds shown). A fresh fourth audit and a captioned demo now supplement the three original live pages. The rulebook requires a working build link, explanation, a LinkedIn post tagging TinyFish, and a TinyFish Discord #showcase post. X is optional. The exact launch date/deadline was not displayed; do not infer it from the generic 18-day rule. Eligibility requires a registered Student or Ambassador, individual work and at most one entry per person per bounty. The user confirmed registered Student/Ambassador status and no prior SEO Page Auditor entry on 14 October.

- [x] Local source, genuine live evidence and demo prepared for review.
- [ ] Public working build link published with approval.
- [ ] Required LinkedIn and Discord posts published with approval.
- [x] Eligibility and prior-entry absence confirmed by the user.
- [ ] Open submission window rechecked immediately before final submission.
- [ ] Final bounty submission approved and receipt verified.

These unchecked gates do not imply a submitted or accepted bounty.

15 October recheck: authenticated brief and Rulebook unchanged; nine builds shown and Claim this bounty available. No claim or submission made. Fresh-install verification now passes all 30 tests, type-check, build, fixture demo and compiled-server/export smoke checks without dependency reuse or provider calls. Public working links/posts and final submission approval remain pending.
