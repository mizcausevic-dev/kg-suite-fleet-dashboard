// dashboard.test.mjs — Validate dashboard-data.json shape + completeness.
// Pure-Node ESM, no test framework.

import { readFileSync } from "node:fs";

const data = JSON.parse(readFileSync(new URL("../data/dashboard-data.json", import.meta.url), "utf8"));

let failed = 0, passed = 0;
function check(name, condition, msg) {
  if (condition) { console.log(`PASS ${name}`); passed++; }
  else            { console.error(`FAIL ${name}${msg ? " — " + msg : ""}`); failed++; }
}

check("summary present",       !!data.summary);
check("summary.vertical_count matches verticals.length",  data.summary.vertical_count === data.verticals.length);
check("summary.shape_count = 6",                          data.summary.shape_count === 6);
check("summary.sibling_repo_count = verticals × 6 shapes", data.summary.sibling_repo_count === data.verticals.length * 6);
check("summary.cross_cutting_invariant_count = 5",         data.summary.cross_cutting_invariant_count === 5);
check("summary.reference_implementation_count = 10",       data.summary.reference_implementation_count === 10);

check("verticals array length = 10 (full 10/10 coverage)", data.verticals.length === 10);
check("shapes array length = 6",     data.shapes.length === 6);

// reference_implementations array: one per vertical, with required fields
check("reference_implementations array present", Array.isArray(data.reference_implementations));
check("reference_implementations length = 10",   data.reference_implementations?.length === 10);
const refImplVerticalCodes = new Set((data.reference_implementations || []).map((r) => r.vertical_code));
for (const v of data.verticals) {
  check(`reference impl present for vertical ${v.code}`, refImplVerticalCodes.has(v.code));
}
for (const r of (data.reference_implementations || [])) {
  check(`ref impl ${r.repo} has required fields (vertical_code/repo/ref_impl_kind_prefix/wall_clock_pattern/headline_invariant)`,
    typeof r.vertical_code === "string" && r.vertical_code.length > 0 &&
    typeof r.repo === "string" && r.repo.length > 0 &&
    typeof r.ref_impl_kind_prefix === "string" && r.ref_impl_kind_prefix.endsWith(".") &&
    typeof r.wall_clock_pattern === "string" && r.wall_clock_pattern.length > 0 &&
    typeof r.headline_invariant === "string" && r.headline_invariant.length > 0
  );
}

// Matrix completeness: every vertical has every shape
for (const v of data.verticals) {
  for (const s of data.shapes) {
    const cell = data.matrix[v.code]?.[s.code];
    check(`matrix[${v.code}][${s.code}] is a non-empty string`, typeof cell === "string" && cell.length > 0);
  }
}

// Invariant matrix: every vertical × every invariant has an entry (may be "N/A")
for (const v of data.verticals) {
  for (const inv of data.cross_cutting_invariants) {
    const cell = data.invariant_matrix[v.code]?.[inv.code];
    check(`invariant_matrix[${v.code}][${inv.code}] defined`, typeof cell === "string" && cell.length > 0);
  }
}

// Horizontal tools: 2 entries (router + comparator)
check("horizontal_tools length = 2", data.horizontal_tools.length === 2);
check("router tool present",  data.horizontal_tools.some((t) => t.code === "router"));
check("comparator tool present", data.horizontal_tools.some((t) => t.code === "comparator"));

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
