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

check("verticals array length >= 7 (current floor after GovTech)", data.verticals.length >= 7);
check("shapes array length = 6",     data.shapes.length === 6);

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
