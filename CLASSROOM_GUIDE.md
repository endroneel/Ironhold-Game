# Running Ironhold in class

**designed and deployed by Indranil BISWAS**

## Prepare

Project the standalone `index.html` from a laptop, or open the new GitHub Pages website. Allocate six teams: Shops 1, 2 and 3; Subassembly; Final Assembly; Quality. The instructor is the Factory Manager and controls the page.

Use Practice mode for the first session. If selecting Mission mode, announce the whole-game shipment target before starting. Choose a target after piloting; the interface's upper bound of 30 is not a recommended difficulty.

Allow time to explain the production network, play up to 15 rounds and debrief after rounds 5, 10 and 15. Duration depends on team discussion and rerolls; there is no automatic countdown or forced decision timer.

## Explain the common mission

Each guild has 10 gold. Each completed unit is one whole Titan. A capacity of one is half of full capacity, not half a Titan.

The factory must survive as a system. If any team reaches zero or negative gold, play stops and no Master Guild is awarded. With a target, the richest surviving team is recognized only if the factory meets the target after final settlement. Ties share the title.

## Facilitate each round

1. Resolve due analysis at the start. Repairs are then served automatically.
2. The action panel identifies the current team and exact decision or die required. Other teams can see cash, queued hours and buffers.
3. Click **Roll virtual die**, or enter the physical die result and click **Record roll**. On a physical d10, enter 10 for a face marked 0.
4. On machine failure or misalignment, let the team discuss Yellow future action, Yellow analysis or Red before clicking. Breakdown and defective-part events require immediate action.
5. On a vendor event, collect and enter a vote from each of the three component shops. A third occurrence forces the change automatically.
6. Before **Transfer good units**, ask the class to calculate each team's feasible output from its capacity, repair hours and input buffers. Then release and compare.
7. Continue through all four stages and click **Begin next round**. The app pauses at the end of every round; at rounds 5 and 10 it highlights the cycle debrief.

Teams in the same stage release output together. Their event decisions are resolved in the published fixed order. Monetary charges are committed at each resolved incident; a vendor change charges all three shops atomically. Bankruptcy stops further decisions and prevents any unreleased stage output from being transferred. All due analysis tasks form a round-opening batch before the bankruptcy check.

## Make accounting visible

- A new 4-hour ticket costs 1 gold; an 8-hour ticket costs 2; a forced-vendor 32-hour ticket costs 7.
- Pay when the ticket is created, not again when its hours are served.
- A team serves at most 8 hours per round. Unserved hours carry forward.
- A team serving repairs uses base capacity 2 for its remaining time and skips the production die.
- Stock shortages carry no invented monetary fine. They reduce output.
- Rework can charge an upstream team that has already produced. Its repair starts next round; the detecting team holds output and retains its inputs.

The ledger shows all charges. The history shows the dice and decisions that generated them. The team cards show both hours served this round and hours still outstanding.

## Close the game

After round 15, click **Settle outstanding analysis**. Resolve any required dice. The app then assesses the result with all final charges included. Already-paid repair hours after the horizon are disclosed without another charge or extra production.

Save the JSON and export the CSV before leaving. If the factory failed early, discuss that outcome rather than silently resetting the poorest team's gold. Begin a new session if you want a second experiment.

## Debrief prompts

Ask teams to connect their answers to a specific incident in the history:

1. Where did shortages propagate? Which team appeared idle even though it had no local failure?
2. Did the richest team contribute to the best system outcome? What does that say about local performance measures?
3. How did an immediate stop differ from a planned repair when buffers were available?
4. Did a vendor change protect the factory, and what was the short-term cost?
5. Why is an honest signal useful if the signal itself carries no fine?
6. Where does random rework attribution differ from real traceability and root-cause analysis?
7. What is absent from this simplified supplier quality-control model—for example hidden defective units, recurrence and inspection accuracy?

## Learning experiments

Use a first run to observe the system, then a second run to test a different decision policy. Different random rolls can themselves change outcomes; do not attribute every difference to strategy. Saved histories support exact replay of the same decisions and outcomes, but this version does not yet provide counterfactual replay with a fixed independent random stream by event type.

