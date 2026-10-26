# No Smarter Than You

A single page to come back to: current goals with countdowns, completed goals, motivation, and the hard things I've already done.

## Editing

All of the content is in [`content.js`](content.js), and the comments there explain each field. Images go in [`images/`](images/).

- **New goal:** add it to `goals` with a `tier` (`5-day`, `2-week`, `1-month`, `6-month`) and a `start` date. The due date is calculated from the tier unless you set `target`.
- **Finished a goal:** move it from `goals` to `completed` and add `finished: "YYYY-MM-DD"`. The page shows how long it took.
- **Tracking a number** (like LinkedIn connections): update `metrics[].current`.
- **New picture and quote:** add the image to `images/` and add a row to `motivation`. Rows alternate sides automatically.

"X days until completion" and "X days overdue" are calculated in the browser from today's date, so the page is never out of date and nothing has to be committed daily for the countdowns. A daily routine only needs to move finished goals and update metrics.

## Running locally

Open `index.html` in a browser. There's no build step.

## Hosting on GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**, set the source to **Deploy from a branch**, and choose `main` / `root`.
3. The page goes live at `https://<username>.github.io/<repo>/`.

The repo and page are public. `design/` holds the style reference and isn't used by the page.
