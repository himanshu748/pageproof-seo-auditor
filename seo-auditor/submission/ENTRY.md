# PageProof — SEO Page Auditor

## Short description

PageProof shows what TinyFish can extract from a public page, how a search query describes it, and which rendered metadata needs attention. Each finding includes its source, likely impact and a specific fix. The owner can download a self-contained HTML report or the underlying JSON.

## How TinyFish is used

Three APIs do different jobs. TinyFish Search supplies returned links and snippets for the URL or an optional target query. Fetch retrieves live text with `ttl: 0` and shows an exact bounded excerpt, extraction size and title/H1 phrase presence. Browser provides rendered DOM and actual navigation responses through CDP. Deterministic code checks title, description, headings, canonical, robots, image alt text, Open Graph and JSON-LD syntax/basic shape.

The report connects extraction gaps to observed snippets and gives repairs to review. It does not claim that a metadata change caused a search result or that a returned result proves Google ranking or indexing. Search and Fetch failures stay “not tested.”

## Real-page demonstration

The demo begins with a genuine new audit of the TinyFish coding-agent documentation on 14 October 2026, then opens saved genuine 12 October receipts for Example Domain and the TinyFish homepage. Example Domain has missing description/H1 fixes. The homepage retained a Search failure. The malformed JSON-LD scene is explicitly synthetic and uses no API calls.

The video is edited from actual browser captures, with waiting trimmed and explanatory captions. Receipts preserve original measurement times; replay is labeled. The fresh documentation audit scored 100/100 across ten measured hygiene checks, while six blocked requests limited rendering. This is a snapshot heuristic, not an overall SEO rating. The score formula and measurement coverage are published in every report.

## Trust and scope

Only permitted public HTTPS pages are supported. Private/reserved destinations, credentials in URLs, login walls and cross-origin navigation are rejected. Local HTTPS requests use DNS validation and IP pinning; Browser requests are bounded and GET-only. Remote provider DNS resolution remains a stated trust boundary. Same-origin link checking is omitted and labeled not tested. JSON-LD semantic validity and rich-result eligibility are untested.

Keys remain server-side. Website text is inert evidence, reports escape content, and logs redact secrets. Existing approved free credits only; durable attempt caps, wallet checks, zero retries, no purchases or top-ups. No audited website was modified.

## Validation

30 automated tests cover valid/flawed pages, malformed JSON-LD, blocked access, redirects, timeouts, SSRF controls, redaction, scoring unknowns, durable budgets, API guards and client states. Provider fault scenarios are labeled synthetic contracts. The source package includes genuine redacted live receipts, fixtures, README and demo script.

## Publication links

- Working build: https://github.com/himanshu748/pageproof-seo-auditor (public repository created; source upload and verification in progress).
- Demo: https://github.com/himanshu748/pageproof-seo-auditor/blob/codex/publication/seo-auditor/submission/PageProof-demo.mp4 (upload verification in progress).
- LinkedIn post tagging TinyFish: NOT POSTED.
- TinyFish Discord #showcase post: NOT POSTED.

This is prepared copy, not a submission receipt. Do not submit with placeholders.
