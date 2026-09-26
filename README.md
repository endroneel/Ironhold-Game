# Ironhold — France & Kazakhstan editions

A standalone procurement, supplier-quality and coordination classroom game for six guilds and a Game Master.

**designed and deployed by Indranil BISWAS**

**Play:** https://endroneel.github.io/Ironhold-Game/

## Country and language are separate choices

At the top of every screen, **France · Français** selects the France-inspired setting and **Kazakhstan · Қазақша** selects the Kazakhstan-inspired setting. These buttons change the story, guild identities, portraits, Game Master artwork, workshop, ledger, council and background scenes. They do not select an interface language.

The separate **English**, **Русский**, **Français** and **Қазақша** buttons change the interface language without changing the selected country. Both countries support all four languages. For example, France + Русский keeps the French setting and presents its rules, names, decisions and teaching explanations in Russian.

Country and language preferences are retained in this browser when storage is available. Changing either preference does **not** restart a session, change a die result, deduct gold or modify the saved action history. Existing game saves remain compatible.

Direct classroom links:

- France / English: https://endroneel.github.io/Ironhold-Game/?setting=fr&lang=en
- France / Russian: https://endroneel.github.io/Ironhold-Game/?setting=fr&lang=ru
- Kazakhstan / English: https://endroneel.github.io/Ironhold-Game/?setting=kz&lang=en
- Kazakhstan / Russian: https://endroneel.github.io/Ironhold-Game/?setting=kz&lang=ru

## The six guilds

| Supply-chain role | France setting | Kazakhstan setting |
| --- | --- | --- |
| Shop 1: frames | Forges de Normandie | Saryarqa Smiths · Сарыарқа |
| Shop 2: engines | Horlogers du Jura | Altai Gearmakers · Алтай |
| Shop 3: armor | Armuriers de Saint-Étienne | Zhetysu Armorers · Жетісу |
| Subassembly | Compagnons de la Loire | Shanyraq Assembly · Шаңырақ |
| Final assembly | Ateliers du Creusot | Tulpar Builders · Тұлпар |
| Quality inspection | Gardiens de Lyon | Qyran Inspectors · Қыран |

France is a fictional Seine-side guild city inspired by Rouen, with timber-framed buildings, Gothic council windows, riverside accounts and original vector bande-dessinée artwork. The Kazakhstan setting retains its steppe, caravan-city and shanyraq-inspired comic illustrations.

All guilds are **fictional**. Names combine cultural and craft inspirations rather than reconstructing actual organizations or a single historical period. The Jura mechanical-craft reference is documented by [UNESCO](https://ich.unesco.org/en/RL/craftsmanship-of-mechanical-watchmaking-and-art-mechanics-01560); Saint-Étienne's armouring heritage is described by its [Musée d’Art et d’Industrie](https://mai.saint-etienne.fr/decouvrir/collections/collection-armes); Le Creusot's industrial heritage is described by the [city](https://www.le-creusot.fr/ma-ville/economie-locale/industrie/). These sources inform the fictional setting; the illustrations are not copied from them.

## Run and teach

Open the published site, or open the generated root `index.html` in a modern browser. The file includes the game, translations and both artwork sets. No account, server, external font service, live translation API, installation or Streamlit dependency is needed to play.

Choose **Game Master** to start or restore a session. Six guilds then take turns using their own dashboards and rule-appropriate dice tabs. The Game Master can reveal the common results. Start in Practice mode for a first run; Mission mode needs an instructor-chosen target of 1–30 approved Titans. Each guild starts with 10 gold by default, configurable from 1 to 1000 before the session.

**This remains a shared-browser classroom game, not synchronized multiplayer.** Opening it on separate devices creates independent sessions. The QR code opens the website; it does not connect a device to someone else's game. Role views are display filters, not authenticated private accounts.

The rules and procurement lab explain production capacity, input constraints, buffer balances, repair charges, inter-guild transfers, supplier negotiations and the consequences of each recorded round. Target difficulty and game balance still require classroom piloting.

## Saves and exports

**Save game** downloads a portable JSON action history. **Load game** validates and replays it; editable balances are not trusted. **Resume saved session** uses this browser's existing storage. Download a save before clearing browser data or changing devices. **Undo entry** is for correcting input errors, not rerolling an unfavourable result.

JSON and CSV keep the canonical engine format for replay and accounting; the country and language are presentation preferences. The on-screen ledger, history, guild names and teaching explanations use the chosen country and language. Free-form instructor names, reasons and session names are not sent to any translation service. The designer credit remains exactly as written above in every language.

## Development and regression tests

Edit files under `src/`, then rebuild the root page. Serve or open **the generated root `index.html`**, not the unbundled source template.

```sh
npm install --no-save --package-lock=false jsdom@26
node build.mjs
node --test --test-timeout=90000 tests/*.test.cjs
```

Node and jsdom are development dependencies only. The GitHub Actions workflow builds, runs all regression suites and commits the generated standalone page only after tests pass. A subsequent normal repository commit triggers the branch-based GitHub Pages deployment; GITHUB_TOKEN-generated commits alone do not start a new Pages build.

The edition regression suite covers all **2 countries × 4 languages**, all 10 France artwork replacements, titles and localized guilds, Russian rules and procurement calculations, player dice and role switching, query links, saved preferences, invalid preferences and byte-for-byte preservation of game saves during switching. The pre-existing engine, treasury, role, teaching, UI and French/Kazakh translation tests remain in place.

| Source | Purpose |
| --- | --- |
| `src/engine.js` | Unchanged game rules, deterministic actions and accounting |
| `src/ui.js` | Role dashboards, dice, transfers, Game Master and records |
| `src/teaching.js` | Round-level procurement calculations and interpretation |
| `src/editions.js` | Country stories, place labels and localized guild identities |
| `src/edition-art.js` | Original self-contained France comic scenes and portraits |
| `src/editions.css` | Country controls, edition banner and responsive theme |
| `src/locales-runtime.js` | Independent country/language switching and reversible display translation |
| `src/locale-phrases.tsv` | Existing English/French/Kazakh phrase catalog |
| `src/locale-ru.txt` | Russian translation of all 486 existing phrases |
| `src/locales/rules-ru.html` | Complete Russian rulebook |
| `build-locales.mjs` | Validates translation coverage and source-key alignment |
| `build.mjs` | Embeds code, translations and artwork into one offline-capable file |
| `tests/editions.test.cjs` | Country/language and save-preservation regressions |

## Troubleshooting

**Old screen:** reload after deployment, or perform a hard refresh. Do not clear site data before downloading a game save.

**No resume button:** browser storage may be unavailable or associated with another origin. Use Load game with the JSON backup.

**No roll available:** your guild may be waiting for another role, serving repair hours or missing a complete input set. The player dice tab explains the current turn.

**Repeated D10 or D4:** odd, protected or inapplicable results must be rerolled under the rules; these rerolls do not create extra charges.

**Shared-screen controls are not private:** do not use this game as a tamper-proof assessment system. A valid JSON history can be replaced by another valid history.
