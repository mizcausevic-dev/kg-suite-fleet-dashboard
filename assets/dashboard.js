// dashboard.js — Renders the Kinetic Gain Protocol Suite Fleet Dashboard
// from data/dashboard-data.json. No framework. No build step.

(function () {
  "use strict";

  const VERTICAL_LANDING = (code) => `https://suite.kineticgain.com/verticals/${code}/`;
  const REPO_URL         = (name) => `https://github.com/mizcausevic-dev/${name}`;

  function escapeHtml(s) {
    if (typeof s !== "string") return String(s);
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function renderStats(summary) {
    document.getElementById("stat-verticals").textContent  = summary.vertical_count;
    document.getElementById("stat-shapes").textContent     = summary.shape_count;
    document.getElementById("stat-repos").textContent      = summary.sibling_repo_count;
    document.getElementById("stat-invariants").textContent = summary.cross_cutting_invariant_count;
    const refImplStat = document.getElementById("stat-refimpls");
    if (refImplStat && typeof summary.reference_implementation_count === "number") {
      refImplStat.textContent = summary.reference_implementation_count;
    }
  }

  function renderVerticalGrid(verticals) {
    const grid = document.getElementById("vertical-grid");
    grid.innerHTML = verticals.map((v) => `
      <a class="vertical-card" href="${VERTICAL_LANDING(v.code)}">
        <h3>${escapeHtml(v.name)}</h3>
        <p class="vertical-card-tagline">${escapeHtml(v.tagline)}</p>
        <div class="vertical-card-meta">
          <span>6 / 6 shapes</span>
          <span>${escapeHtml(v.canonical_buyer)}</span>
        </div>
        <span class="vertical-card-innovation">${escapeHtml(v.innovation_pill)}</span>
        <span class="vertical-card-cta">Open vertical landing →</span>
      </a>
    `).join("");
  }

  function renderShapeTable(verticals, shapes, matrix) {
    const table = document.getElementById("shape-table");
    let html = "<thead><tr><th>Shape</th>";
    for (const v of verticals) html += `<th>${escapeHtml(v.name)}</th>`;
    html += "</tr></thead><tbody>";
    for (const s of shapes) {
      html += `<tr><td>${escapeHtml(s.name)}<br /><small style="color:var(--slate-400);font-weight:normal;font-size:0.78rem;">${escapeHtml(s.description)}</small></td>`;
      for (const v of verticals) {
        const repo = matrix[v.code]?.[s.code];
        if (repo) {
          html += `<td><a href="${REPO_URL(repo)}"><code>${escapeHtml(repo)}</code></a></td>`;
        } else {
          html += `<td><span class="invariant-na">—</span></td>`;
        }
      }
      html += "</tr>";
    }
    html += "</tbody>";
    table.innerHTML = html;
  }

  function renderInvariantTable(verticals, invariants, invariantMatrix) {
    const table = document.getElementById("invariant-table");
    let html = "<thead><tr><th>Invariant</th>";
    for (const v of verticals) html += `<th>${escapeHtml(v.name)}</th>`;
    html += "</tr></thead><tbody>";
    for (const inv of invariants) {
      html += `<tr><td>${escapeHtml(inv.name)}</td>`;
      for (const v of verticals) {
        const cell = invariantMatrix[v.code]?.[inv.code];
        if (cell && cell !== "N/A") {
          html += `<td><span class="invariant-cell-scope">${escapeHtml(cell)}</span></td>`;
        } else {
          html += `<td><span class="invariant-na">N/A</span></td>`;
        }
      }
      html += "</tr>";
    }
    html += "</tbody>";
    table.innerHTML = html;
  }

  function renderReferenceImplementations(refImpls, verticals) {
    const table = document.getElementById("refimpl-table");
    if (!table) return;  // section may not be present in older index.html versions
    // Build a vertical-name lookup so we can show the friendly name, not just the code.
    const verticalName = Object.fromEntries(verticals.map((v) => [v.code, v.name]));
    let html = "<thead><tr><th>Vertical</th><th>Reference impl (AGPL-3.0)</th><th>Kind prefix</th><th>Wall-clock pattern</th><th>Headline invariant</th></tr></thead><tbody>";
    for (const r of refImpls) {
      const name = verticalName[r.vertical_code] || r.vertical_code;
      html += `<tr>
        <td><strong>${escapeHtml(name)}</strong></td>
        <td><a href="${REPO_URL(r.repo)}"><code>${escapeHtml(r.repo)}</code></a></td>
        <td><code>${escapeHtml(r.ref_impl_kind_prefix)}</code></td>
        <td>${escapeHtml(r.wall_clock_pattern)}</td>
        <td>${escapeHtml(r.headline_invariant)}</td>
      </tr>`;
    }
    html += "</tbody>";
    table.innerHTML = html;
  }

  function renderTools(tools) {
    const grid = document.getElementById("tool-grid");
    grid.innerHTML = tools.map((t) => `
      <div class="tool-card">
        <h3><a href="${t.url}">${escapeHtml(t.name)}</a></h3>
        <p class="tool-card-tagline">${escapeHtml(t.tagline)}</p>
        <code class="tool-card-cli">$ ${escapeHtml(t.cli)}</code>
      </div>
    `).join("");
  }

  function renderGeneratedAt(date) {
    const el = document.getElementById("generated-at");
    if (el) el.textContent = date || "—";
  }

  function showLoadError(msg) {
    document.body.insertAdjacentHTML("beforeend",
      `<div style="position:fixed;top:1rem;right:1rem;background:#7f1d1d;color:#fff;padding:1rem 1.5rem;border-radius:8px;font-family:var(--font-mono);max-width:400px;z-index:100;">
         dashboard load error: ${escapeHtml(msg)}
       </div>`);
  }

  fetch("data/dashboard-data.json", { cache: "no-cache" })
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((data) => {
      renderStats(data.summary);
      renderVerticalGrid(data.verticals);
      renderShapeTable(data.verticals, data.shapes, data.matrix);
      renderInvariantTable(data.verticals, data.cross_cutting_invariants, data.invariant_matrix);
      if (Array.isArray(data.reference_implementations)) {
        renderReferenceImplementations(data.reference_implementations, data.verticals);
      }
      renderTools(data.horizontal_tools);
      renderGeneratedAt(data.generated_at);
    })
    .catch((err) => {
      console.error("dashboard fetch failed:", err);
      showLoadError(err.message);
    });
})();
