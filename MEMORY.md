# MEMORY — Noesis (BrilliantRebuild)

> Lessons learned: what worked, what failed, what the AI got wrong and corrected. Read at session start.
> Strategic context lives in `MASTER_PLAN.md`; current state in `HANDOFF.md`.

## Research findings that shape decisions

- **Brilliant has narrowed to math + coding (observed; trend `inferred`).** Tagline (2026): "Your Personal Tutor for
  Math & Coding." Most science courses were retired. Reaching the new quality bar per science course is the plausible
  cost driver (`inferred`). Restoring STEM breadth is therefore a primary goal, not a nice-to-have.
- **Retirement mechanism.** Courses that "no longer meet our threshold" move to a desktop "Archived" section and their
  URLs are reused (e.g. `/courses/physics-everyday/` now serves Circuits). Mid-progress disappearance is reported in
  App Store reviews (tier 6 observed), not an official policy statement.
- **Rebuilt lessons are longer.** About 12.7–17 exercises per lesson vs 6.3–8.6 in older courses. Exercise granularity
  may differ across formats and some legacy courses remain live, so this is a directional comparison, not a controlled
  measurement. Core target of 12–17 generator-backed exercises per lesson comes from this.
- **Lesson anatomy observed directly.** ~5 escalating problems on one manipulative → concept card after the first two
  → takeaway → 3 one-shot check items → celebration chain (XP → streak → charge → league → upsell).
- **Wrong-answer behavior.** Amber state, simulation plays the consequence, misconception-specific hint, then
  "Try again" / "See answer." Check phase is one-shot with no retry.
- **Learn and measure are deliberately separate (separation observed; intent `inferred`).** The separation is a core
  design pattern in the product, not incidental UI.
- **Brilliant's engine (as described in 2022–2023 sources; current implementation may differ).** Generator + LLM + evals.
  Camperdown (strict lesson markup), Diagrammar (interactive inputs + pure function), MathLive → MathJSON → an
  "expectations" checker, Koji (tutor with tools on lesson state). A 2023 job posting described the lesson experience
  as "the layout engine that supports different modules for progressive discovery of math and science concepts,
  interactivity, branching paths, hints, and feedback."
- **Pain points to fix:** 2 keys/day cap (warm-ups cost keys), no offline use, terse explanations, weak cumulative
  review, fragile drags, no publicly documented accessibility features, gamification that reads as twee for adults.
- **Legacy breadth:** 60–110+ courses, science peaking around 19–20 titles (2022–23). Daily Challenges, community
  explanations, a wiki, typed lesson modes, cross-domain prerequisite graph. A "5-difficulty topic probe" appears only
  in an unconfirmed review summary; treat it as `inferred` and verify before using it.
- **Side effects on the user's Brilliant account (2026-10-10):** both free keys used; 1-day streak; 180 XP earned;
  Koji not used. Do not repeat account actions without asking.

## Synthesis outcomes (Session 1)

- 90 canonical features. States: keep 57, merge 10, defer 19, drop 4.
- Milestones: core 34, v1 33, v1.x 14, v2 5.
- Dropped: weekly leagues, parent/educator dashboards, accounts/paywall, community discussion/voting.
- Authoring source of truth is `docs/synthesis/_source/features.py`. The three generated artifacts are
  `02-feature-matrix.md`, `02-feature-matrix.csv`, and `04-selection-schema.yaml`; the teardown cards, cluster map, and
  blueprint are authored.
- Structural QA passes with 0 errors, 0 warnings:
  - duplicate names
  - dangling dependencies
  - dependency cycles
  - milestone closure (no dependency on a later release)
  - rationale present; merge logic present; defer/drop scheduled correctly
- Research files 02–07 were each adversarially verified: 72 checks, none refuted.

## What worked

1. **A single source-of-truth data file + generator.** `features.py` → artifacts prevents drift between the matrix,
   schema, and prose. Kept.
2. **Machine-checked plan structure.** Cycles, dangling deps, and milestone leakage are exactly the errors a
   long planning session makes. The build script catches them for free. Run it after any feature change.
3. **Adversarial verification.** Independent checks found no refutations but materially raised confidence. Apply the
   same pattern to architecture and content claims.
4. **Separating learn from measure.** Directly observed in the product and easy to lose in implementation. It is now
   an invariant.
5. **Evidence tiers.** Marking `verified` / `observed` / `inferred` kept the synthesis honest about what is known.

## What failed / what to avoid

1. **Research workflow is session-bound.** The cached replay path
   (`Workflow({scriptPath: ".../brilliant-research-sweep-v2-wf_88dab43a-93b.js", resumeFromRunId: ...})`) only works
   in the original session. In a new session, re-run the `user_voice` prompt from that script instead.
2. **Two research gaps remain:** `user_voice` never finished and the completeness critic never ran. Do not present the
   research as exhaustive. Prioritize before P4 tutor design; add `08-user-voice.md` / `09-completeness-critic.md`
   and rebuild if features change.
3. **Handoff-only context is fragile.** HANDOFF.md had to carry three documents' worth of intent. Fixed by writing
   `MASTER_PLAN.md`, `CLAUDE.md`, and this file.
