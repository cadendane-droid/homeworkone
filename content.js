// ─────────────────────────────────────────────────────────────────────────────
// All of the page's content lives here. Edit this file; leave the others alone.
//
// Dates are "YYYY-MM-DD".
//
// "X days until completion" and "X days overdue" are worked out in the browser
// from today's date every time the page loads, so they never need updating.
// What does need updating by hand (or by a routine):
//   • when a goal is finished, move it from `goals` to `completed` and add `finished`
//   • `metrics[].current` on any goal you're tracking with numbers
// ─────────────────────────────────────────────────────────────────────────────

window.CONTENT = {
  // ── Goals ──────────────────────────────────────────────────────────────────
  // tier:        "5-day" | "2-week" | "1-month" | "6-month"
  // start:       the day the goal begins
  // target:      optional; defaults to start + the tier's length
  // details:     what the goal is, specifically
  // deliverable: optional; a sentence, or a list of sentences
  // metrics:     optional; [{ label, current, target }] shows a progress bar
  goals: [
    {
      tier: "5-day",
      start: "2026-10-27",
      title: "Grip strength: 45 squeezes per hand at 79 lbs",
      details: "Set my grip strengthener to 79 lbs and do 45 squeezes on each hand.",
    },
    {
      tier: "2-week",
      start: "2026-10-27",
      title: "Figure out what makes Caden, Caden",
      details: "Think deliberately about who I am.",
      deliverable: "A list of my values, attributes and insecurities. No set number of each.",
    },
    {
      tier: "1-month",
      start: "2026-10-27",
      title: "Reach 500 LinkedIn connections",
      details: "Grow my LinkedIn network from 449 to 500 connections.",
      metrics: [{ label: "Connections", current: 449, target: 500 }],
    },
    {
      tier: "6-month",
      start: "2026-10-27",
      title: "Grow AtlasOS to 3,000 monthly visits",
      details:
        "Get my autonomous affiliate marketing site, AtlasOS, to 3,000 page visits per month with a 1% link-click conversion rate.",
    },
    {
      tier: "6-month",
      start: "2026-10-27",
      title: "Write the document that explains who I am",
      details: "Understand myself more deeply, and put it in writing.",
      deliverable: [
        "Outlines who I am.",
        "Includes my values, attributes and insecurities from the 2-week goal.",
        "Holds insights about me that are hard for me to see on my own.",
        "Has a clear list of my strengths and weaknesses.",
        "Lays out a plan for working on my weaknesses.",
      ],
    },
  ],

  // ── Completed goals ────────────────────────────────────────────────────────
  // Same shape as a goal, plus `finished`. Grouped by tier on the page, with how
  // long each one took.
  completed: [],

  // ── Motivation rows ────────────────────────────────────────────────────────
  // Each row is one picture and one quote. Rows alternate sides automatically.
  // focus: optional CSS object-position, for choosing which part of a tall
  // photo stays in frame (e.g. "center 80%").
  motivation: [
    {
      image: "images/gtr.png",
      alt: "A dark grey Nissan GT-R parked on a city street",
      quote: "Men of action are favored by the goddess of good luck.",
    },
    {
      image: "images/discipline.png",
      alt: "Black and white statue under the word DISCIPLINE",
      quote: "Complacency is the death of ambition.",
    },
    {
      image: "images/photo.jpg",
      alt: "Photo on a hillside main street",
      quote: "This life is what you make it.",
      focus: "center 75%",
    },
  ],

  // ── More quotes and phrases ────────────────────────────────────────────────
  // `by` is optional.
  quotes: [
    { text: "Men no smarter than you have figured it out." },
    { text: "Whether you think you can or you can't, you're right." },
    { text: "Success is a skill you can learn." },
    { text: "What is stopping you from getting what you want?" },
    { text: "The world is overly cruel to shy men." },
  ],

  // ── Achievements ───────────────────────────────────────────────────────────
  // Hard things already done. Newest first. `note` is optional.
  achievements: [
    { title: "Accepted into Residents Interhall Congress" },
    { title: "SWE Intern", note: "Zeal IT Consultants" },
    { title: "SIM NextGen Program" },
    { title: "SCLC Top 10 International Finalist" },
    { title: "AI Engineer / QA Engineer Intern", note: "Zeal IT Consultants" },
    { title: "Part-time QA Engineer", note: "Zeal IT Consultants" },
    { title: "Offer for the Claude Corps Fellowship", note: "Anthropic and CodePath" },
    {
      title: "Turned down offers from the Professional Leadership Program and MidCon VC",
      note: "MidCon VC offer was for their Texas representative role",
    },
  ],
};
