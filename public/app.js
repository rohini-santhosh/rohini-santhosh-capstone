(function () {
  "use strict";

  // ---------- Shared helpers ----------

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function clone(id) {
    return document.getElementById(id).content.cloneNode(true);
  }

  function safeHostname(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }

  function slug(text) {
    return (text || "research")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60) || "research";
  }

  function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function fetchLibraryList() {
    try {
      const res = await fetch("/api/research");
      if (res.ok) return await res.json();
    } catch {
      /* fall through */
    }
    return [];
  }

  async function fetchReport(slug) {
    const res = await fetch(`/api/research/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error("not found");
    return res.json();
  }

  // ---------- Report rendering (shared by wizard report step + library) ----------

  function section(title, sub) {
    const s = el("div", "result-section");
    s.appendChild(el("h2", null, title));
    if (sub) s.appendChild(el("p", "section-sub", sub));
    return s;
  }

  function fillList(ul, items) {
    ul.innerHTML = "";
    (items || []).forEach((t) => ul.appendChild(el("li", null, t)));
  }

  function quoteNode(quote) {
    const node = clone("tpl-quote");
    node.querySelector(".quote-text").textContent = quote.quote || "";
    const sentiment = node.querySelector(".quote-sentiment");
    sentiment.textContent = (quote.sentiment || "").replace("_", " ");
    sentiment.dataset.sentiment = quote.sentiment || "";
    const source = node.querySelector(".quote-source");
    source.href = quote.source_url || "#";
    source.textContent = quote.source_url ? safeHostname(quote.source_url) : "";
    return node;
  }

  function buildMarkdownReport(r) {
    const lines = [];
    const push = (...xs) => lines.push(...xs, "");
    push(`# Research Findings: ${r.topic || ""}`);
    if (r.scope) push(`**Scope:** ${r.scope}`);

    const gd = r.gather_data || {};
    if (gd.sources?.length) {
      push("## Gather Data", gd.methodology || "");
      gd.sources.forEach((s) => lines.push(`- [${s.title || s.url}](${s.url}) (${s.type || "source"})`));
      lines.push("");
    }
    if (r.primary_research_quotes?.length) {
      push("## Primary Research Quotes");
      r.primary_research_quotes.forEach((q) => lines.push(`> "${q.quote}" — [${safeHostname(q.source_url)}](${q.source_url}) (${q.sentiment})`));
      lines.push("");
    }
    if (r.insights?.length) {
      push("## Insights");
      r.insights.forEach((i) => lines.push(`- **${i.insight}** (frequency ${i.frequency}, severity ${i.severity}, rank ${i.rank})`));
      lines.push("");
    }
    if (r.observations?.length) {
      push("## Observations");
      r.observations.forEach((o) => lines.push(`- ${o.observation} — "${o.quote}" [${o.sentiment}] (${o.source_url})`));
      lines.push("");
    }
    if (r.pain_points_and_needs?.length) {
      push("## Pain Points & Needs");
      r.pain_points_and_needs.forEach((p) => lines.push(`- **Pain point:** ${p.pain_point} — **Need:** ${p.need}`));
      lines.push("");
    }
    if (r.behavior_patterns?.length) {
      push("## Behavior Patterns");
      r.behavior_patterns.forEach((p) => lines.push(`- ${p.trigger} → ${p.action} → ${p.context} → ${p.outcome}`));
      lines.push("");
    }
    if (r.behavior_personas?.length) {
      push("## Behavior Personas");
      r.behavior_personas.forEach((p) => {
        lines.push(`### ${p.name} — ${p.archetype}`);
        lines.push(`- Goals: ${(p.goals || []).join("; ")}`);
        lines.push(`- Pain points: ${(p.pain_points || []).join("; ")}`);
        lines.push(`- Patterns: ${(p.patterns || []).join("; ")}`);
      });
      lines.push("");
    }
    if (r.contradictions?.length) {
      push("## Contradictions");
      r.contradictions.forEach((c) => lines.push(`- **${c.contradiction}** — ${c.explanation}`));
      lines.push("");
    }
    if (r.journey_map?.length) {
      push("## Journey Map");
      r.journey_map.forEach((s) => lines.push(`### ${s.stage}\n- Actions: ${s.user_actions}\n- Thoughts/emotions: ${s.thoughts_emotions}\n- Pain points: ${s.pain_points}\n- Opportunity: ${s.opportunities}`));
      lines.push("");
    }
    if (r.flows?.length) {
      push("## Flows");
      r.flows.forEach((f) => {
        lines.push(`### ${f.name}`);
        (f.steps || []).forEach((step, i) => lines.push(`${i + 1}. ${step}`));
      });
      lines.push("");
    }
    if (r.summary) push("## Summary", r.summary);
    if (r.product_opportunity_and_direction?.length) {
      push("## Product Opportunity & Direction");
      r.product_opportunity_and_direction.forEach((o) => lines.push(`- **${o.opportunity}** — ${o.direction} _(${o.rationale})_`));
    }
    return lines.join("\n");
  }

  function renderResults(container, result, onlyKeys) {
    container.innerHTML = "";
    if (!result) return;

    // onlyKeys is a Set of PLAN_ITEMS keys to restrict the report to (from
    // the wizard's plan picker). null/undefined/empty means "show everything" —
    // used for library browsing, where there's no associated plan selection.
    const allow = (key) => !onlyKeys || onlyKeys.size === 0 || onlyKeys.has(key);

    const gatherData = result.gather_data || {};
    if (allow("gather") && Array.isArray(gatherData.sources) && gatherData.sources.length) {
      const s = section("Gather data", gatherData.methodology || "Sources this run actually retrieved");
      const ul = el("ul", "source-list");
      gatherData.sources.forEach((src) => {
        const node = clone("tpl-source-item");
        const a = node.querySelector(".source-link");
        a.href = src.url;
        a.textContent = src.title || src.url;
        node.querySelector(".source-type").textContent = src.type || "";
        ul.appendChild(node);
      });
      s.appendChild(ul);
      container.appendChild(s);
    }

    if (allow("quotes") && Array.isArray(result.primary_research_quotes) && result.primary_research_quotes.length) {
      const s = section("Primary research quotes");
      const grid = el("div", "card-grid");
      result.primary_research_quotes.forEach((q) => grid.appendChild(quoteNode(q)));
      s.appendChild(grid);
      container.appendChild(s);
    }

    if (allow("insights") && Array.isArray(result.insights) && result.insights.length) {
      const s = section("Insights", "Ranked by frequency × severity");
      const grid = el("div", "card-grid");
      const maxRank = Math.max(...result.insights.map((t) => t.rank || 0), 1);
      result.insights
        .slice()
        .sort((a, b) => (b.rank || 0) - (a.rank || 0))
        .forEach((insight) => {
          const node = clone("tpl-insight-card");
          node.querySelector(".insight-text").textContent = insight.insight || "";
          node.querySelector(".insight-rank").textContent = insight.rank != null ? `rank ${insight.rank}` : "";
          node.querySelector(".theme-bar-fill").style.width = `${Math.max(6, ((insight.rank || 0) / maxRank) * 100)}%`;
          node.querySelector(".insight-freq").textContent = insight.frequency ?? "—";
          node.querySelector(".insight-sev").textContent = insight.severity ?? "—";
          fillList(node.querySelector(".insight-quotes"), (insight.evidence_quotes || []).map((q) => `"${q}"`));
          grid.appendChild(node);
        });
      s.appendChild(grid);
      container.appendChild(s);
    }

    if (allow("obs") && Array.isArray(result.observations) && result.observations.length) {
      const s = section("Observations", `${result.observations.length} atomic observations, each tied to a real source`);
      const ul = el("ul", "observation-list");
      result.observations.forEach((o) => {
        const node = clone("tpl-observation-row");
        const sentiment = node.querySelector(".observation-sentiment");
        sentiment.textContent = (o.sentiment || "").replace("_", " ");
        sentiment.dataset.sentiment = o.sentiment || "";
        node.querySelector(".observation-text").textContent = o.observation || "";
        node.querySelector(".observation-quote").textContent = o.quote ? `"${o.quote}"` : "";
        const src = node.querySelector(".observation-source");
        src.href = o.source_url || "#";
        src.textContent = o.source_url ? safeHostname(o.source_url) : "";
        ul.appendChild(node);
      });
      s.appendChild(ul);
      container.appendChild(s);
    }

    if (allow("pain") && Array.isArray(result.pain_points_and_needs) && result.pain_points_and_needs.length) {
      const s = section("Pain points & needs");
      const grid = el("div", "card-grid");
      result.pain_points_and_needs.forEach((p) => {
        const node = clone("tpl-pain-card");
        node.querySelector(".pain-point").textContent = p.pain_point || "";
        node.querySelector(".pain-need").textContent = p.need || "—";
        fillList(node.querySelector(".pain-evidence"), (p.evidence_quotes || []).map((q) => `"${q}"`));
        grid.appendChild(node);
      });
      s.appendChild(grid);
      container.appendChild(s);
    }

    if (allow("patterns") && Array.isArray(result.behavior_patterns) && result.behavior_patterns.length) {
      const s = section("Behavior patterns", "Trigger → action → context → outcome");
      const grid = el("div", "card-grid");
      result.behavior_patterns.forEach((p) => {
        const node = clone("tpl-pattern-card");
        node.querySelector(".pattern-trigger").textContent = p.trigger || "";
        node.querySelector(".pattern-action").textContent = p.action || "";
        node.querySelector(".pattern-context").textContent = p.context || "";
        node.querySelector(".pattern-outcome").textContent = p.outcome || "";
        grid.appendChild(node);
      });
      s.appendChild(grid);
      container.appendChild(s);
    }

    if (allow("persona") && Array.isArray(result.behavior_personas) && result.behavior_personas.length) {
      const s = section("Behavior personas", "Grounded in the gathered observations");
      const grid = el("div", "card-grid");
      result.behavior_personas.forEach((p) => {
        const node = clone("tpl-persona-card");
        node.querySelector(".persona-name").textContent = p.name || "Persona";
        node.querySelector(".persona-archetype").textContent = p.archetype || "";
        fillList(node.querySelector(".persona-goals"), p.goals);
        fillList(node.querySelector(".persona-pain"), p.pain_points);
        fillList(node.querySelector(".persona-patterns"), p.patterns);
        grid.appendChild(node);
      });
      s.appendChild(grid);
      container.appendChild(s);
    }

    if (allow("contra") && Array.isArray(result.contradictions) && result.contradictions.length) {
      const s = section("Contradictions", "Genuine tensions found in the data, not smoothed over");
      const grid = el("div", "card-grid");
      result.contradictions.forEach((c) => {
        const node = clone("tpl-contradiction-card");
        node.querySelector(".contradiction-text").textContent = c.contradiction || "";
        node.querySelector(".contradiction-explanation").textContent = c.explanation || "";
        fillList(node.querySelector(".contradiction-evidence"), (c.evidence_quotes || []).map((q) => `"${q}"`));
        grid.appendChild(node);
      });
      s.appendChild(grid);
      container.appendChild(s);
    }

    if (allow("journey") && Array.isArray(result.journey_map) && result.journey_map.length) {
      const s = section("Journey map");
      const ol = el("ol", "journey-list");
      result.journey_map.forEach((stage) => {
        const node = clone("tpl-journey-stage");
        node.querySelector(".journey-stage-name").textContent = stage.stage || "";
        node.querySelector(".journey-actions").textContent = stage.user_actions || "—";
        node.querySelector(".journey-emotions").textContent = stage.thoughts_emotions || "—";
        node.querySelector(".journey-pain").textContent = stage.pain_points || "—";
        node.querySelector(".journey-opportunity").textContent = stage.opportunities || "—";
        ol.appendChild(node);
      });
      s.appendChild(ol);
      container.appendChild(s);
    }

    if (allow("flows") && Array.isArray(result.flows) && result.flows.length) {
      const s = section("Flows");
      const grid = el("div", "card-grid");
      result.flows.forEach((f) => {
        const node = clone("tpl-flow-card");
        node.querySelector(".flow-name").textContent = f.name || "";
        const stepsEl = node.querySelector(".flow-steps");
        (f.steps || []).forEach((step) => stepsEl.appendChild(el("li", null, step)));
        grid.appendChild(node);
      });
      s.appendChild(grid);
      container.appendChild(s);
    }

    if (allow("summarize") && result.summary) {
      const s = section("Summary");
      s.appendChild(el("p", "summary-text", result.summary));
      container.appendChild(s);
    }

    if (allow("opportunity") && Array.isArray(result.product_opportunity_and_direction) && result.product_opportunity_and_direction.length) {
      const s = section("Product opportunity & direction");
      const grid = el("div", "card-grid");
      result.product_opportunity_and_direction.forEach((o) => {
        const node = clone("tpl-opportunity-card");
        node.querySelector(".opportunity-title").textContent = o.opportunity || "";
        node.querySelector(".opportunity-direction").textContent = o.direction || "—";
        node.querySelector(".opportunity-rationale").textContent = o.rationale || "—";
        grid.appendChild(node);
      });
      s.appendChild(grid);
      container.appendChild(s);
    }

    const exportSection = section("Export");
    const row = el("div", "export-row");
    const jsonBtn = el("button", "btn-secondary", "Download JSON");
    jsonBtn.type = "button";
    jsonBtn.addEventListener("click", () => downloadFile(
      `${slug(result.topic)}-narra-research.json`,
      JSON.stringify(result, null, 2),
      "application/json"
    ));
    row.appendChild(jsonBtn);

    const mdBtn = el("button", "btn-secondary", "Download markdown report");
    mdBtn.type = "button";
    mdBtn.addEventListener("click", () => downloadFile(
      `${slug(result.topic)}-research-findings-report.md`,
      buildMarkdownReport(result),
      "text/markdown"
    ));
    row.appendChild(mdBtn);

    exportSection.appendChild(row);
    container.appendChild(exportSection);
  }

  // ---------- View switching (wizard vs library) ----------

  const viewWizard = document.getElementById("view-wizard");
  const viewLibrary = document.getElementById("view-library");

  function showWizard() {
    viewLibrary.hidden = true;
    viewWizard.hidden = false;
  }

  function showLibrary() {
    viewWizard.hidden = true;
    viewLibrary.hidden = false;
    loadLibrary();
  }

  document.querySelectorAll("[data-goto-library]").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      highlightSlug = null;
      showLibrary();
    })
  );
  document.querySelectorAll("[data-goto-cover]").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      resetWizard();
      showWizard();
    })
  );

  // ---------- Library ----------

  const libraryGrid = document.getElementById("library-grid");
  const libraryEmpty = document.getElementById("library-empty");
  const libResults = document.getElementById("lib-results");

  // Set right before routing into the library from the synth screen, so the
  // freshly-published card gets a visual highlight once the grid reloads.
  let highlightSlug = null;

  async function openLibraryReport(entrySlug, onlyKeys) {
    libResults.hidden = false;
    libResults.innerHTML = "";
    libResults.appendChild(el("p", "section-sub", "Loading…"));
    try {
      const data =
        pendingReport && pendingReportSlug === entrySlug ? pendingReport : await fetchReport(entrySlug);
      renderResults(libResults, data, onlyKeys);
      libResults.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      libResults.innerHTML = "";
      libResults.appendChild(el("p", "form-error", "Could not load that report."));
    }
  }

  async function loadLibrary() {
    const list = await fetchLibraryList();

    libraryGrid.innerHTML = "";
    if (!list.length) {
      libraryEmpty.hidden = false;
      return;
    }
    libraryEmpty.hidden = true;

    list.forEach((entry) => {
      const node = clone("tpl-library-card");
      const cardEl = node.querySelector(".library-card");
      if (highlightSlug && entry.slug === highlightSlug) cardEl.classList.add("is-new");
      node.querySelector(".library-topic").textContent = entry.topic || entry.slug;
      node.querySelector(".library-scope").textContent = entry.scope || "";
      node.querySelector(".library-view").addEventListener("click", () => openLibraryReport(entry.slug));
      if (entry.figjamUrl) {
        const figjamLink = node.querySelector(".library-figjam");
        figjamLink.href = entry.figjamUrl;
        figjamLink.hidden = false;
      }
      libraryGrid.appendChild(node);
    });
  }

  // ---------- Wizard ----------

  const PLAN_ITEMS = [
    { key: "gather", label: "Gather Data" },
    { key: "quotes", label: "Primary Research Quotes" },
    { key: "insights", label: "Insights" },
    { key: "obs", label: "Observations" },
    { key: "pain", label: "Pain points and Needs" },
    { key: "patterns", label: "Behaviour Patterns" },
    { key: "persona", label: "Behaviour Persona" },
    { key: "contra", label: "Contradictions" },
    { key: "journey", label: "Journey Map" },
    { key: "flows", label: "Flows" },
    { key: "summarize", label: "Summarize" },
    { key: "opportunity", label: "Product Opportunity and Direction" },
  ];

  const wzSteps = {};
  document.querySelectorAll(".wz-step").forEach((s) => (wzSteps[s.dataset.step] = s));

  const wzTopic = document.getElementById("wz-topic");
  const wzNeed = document.getElementById("wz-need");
  const wzWho = document.getElementById("wz-who");
  const wzApproach = document.getElementById("wz-approach");
  const wzPlanGrid = document.getElementById("wz-plan-grid");
  const wzSynthStatus = document.getElementById("wz-synth-status");
  const wzSynthNote = document.getElementById("wz-synth-note");
  const wzSynthBack = document.getElementById("wz-synth-back");
  const wzViewReportBtn = document.getElementById("wz-view-report");

  let wzState = { selected: {} };
  let pendingReport = null;
  let pendingReportSlug = null;

  function renderPlanGrid() {
    wzPlanGrid.innerHTML = "";
    PLAN_ITEMS.forEach((item) => {
      const pill = el("div", "wz-pill");
      const isSel = !!wzState.selected[item.key];
      pill.classList.toggle("wz-pill-selected", isSel);
      pill.appendChild(el("span", "wz-pill-dot"));
      pill.appendChild(el("span", "wz-pill-label", item.label));
      pill.addEventListener("click", () => {
        wzState.selected[item.key] = !wzState.selected[item.key];
        renderPlanGrid();
      });
      wzPlanGrid.appendChild(pill);
    });
  }
  renderPlanGrid();

  function goToStep(name) {
    Object.values(wzSteps).forEach((s) => (s.hidden = true));
    wzSteps[name].hidden = false;
  }

  document.querySelectorAll("[data-next]").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      goToStep(btn.dataset.next);
    })
  );
  document.querySelectorAll("[data-prev]").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      goToStep(btn.dataset.prev);
    })
  );

  wzSynthBack.addEventListener("click", () => {
    stopPolling();
    wzSynthStatus.hidden = false;
    wzSynthNote.hidden = true;
    wzViewReportBtn.hidden = true;
    pendingReport = null;
    pendingReportSlug = null;
    highlightSlug = null;
    showLibrary();
  });

  function resetWizard() {
    stopPolling();
    wzState = { selected: {} };
    wzTopic.value = "";
    wzNeed.value = "";
    wzWho.value = "";
    wzApproach.value = "";
    renderPlanGrid();
    wzSynthStatus.hidden = false;
    wzSynthNote.hidden = true;
    wzViewReportBtn.hidden = true;
    pendingReport = null;
    pendingReportSlug = null;
    goToStep("cover");
  }

  function buildScope() {
    const parts = [];
    if (wzNeed.value.trim()) parts.push(`Need: ${wzNeed.value.trim()}`);
    if (wzWho.value.trim()) parts.push(`Who: ${wzWho.value.trim()}`);
    const planLabels = PLAN_ITEMS.filter((i) => wzState.selected[i.key]).map((i) => i.label);
    if (planLabels.length) parts.push(`Plan: ${planLabels.join(", ")}`);
    if (wzApproach.value.trim()) parts.push(`Approach: ${wzApproach.value.trim()}`);
    return parts.join(" | ").slice(0, 300);
  }

  // ---------- Submit + poll + view report ----------

  const POLL_INTERVAL_MS = 5000;
  const POLL_TIMEOUT_MS = 10 * 60 * 1000;
  let pollTimer = null;

  function stopPolling() {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = null;
  }

  async function submitAndSynthesize() {
    const topic = wzTopic.value.trim();
    if (!topic) {
      goToStep("solve");
      wzTopic.focus();
      return;
    }
    const scope = buildScope();

    wzSynthStatus.hidden = false;
    wzSynthNote.hidden = true;
    wzViewReportBtn.hidden = true;
    pendingReport = null;
    pendingReportSlug = null;
    goToStep("synth");

    const knownBefore = new Set((await fetchLibraryList()).map((e) => e.slug));

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, scope }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Could not submit that topic.");
    } catch (err) {
      wzSynthNote.hidden = false;
      wzSynthNote.textContent = err.message || "Something went wrong submitting this request.";
      return;
    }

    watchForTopic(topic, knownBefore);
  }

  function watchForTopic(topic, knownBefore) {
    stopPolling();
    const target = topic.trim().toLowerCase();
    const startedAt = Date.now();

    pollTimer = setInterval(async () => {
      if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
        stopPolling();
        wzSynthNote.hidden = false;
        wzSynthNote.textContent = "Still queued — this can take a while depending on when it's picked up. Check back later, or reload to see it in the library once it's published.";
        return;
      }

      const list = await fetchLibraryList();
      const match = list.find(
        (e) => !knownBefore.has(e.slug) && (e.topic || "").trim().toLowerCase() === target
      );
      if (!match) return;

      stopPolling();
      try {
        pendingReport = await fetchReport(match.slug);
        pendingReportSlug = match.slug;
      } catch {
        wzSynthNote.hidden = false;
        wzSynthNote.textContent = "Found the report but couldn't load it. Try again from the library.";
        return;
      }
      // Report's ready: "Synthesizing" stays put at right-center, and
      // "View report" appears below it at bottom-right — only now, never
      // before the report actually exists.
      wzViewReportBtn.hidden = false;
    }, POLL_INTERVAL_MS);
  }

  wzViewReportBtn.addEventListener("click", async () => {
    if (!pendingReport || !pendingReportSlug) return;
    const selectedKeys = new Set(PLAN_ITEMS.filter((i) => wzState.selected[i.key]).map((i) => i.key));
    highlightSlug = pendingReportSlug;
    showLibrary();
    await openLibraryReport(pendingReportSlug, selectedKeys);
  });

  document.querySelectorAll("[data-submit]").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      submitAndSynthesize();
    })
  );

  document.getElementById("wz-solve-form").addEventListener("submit", (e) => e.preventDefault());
})();
