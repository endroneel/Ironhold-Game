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
7. What is absent from this simplified Jidoka model—for example hidden defective units, recurrence and inspection accuracy?

## Learning experiments

Use a first run to observe the system, then a second run to test a different decision policy. Different random rolls can themselves change outcomes; do not attribute every difference to strategy. Saved histories support exact replay of the same decisions and outcomes, but this version does not yet provide counterfactual replay with a fixed independent random stream by event type.

Use Undo only to correct an entry. It is not a team strategy or a free reroll. No participant accounts, shared-device synchronization or secure exam-grade audit trail are provided.
