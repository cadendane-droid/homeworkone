(function () {
  const C = window.CONTENT || {};
  const $ = (id) => document.getElementById(id);

  // Build elements with textContent only, so nothing in content.js is parsed as HTML.
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else el.setAttribute(k, v);
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return el;
  }

  // ── Dates ─────────────────────────────────────────────────────────────────
  const DAY = 86400000;
  const TIERS = [
    { key: "5-day", label: "5 Days", days: 5 },
    { key: "2-week", label: "2 Weeks", days: 14 },
    { key: "1-month", label: "1 Month", months: 1 },
    { key: "6-month", label: "6 Months", months: 6 },
  ];
  const tierOf = (key) => TIERS.find((t) => t.key === key);

  const parseDate = (s) => {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  const fmtDate = (d) => d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  // Round, not floor, so daylight-saving shifts don't knock a day off.
  const daysBetween = (a, b) => Math.round((b - a) / DAY);
  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  function targetOf(goal) {
    if (goal.target) return parseDate(goal.target);
    const t = tierOf(goal.tier) || {};
    const d = parseDate(goal.start);
    if (t.days) d.setDate(d.getDate() + t.days);
    if (t.months) d.setMonth(d.getMonth() + t.months);
    return d;
  }

  function groupByTier(goals) {
    return TIERS.map((t) => ({ tier: t, goals: goals.filter((g) => g.tier === t.key) })).filter((g) => g.goals.length);
  }

  function deliverableEl(d) {
    if (!d) return null;
    const body = Array.isArray(d) ? h("ul", {}, d.map((x) => h("li", {}, x))) : h("p", {}, d);
    return h("div", { class: "deliverable" }, h("span", { class: "label" }, "Deliverable"), body);
  }

  function metricEl(m) {
    const pct = m.target ? Math.max(0, Math.min(100, Math.round((m.current / m.target) * 100))) : 0;
    return h(
      "div",
      { class: "metric" },
      h("div", { class: "metric-row" }, h("span", {}, m.label), h("span", {}, `${m.current} / ${m.target}`)),
      h("div", { class: "bar", role: "progressbar", "aria-label": m.label, "aria-valuenow": pct, "aria-valuemin": 0, "aria-valuemax": 100 }, h("span", { style: `width:${pct}%` }))
    );
  }

  // ── Goals ─────────────────────────────────────────────────────────────────
  const goals = C.goals || [];
  if (!goals.length) {
    $("goal-tiers").append(h("p", { class: "empty" }, "No active goals. Pick the next one."));
  }
  groupByTier(goals).forEach(({ tier, goals }) => {
    $("goal-tiers").append(
      h(
        "div",
        { class: "tier" },
        h("h3", { class: "tier-label" }, tier.label),
        h(
          "div",
          { class: "goal-grid" },
          goals.map((g) => {
            const start = parseDate(g.start);
            const target = targetOf(g);
            const left = daysBetween(today, target);
            const total = Math.max(1, daysBetween(start, target));
            const elapsed = Math.max(0, Math.min(1, daysBetween(start, today) / total));
            const notStarted = today < start;

            let countdown, state;
            if (left > 0) {
              countdown = `${plural(left, "day")} until completion`;
              state = "";
            } else if (left === 0) {
              countdown = "Due today";
              state = "due";
            } else {
              countdown = `${plural(-left, "day")} overdue`;
              state = "overdue";
            }

            return h(
              "article",
              { class: `goal ${state}` },
              h("p", { class: "countdown" }, countdown),
              h("h4", {}, g.title),
              g.details ? h("p", { class: "details" }, g.details) : null,
              deliverableEl(g.deliverable),
              (g.metrics || []).map(metricEl),
              h(
                "div",
                { class: "timeline" },
                h(
                  "div",
                  { class: "metric-row" },
                  h("span", {}, "Time elapsed"),
                  h("span", {}, `${Math.round(elapsed * 100)}%`)
                ),
                h(
                  "div",
                  { class: "bar time", role: "progressbar", "aria-label": "Time elapsed", "aria-valuenow": Math.round(elapsed * 100), "aria-valuemin": 0, "aria-valuemax": 100 },
                  // Hue slides from purple (267) to green (142) as the period runs out.
                  h("span", { style: `width:${Math.round(elapsed * 100)}%;--fill:hsl(${Math.round(267 - 125 * elapsed)} 75% 60%)` })
                ),
                h(
                  "div",
                  { class: "dates" },
                  h("span", {}, notStarted ? `Starts ${fmtDate(start)}` : `Started ${fmtDate(start)}`),
                  h("span", {}, `Due ${fmtDate(target)}`)
                )
              )
            );
          })
        )
      )
    );
  });

  // ── Completed ─────────────────────────────────────────────────────────────
  const completed = C.completed || [];
  if (!completed.length) {
    $("completed-tiers").append(h("p", { class: "empty" }, "Nothing here yet. The first one is on its way."));
  }
  groupByTier(completed).forEach(({ tier, goals }) => {
    $("completed-tiers").append(
      h(
        "div",
        { class: "tier" },
        h("h3", { class: "tier-label" }, tier.label),
        h(
          "ul",
          { class: "done-list" },
          goals.map((g) => {
            const start = parseDate(g.start);
            const finished = parseDate(g.finished);
            const took = Math.max(0, daysBetween(start, finished));
            return h(
              "li",
              {},
              h("span", { class: "check", "aria-hidden": "true" }, "✓"),
              h("div", {}, h("strong", {}, g.title), h("span", { class: "muted" }, `${fmtDate(start)} – ${fmtDate(finished)}`)),
              h("span", { class: "took" }, took === 0 ? "Same day" : `Took ${plural(took, "day")}`)
            );
          })
        )
      )
    );
  });

  // ── Motivation rows ───────────────────────────────────────────────────────
  const rows = C.motivation || [];
  if (!rows.length) $("motivation").hidden = true;
  rows.forEach((r, i) =>
    $("motivation-rows").append(
      h(
        "figure",
        { class: `row reveal ${i % 2 ? "flip" : ""}` },
        h("div", { class: "pic" }, h("img", { src: r.image, alt: r.alt || "", loading: "lazy", style: r.focus ? `object-position:${r.focus}` : null })),
        h("figcaption", {}, h("blockquote", {}, r.quote), r.by ? h("cite", {}, r.by) : null)
      )
    )
  );

  // ── More quotes ───────────────────────────────────────────────────────────
  const quotes = C.quotes || [];
  if (!quotes.length) $("quotes").hidden = true;
  quotes.forEach((q) => $("quote-list").append(h("li", { class: "reveal" }, h("blockquote", {}, q.text), q.by ? h("cite", {}, q.by) : null)));

  // ── Achievements ──────────────────────────────────────────────────────────
  const wins = C.achievements || [];
  if (!wins.length) $("achievements").hidden = true;
  $("achievements-lede").textContent = `${wins.length} hard things you've already done. You're not starting from zero.`;
  wins.forEach((a) =>
    $("achievement-list").append(h("li", { class: "reveal" }, h("strong", {}, a.title), a.note ? h("span", {}, a.note) : null))
  );

  // ── Fade in on scroll ─────────────────────────────────────────────────────
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -10% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }
})();
