# Changelog

## [0.2.0] — 2026-05-31

### Added — 10/10 vertical reference impl coverage milestone

- **5th hero stat**: `reference_implementation_count` (= 10) renders alongside the existing verticals/shapes/repos/invariants counters. Top-nav small tag now reads *"POSTURE ACROSS 10 VERTICAL 6-PACKS + 10 REF IMPLS"*.
- **New `reference_implementations` section** in `index.html` (and matching renderer in `dashboard.js` + table styling in `style.css`). One row per vertical with kind prefix, wall-clock pattern, headline invariant, and a direct repo link. Surfaces the **5 distinct wall-clock patterns** the Suite catalog now supports with working code: forward-from-event (EnergyTech 1h, DefenseTech 72h), backward-before-event (HR Tech NYC LL 144 14-day), must-precede-event precondition (EdTech COPPA + GovTech impact-assessment), anchored-on-completed-application (PropTech ECOA 30-day), bounded-backward-window (InsurTech NAIC 90-day).
- **New `reference_implementations` array in `data/dashboard-data.json`** — 10 entries with `vertical_code` + `repo` + `ref_impl_kind_prefix` + `wall_clock_pattern` + `headline_invariant`. Test suite now enforces 1-per-vertical coverage + required-fields shape (143/143 tests pass).
- **Updated `summary.reference_implementation_count = 10`** + test assertion enforcing it.

### Changed — catch-up to 10/10 vertical coverage

- Index hero h1 now says "**ten** regulated verticals" (was "six"); hero lede lists all ten by name (HealthTech · EdTech · PropTech · InsurTech · HR Tech · FinTech · GovTech · LegalTech · EnergyTech · DefenseTech).
- "The ten regulated verticals" section heading (was "six").
- "All ten verticals" / "all 60 sibling repos" prose throughout (was "all six" / "all 36").
- Top-nav: added `#refimpls` anchor between Invariants and Tools.
- Tools section description bumped to mention router v0.2 dual-shape detection + 60 sibling spec repos + 10 ref impls.
- "Browse all ten verticals →" CTA (was "all six").
- README + package.json + meta description + og:description: 6 → 10, 36 → 60, with the reference-implementation lane spelled out.
- Version bump 0.1.0 → 0.2.0.

### Notable

- The dashboard's data already had `vertical_count: 10` since the GovTech 6-pack landed — the prose was stale. v0.2 closes that gap and adds the explicit ref-impl surface so the dashboard is now the *single buyer-facing surface* that shows both "what does the Suite cover?" (60 specs) and "does it work in code?" (10 ref impls) in one view.

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
