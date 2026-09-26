# Verification record

Verified 26 September 2026, rules version 3.0.0.

## Game engine

19 automated checks passed, including 25 randomized complete games with material-balance and cash reconciliation checks after every action. Coverage includes:

- Perfect production: 30 shipments, no inventory left, no gold lost.
- Invalid and unknown event outcomes; invalid solution rerolls.
- Immediate, scheduled and overlapping repairs; no repeated ticket charges.
- Mandatory red for breakdowns and defective parts.
- Rework origin mapping, input retention and held output.
- Voluntary and forced vendor changes and protection boundaries.
- Round-15 analysis settlement, including bankruptcy at settlement.
- Zero-gold bankruptcy and target failure despite survival.
- Save/load replay, malformed save rejection, undo and CSV output.

Run the checks with `node tests/engine.test.cjs`. They use only Node's standard library.

## Browser interface

The final standalone `index.html` was exercised in headless Chromium 153 from a local file. Checks passed for manual dice, three-shop voting, four-stage transfers, maintenance-related roll suppression, round advancement, browser autosave/resume, JSON download and re-upload, CSV download, rules/ledger navigation and a 390-pixel mobile viewport.

Desktop and mobile layouts were visually reviewed. No page JavaScript errors or horizontal mobile-page overflow were observed. The active navigation tab retains readable contrast when hovered.

The optional `tests/ui.test.cjs` also passed in jsdom, covering setup, escaped session names, invalid input, stage progression, save/resume, undo and navigation. This optional test requires jsdom; it is not required to run the website or the engine tests.

## Limits

No GitHub repository or live Pages deployment was created as part of this standalone package. No synchronized multiplayer service is included. Functional tests do not establish classroom balance, an optimal strategy, or real-world event probabilities. Run a classroom pilot before setting a competitive shipment target.
