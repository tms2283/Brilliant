# TODO — Noesis (BrilliantRebuild)

Prioritized. Now/Next items have explicit definitions of done.

## Now
1. **Curriculum Expansion — complete.**
   - 6 live STEM & computer science domains: Circuits, Balance, Mechanics, Optics, Chemical Kinetics, and Logic & Digital Gates.
   - 12 pure solver/eval backed generators in `registry.ts` with 100% eval pass rate across 100 seeds each (1,200 items tested).
   - 18 authored, seeded, playable lessons covering 14 core concepts and 9 typed prerequisite edges.
   - 4 curated learning tracks in Path Catalog (`#/paths`): Physics & Physical Systems, Chemical Kinetics & Dynamics, Algebraic Balance & Reasoning, and Computer Science & Digital Logic.
   - 97 tests across 18 test files green; typecheck and production build pass cleanly.

## Next
2. **P6 v1.x promotions**
   - Daily problem, coverage audit, voice/character, reference notes, code slots + Pyodide, reminders/resets, typed modes, adaptive lesson shape, personal-best weeks, weekly narrative, missed-problem bookmarks.
   - DoD: each promoted feature meets its schema promotion condition.

3. **Whole-app hardening**
   - Bundle split: main JS chunk optimization for KaTeX/mathjs.
   - End-to-end browser journey test; offline behavior test.

## Done
- 2026-10-10: Research, from direct observation through the open-source survey (`01` direct observation; `02`–`07` adversarially verified, 72 checks).
- 2026-10-10: `/synthesis`, all five artifacts. QA passes.
- 2026-10-20: Decisions D1–D5 recorded; codename Noesis.
- 2026-10-20: `MASTER_PLAN.md`, `CLAUDE.md`, and `MEMORY.md` written. Synthesis QA re-verified (0 errors).
- 2026-10-20: Two independent audits; all six blocking findings fixed; final audit PASS.
- 2026-10-20: **P0** schemas, SQLite schema/triggers, DB layer, seeding, tests.
- 2026-10-20: **P1** series/parallel solver, XState player, primitives, Circuits lesson, Hono API, persistence, UI.
- 2026-10-20: **P2** balance engine, three generators, practice API/UI, five authored lessons wired, active balance course.
- 2026-10-20: **P3** theta/EMA mastery, FSRS review state, learner persistence, adaptive path planner, path/progress screens.
- 2026-10-20: **P4** tutor policy, verified local hint ladder, Anthropic/Ollama adapters, lesson/practice hint UI.
- 2026-10-20: **P5 custom-topic slice** graph proposal, critics, deterministic planner, API, UI, tests.
- 2026-10-20: **P5 custom-topic workflow** persisted revisions, editable graph, curator queue, re-critique, tests.
- 2026-10-21: **P5 breadth** Mechanics/statics + Optics + Chemical Kinetics + Balance + Circuits (≥4 live science domains, 11 generators, 11 lessons), Path Catalog UI (`#/paths`), Archive UI (`#/archive`), Settings UI (`#/settings`), 91 tests / 17 files passing, production build passing.