4. **Do not hand-edit generated artifacts.** It would pass locally and then be overwritten by the next rebuild.
5. **Do not treat the synthesis feature counts as a to-do list.** 67 in-scope features are a *scope boundary*, not a
   demand to build all of them before the first runnable app. Phases gate this.

## AI failure patterns to watch (project-specific)

- **Confident paraphrase of Brilliant.** If a claim is not in `docs/research/` or `docs/synthesis/`, mark it as
  inference or verify it. Never invent a feature, metric, or quote.
- **Content fabrication under pressure.** Generated items are candidates. "Looks right" is not an eval. Keep the gate.
- **Premature architecture.** Choosing module layouts, file trees, or interfaces before `/MasterBuild` is scope creep.
  The MasterPlan intentionally stops at conceptual architecture.
- **Optimizing for demo over correctness.** A beautiful player showing one wrong verdict is a failure. Correctness
  first, then breadth, then polish.
- **Re-litigating locked decisions.** D1–D5 are answered. Reopen only with new evidence and an explicit user request.

## Session log

### Session 1 — 2026-10-10
Research (7 files) and `/synthesis` (5 artifacts). Stopped at the user's request after synthesis. No application code.

### Session 2 — 2026-10-20
- Recorded D1–D5. Codename chosen: **Noesis**.
- Wrote `MASTER_PLAN.md`, `CLAUDE.md`, `MEMORY.md`.
- Verified synthesis QA still passes: `features=90 errors=0 warnings=0`.
- Ran two independent audits. Fixed 6 blocking issues: provenance (`01` vs `02–07`), dependency prose vs schema,
  archive-UI milestone, stale `HANDOFF.md`, journal command arguments, and the R3 simulator contradiction.
- Corrected the blueprint's simplified dependency graph to match the machine-checked schema; updated its decision
  status, course working title, roadmap coverage, and licensing caveat.
- Installed 22 unique Grok bundled skills into `C:\Users\tmsch\.config\opencode\skills`; Claude/agents skills were
  already visible.
- Final independent audit: PASS (no remaining blocking contradictions).
- Next: P0 Foundations (schemas, repo, first lesson fixture) via `/MasterBuild`.

## Open threads

- `user_voice` + completeness critic (research).
- Q1–Q8 in `MASTER_PLAN.md` §14 (spikes, not blockers for P0).
- App toolchain commands (dev/test/lint) do not exist yet; record them in `CLAUDE.md` at P0.

### Session 3 — 2026-10-20
- Built and verified P0–P4; added the P5 custom-topic slice (graph proposal → critics → planner → curator status → UI).
- `npm run typecheck`, `npm test` (64 tests / 13 files), and `npm run build` all pass.
- P5 workflow persists proposals and revisions, supports graph editing with re-critique, and exposes a curator queue at `#/curator`.
- Lessons:
  - PowerShell console capture can mangle Unicode while the file bytes are correct. Check bytes before fixing symbols.
  - A `tsx` server started without watch keeps serving stale code after source edits. Restart before smoke tests.
  - Async tutor-hint updates need `findBy*` (not `getBy*`) in React tests, or the test asserts before the fetch settles and emits `act(...)` warnings.
  - When a concept-edge direction changes, seeding must remove old edges first; otherwise both directions persist and create a false prerequisite cycle.

### Session 4 — 2026-10-21
- Completed **P5 STEM Breadth**:
  - Implemented 4 live science domains (Circuits, Mechanics/Statics, Optics, Chemical Kinetics) and 1 math domain (Balance Equations).
  - Authored 11 deterministic generators in `registry.ts`, verified against pure solvers and eval checks across 100 seeds each (1,100 items tested in `generators.test.ts`, 100% pass rate).
  - Authored interactive SVG ray refraction primitive `OpticsView.tsx`, molecular collision chamber primitive `KineticsView.tsx`, and statics torque primitive `LeverView.tsx`.
  - Added `PathCatalogScreen.tsx` (`#/paths`), `ArchiveScreen.tsx` (`#/archive`), and `SettingsScreen.tsx` (`#/settings`).
  - Integrated responsive navigation in `SiteHeader` across Courses, Tracks, Progress, Custom topic, Curator, Archive, and Settings.
  - Test suite grew from 64 tests across 13 files to **91 tests across 17 files**, all green.
  - `npm run typecheck` and `npm run build` pass cleanly.
- Lessons:
  - In `buildNumericOptions`, multiplying `correct * factor` when `correct === 0` creates identical zeros, leading to infinite loops in `while (specs.length < 4)`. Always add an offset fallback for zero-value answers.
  - In topic keyword scoring, overly broad keywords like `"chemistry"` collide with unrelated queries like `"organic chemistry synthesis"` that don't yet have authored content. Use precise keywords (`"chemical kinetics"`, `"kinetics"`).
  - In TypeScript unions (like `ORDERS = [1, 2, 3] as const`), comparisons against 0 produce TS2367 errors; clean up dead checks when narrowing domain types.

## Open threads (updated)
- P5 breadth is COMPLETE.
- Next: P6 promotions (daily problem, Pyodide code slots, bookmarks) and bundle splitting for KaTeX/mathjs.
