# The Siege of Ironhold

A standalone Andon–Jidoka classroom game for six teams and one instructor.

**designed and deployed by Indranil BISWAS**

This is a separate website. It does not require or modify the project management website.

## Run immediately

Open `index.html` in a modern browser. It contains the interface, styles and game engine in one file. There are no package installations, external fonts, network requests, accounts or Streamlit dependencies required to play.

One instructor operates the screen. Six teams discuss and announce their decisions. Opening the URL on six devices creates six independent games; this edition does not synchronize devices.

## Publish as a NEW GitHub Pages website

1. Create a new public GitHub repository, for example `ironhold-game`.
2. Extract this ZIP. Upload its **contents**, with `index.html` at the top level of the repository. Do not upload only the ZIP or put everything inside another enclosing folder.
3. In that new repository, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select **main** and **/ (root)**, then **Save**.
6. Wait for the Pages deployment to complete. Use the website address displayed in Settings → Pages.

If the repository is named `ironhold-game` under `endroneel`, the resulting address will normally be `https://endroneel.github.io/ironhold-game/`. That is the intended address after you publish; this package has not created or deployed a repository.

Only `index.html` is essential for the game. `.nojekyll` is included. The source, tests and documents are optional for hosting but useful for teaching and maintenance.

Official setup reference: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Classroom use

Read `CLASSROOM_GUIDE.md`. Start in Practice mode for the first run. Mission mode requires an instructor-selected target of 1–30 approved Titans. The rules have been reconciled, but target difficulty and game balance need classroom piloting.

The **Story & rules** view is available within the page, including when offline. The `documents/` folder contains the revised printable rules, scorecard and story.

## Saves and records

- **Save game** downloads a JSON history; it is the portable backup.
- **Load game** validates and replays that history to recover inventories, cash, queued repairs and the exact pending decision.
- **Resume saved session** uses browser storage when available. Do not rely on it as the sole backup; private browsing, clearing browser data, a new origin or opening a different local file can remove or isolate that save.
- **Export CSV** downloads the six team ledgers. Rows whose output was not released are marked `no`. Settlement charges appear separately.
- **Undo entry** is for an instructor input error, not unfavorable dice. It removes the most recent action and rebuilds the prior state.
- The JSON contains no account credentials. It is not a tamper-proof assessment record: someone can replace it with another legal history.

## Editing and tests

The editable source is in `src/`. Open `src/index.html` to run those separate files directly. After edits, rebuild the one-file website:

```sh
node build.mjs
node tests/engine.test.cjs
```

Node is only needed for development and automated tests, not for classroom use or hosting. No `npm install` is needed.

The engine is separate from the interface and uses deterministic actions. Tests cover production flow, event and solution applicability, repairs, supplier attribution, vendor changes, protection boundaries, bankruptcy, settlement, save/load and randomized accounting invariants. The test suite does not establish pedagogical balance or real-world manufacturing probabilities.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Complete website, ready to open or upload |
| `CLASSROOM_GUIDE.md` | Facilitation and debrief instructions |
| `src/engine.js` | Game state, rules and accounting |
| `src/ui.js` | Browser controls, views, saves and CSV export |
| `src/style.css` | Responsive visual design |
| `src/index.html` | Editable page structure and embedded rule explanations |
| `build.mjs` | Bundles source into the standalone HTML page |
| `tests/engine.test.cjs` | Automated rule checks |
| `documents/` | Revised teaching PDFs and score workbook |

## Troubleshooting

**404 after publishing:** confirm you are configuring the new repository, and `main / (root)` contains lowercase `index.html`. Check the Pages deployment status under Actions.

**Old version appears:** refresh after deployment completes. Download the current game save first if you want to preserve it.

**No resume button:** browser storage may be unavailable or belong to another origin. Use Load game with the JSON backup.

**Why did a team skip its roll?** It is serving repair hours or lacks a complete input set. Read the latest events and its team card.

**Why did a die reroll?** Only applicable event and solution faces are accepted. Unknown causes, inapplicable causes and protected raw-material events require another die.

**Why did a team pay for another team's defect?** A valid rework result assigns its cost to the detecting team's immediate supplier using the revised attribution rule.

## Scope

Rules version 3.0.0. Starting funds are fixed at 10 gold; 15 rounds; ticket rates 1/2/7 gold. A signal is not a separate fine. This edition models defects as incidents that reduce or hold output rather than as hidden bad batches. No artificial revenue, recurring-defect probabilities, extra phase penalties or autonomous opponent decisions have been added.
