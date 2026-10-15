# Design

Local Node/TypeScript server + static responsive UI. TinyFish Search observes the query response; TinyFish Fetch supplies extracted readable text; TinyFish Browser CDP supplies rendered DOM and actual navigation status/headers. No LLM evaluates website instructions. Cheerio parses inert HTML deterministically. DOM checks are never inferred from Fetch text.

Read-only pinned HTTPS robots/preflight protects local requests and verifies redirects before remote retrieval. Remote Browser requests are filtered by URL/DNS, GET-only, with service workers/WebSockets/downloads blocked. Fetch remote DNS resolution remains a documented trust boundary. Same-origin navigation only. No interactive controls or forms on audited sites.

Each audit reserves one of the configured lifetime attempts (three by default) in SQLite before provider calls. One Search, one Fetch, one short Browser session, one wallet check and one cleanup per attempt; no retries. Existing shared key is read server-side. Wallet reload/pending top-up/unsafe rates/balance stop work. Fixtures never spend credit. Scoring is deterministic with coverage and excludes not-tested observations and Search visibility.

## Visual and interaction authority

Primary guide: the user-provided custom-design skill and its canonical design guide, read before UI refinement. No competing design skill was layered on it. The existing static host is preserved using CSS and the Web Animations API. Precise motion uses cubic-bezier(.2,0,0,1), 130ms feedback, 250ms state entrances and 480ms initial entrance. Content is visible before animation setup, and preference changes cancel animations. Motion never invents progress or audit results.

The palette reflects documents and technical inspection: white paper, slate ink and one blue accent. Semantic status colors remain distinct. Space Grotesk and Public Sans are locally served WOFF2 assets with OFL licenses; keeping fonts local preserves the project CSP and privacy constraints. The hand-built diagram explains Browser, Fetch and Search sources, and is explicitly not measurement evidence. Minimum 40px targets, 360px layout and focus-visible styles are retained.
