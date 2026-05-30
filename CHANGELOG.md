# Changelog

## [0.1.0] — 2026-05-29

### Added

- Single-file static HTML dashboard (`index.html`) with five rendered sections:
  - Hero with live count badges (6 verticals, 6 shapes, 36 sibling repos, 5 cross-cutting invariants)
  - Per-vertical posture cards (one per vertical, linking to its mini-landing on suite.kineticgain.com)
  - Cross-vertical posture by shape (6-shape × 6-vertical table, every cell links to its actual sibling repo)
  - Cross-cutting invariant compliance matrix (5 invariants × 6 verticals showing per-vertical scoping)
  - Horizontal composition tool cards (router + comparator)
- Single source of truth: `data/dashboard-data.json` with `summary` / `verticals` / `shapes` / `matrix` / `cross_cutting_invariants` / `invariant_matrix` / `horizontal_tools` sections.
- Vanilla JS renderer (`assets/dashboard.js`) — no framework, ~150 lines, fetches the JSON and populates the DOM.
- Dark theme (`assets/style.css`) matching the suite.kineticgain.com design system (slate-950 background, emerald-500 accents, Inter + JetBrains Mono fonts).
- Pure-Node test runner (`tests/dashboard.test.mjs`) — 76/76 passing, validates data shape + completeness.
- CI workflow with test gate + GitHub Pages deploy on push to main.
- Strict CSP via meta tag (default-src 'self', no external loading).
- MIT license.

### Not yet

- Auto-fetch of recent GitHub activity per sibling repo (currently the dashboard is fully static; planned: lightweight GH-API badge per repo card).
- WCAG 2.1 AA accessibility audit (matches suite landing baseline; planned formal audit).
- Embedded inline alternative: a single self-contained `index.html` with all CSS + JSON + JS inline for `file://` portability (currently fetches `data/dashboard-data.json` which requires `http://`).
- CNAME setup for `fleet.kineticgain.com` (planned coordination with Codex per established subdomain workflow).
