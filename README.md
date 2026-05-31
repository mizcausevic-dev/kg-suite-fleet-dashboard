# kg-suite-fleet-dashboard

> **Kinetic Gain Protocol Suite Fleet Dashboard v0.2.** Single-file static HTML operator dashboard showing Suite-wide posture across all 10 vertical 6-packs = 60 sibling spec repos × 5 cross-cutting invariants + 10 AGPL-3.0 reference implementations × 2 horizontal composition tools. Built for AI-governance procurement teams operating across mixed regulated-vertical AI vendor portfolios. Dark-themed, no framework, no build step. GitHub Pages-deployable.

[![CI](https://github.com/mizcausevic-dev/kg-suite-fleet-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/mizcausevic-dev/kg-suite-fleet-dashboard/actions/workflows/ci.yml)

Part of the [Kinetic Gain Protocol Suite](https://suite.kineticgain.com). Companion to [`kg-suite-vertical-router`](https://github.com/mizcausevic-dev/kg-suite-vertical-router) + [`kg-suite-vertical-comparator`](https://github.com/mizcausevic-dev/kg-suite-vertical-comparator).

Live at: <https://mizcausevic-dev.github.io/kg-suite-fleet-dashboard/>

## What it shows

| Section | Purpose |
| --- | --- |
| **Hero** | Live counters: 10 verticals, 6 canonical shapes, 60 sibling spec repos, 5 cross-cutting invariants, **10 reference implementations** |
| **Per-vertical posture cards** | One card per vertical with tagline, canonical buyer, key design innovation, link to its mini-landing on suite.kineticgain.com |
| **Cross-vertical posture by shape** | Table showing all 60 sibling repos at a glance — every (vertical × shape) cell links to its actual repo |
| **Cross-cutting invariant compliance matrix** | 5-invariant × 10-vertical matrix showing how the same conceptual invariant is named / scoped / enforced per vertical |
| **Reference implementations (AGPL-3.0)** | One row per vertical with kind prefix, wall-clock pattern, and headline invariant — surfaces the 5 distinct wall-clock invariant patterns the Suite catalog supports |
| **Horizontal composition tools** | CLI cards for the router + comparator with one-liner usage examples |

## Data structure

Single source of truth: [`data/dashboard-data.json`](./data/dashboard-data.json). Top-level sections:

- `summary` — the count badges (`vertical_count` · `shape_count` · `sibling_repo_count` · `cross_cutting_invariant_count` · `reference_implementation_count`)
- `verticals` — the 10 verticals with code + name + tagline + canonical buyer + innovation pill
- `shapes` — the 6 canonical artifact shapes
- `matrix` — 10 × 6 mapping of (vertical, shape) → sibling repo name
- `cross_cutting_invariants` + `invariant_matrix` — the 5 invariants × 10 verticals showing per-vertical scoping
- `reference_implementations` — one entry per vertical with `repo` + `ref_impl_kind_prefix` + `wall_clock_pattern` + `headline_invariant`
- `horizontal_tools` — the router + comparator entries

When a new vertical 6-pack lands, a sibling repo is renamed, or a ref impl ships, update this JSON and the dashboard re-renders.

## Quick start

```bash
# Run tests against the dashboard data
npm test

# Serve locally on http://localhost:8765
npm run serve

# Or just open index.html directly in a browser (fetch needs http://, not file://)
```

## Deploy

CI workflow (`.github/workflows/ci.yml`) auto-deploys to GitHub Pages on every push to `main`. Live URL: `https://mizcausevic-dev.github.io/kg-suite-fleet-dashboard/`.

To deploy under a custom subdomain (e.g. `fleet.kineticgain.com`):

1. Add a `CNAME` file at repo root containing the subdomain
2. Add a CNAME DNS record pointing the subdomain at `mizcausevic-dev.github.io`
3. Enable HTTPS in GitHub Pages settings

## Composes with

| Repo | Role |
| --- | --- |
| All 60 sibling spec repos across the 10 vertical 6-packs | The artifacts whose posture the dashboard reflects |
| All 10 AGPL-3.0 reference implementations (one per vertical) | The working code surfaced in the "Reference implementations" section |
| [`kg-suite-vertical-router`](https://github.com/mizcausevic-dev/kg-suite-vertical-router) | Featured tool: route any artifact to the right vertical-specific verification |
| [`kg-suite-vertical-comparator`](https://github.com/mizcausevic-dev/kg-suite-vertical-comparator) | Featured tool: generate cross-vertical comparison Markdown + JSON tables |
| [`kinetic-gain-suite-landing`](https://github.com/mizcausevic-dev/kinetic-gain-suite-landing) | Per-vertical mini-landings linked from each vertical card |

## Architecture

Deliberately minimal:

- **No framework** — vanilla JS only, ~150 lines in `assets/dashboard.js`
- **No build step** — the dashboard ships as static HTML/CSS/JS exactly as committed
- **No external dependencies at runtime** — single fetch of `data/dashboard-data.json`, no CDN calls, no remote fonts
- **Strict CSP** — `default-src 'self'` blocks all third-party loading
- **Pure-Node test runner** — `tests/dashboard.test.mjs` validates data shape with no external test framework

This minimalism is intentional: the dashboard is meant to outlive any framework churn and remain trivially auditable by buyer-side security teams.

## Compliance posture

Suite-readiness scaffolding for cross-vertical AI-governance posture visualization. Useful for procurement teams operating across multiple regulated lines of business who need a single operational view of Suite spec coverage. Does not by itself establish compliance with any underlying statute or rule. The dashboard is descriptive (what specs exist + how they're shaped) not prescriptive (what regulators require). Per the standing public-language guardrail: *readiness · evidence · posture · controls · scaffolding* — never "compliant" or "attested" without an external attestation specific to each underlying regulatory regime.

## License

MIT — see [`LICENSE`](./LICENSE).