Use Undo only to correct an entry. It is not a team strategy or a free reroll. No participant accounts, shared-device synchronization or secure exam-grade audit trail are provided.

## Procurement edition 3.1 interface

The webpage uses procurement exception alerts and quality holds with corrective action. Planned supplier corrective action schedules work for the next round; supplier risk review defers assessment; a quality hold resolves the incident immediately. Costs, eligibility and probabilities are unchanged. The linked original revised PDFs describe the original manufacturing framing; use the in-page procurement rules for the current interface.

After each die roll, read the large result card and click Continue. A production D6 of 1–3 explicitly requires D10; 4–6 explicitly does not. The separate D10 button appears only when an event is required. Odd or inapplicable D10 results require another D10. All rolls remain in the ledger.

Guild names include their roles on the action panel, team cards and ledger; the expandable guild directory also lists them before play. The six inline SVG icons are original artwork bundled with the game.

## Guild treasury and Game Master (3.5)

Before a new session, expand Game Master setup and choose starting gold per guild (1–1000; default 10). During play, expand Transfer gold between guilds on Factory floor, choose sender and recipient, enter a whole amount and record the agreement. The sender must keep at least 1 gold. Transfers conserve factory gold but affect richest-guild rankings, so discuss pooling incentives.

Click Enter Game Master mode to reveal instructor controls. Enter your name, select one guild or all six, choose a gold grant/penalty, free extra downtime for next round (rounds 1–14), or a custom instruction note. A note does not change calculations. Explain every exception. Zero or negative gold ends the game, including instructor penalties; transfers must precede a bankrupting charge. Closed games cannot be revived except by Undo to correct an entry. Existing queued repairs are retained when adding downtime.

All transfers and exceptions are included in history, saved replay and CSV. Repair costs are shown separately from net cash movements. The displayed gold baseline reflects the starting rule; grants may make current gold exceed it. Instructor mode is a shared-screen facilitator control, not an authenticated account or student access restriction.

## Role dashboards and classroom reveal (3.6)

Choose Game Master on entry to create or restore the session. Use Switch role / hand over screen to select a guild. A guild dashboard shows only that guild's displayed balances, relevant input/output stock, downtime, transfers and history, plus common rules. Dice and procurement responses are available only on that guild's turn. Sending gold is restricted to the selected guild. The instructor handles supplier votes, stage transfers and round progression in the Game Master view.

The Game Master retains the full dashboard, exports, exception controls and starting-gold setup. Showcase all guilds opens a read-only debrief: choose a recorded round to see balances, cumulative output, queued downtime and that round's complete event history. A current incomplete round is labelled recorded so far. Return to Game Master resumes the live state unchanged. Save the game to review it later.

This is shared-browser role switching, not authenticated multiplayer. Role selection is unrestricted and the complete game remains in the browser and save file. It is not suitable for securely concealing information from students who control the device. Separate phones/laptops do not synchronize. Private per-guild sessions require a backend with authentication, server-enforced role access and authoritative game state.

### Player dice tab
Each guild opens on **Roll dice**. Only the die required for that guild’s current action is offered; other guilds wait. Review the displayed result, then continue to a separate D10 roll when required, or the next procurement decision. D4 and other prescribed rolls appear automatically when the rules require them. Use **Guild stock & history** for inventory and transfers.

### Round-by-round procurement lab
Open **Ledger & History → Procurement lab** and expand a round (also included in the Game Master round showcase). Use its actual calculations to trace capacity, complete input sets, material balances, cash transfers and repair charges. Partial rounds are labelled “recorded so far”; production and final settlement are kept separate.

Ask guilds to explain: (1) which shortage or corrective work limited shipments, (2) where stock accumulated, (3) who paid versus who experienced the delay, and (4) what recovery commitment they would negotiate. A transfer redistributes liquidity; it does not create factory cash or change capacity. New charges per shipment are a period indicator, not a full unit cost or total cost of ownership. Compare voluntary and forced supplier switching, then discuss why a cheaper option may still depend on the remaining horizon and future risks. Dice expected values are averages, not guarantees.
