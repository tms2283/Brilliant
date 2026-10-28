# CLAUDE.md — Noesis (BrilliantRebuild)

> Project-specific rules extending the global `~/.claude/CLAUDE.md`.
> Read this after `HANDOFF.md`, `MEMORY.md`, `MASTER_PLAN.md`, and `TODO.md`.

## What this project is

**Noesis** is a local, single-user, offline-first STEM learning app: an improved rebuild of Brilliant's core
learning loop, plus restored science breadth, knowledge-aware dynamic paths, and custom-topic path generation.

- **Strategic source of truth:** `MASTER_PLAN.md`.
- **Build spec:** `docs/synthesis/05-implementation-blueprint.md`.
- **Authoring source of truth for features:** `docs/synthesis/_source/features.py` → generated artifacts.
- **Evidence base:** `docs/research/01–07` (`01` direct observation; `02–07` adversarially verified, 72 checks; do not contradict without new evidence).

**Locked decisions:** D1 local web app first (Electron later) · D2 Claude primary + Ollama fallback ·
D3 dependency list approved · D4 Circuits + balance-equations course (working title) · D5 codename Noesis.

## Commands

Run from the project root (`X:\PROJECTS\BrilliantRebuild`).

| Task | Command |
|---|---|
| Rebuild synthesis artifacts + QA | `python -I tools/build_synthesis.py` |
| Convert research workflow journal | `python -I tools/journal_to_md.py <journal.jsonl> <out_dir>` |
| App dev (API + Vite) | `npm run dev` |
| Typecheck | `npm run typecheck` |
| Tests | `npm test` |
| Production client build | `npm run build` |
| Run local API without watch | `node_modules\.bin\tsx.cmd src/server/index.ts` |

Never hand-edit generated artifacts: `docs/synthesis/02-feature-matrix.md`, `02-feature-matrix.csv`,
`04-selection-schema.yaml`. Edit `_source/features.py`, then rebuild.

## Session protocol

1. Read `HANDOFF.md` → `MEMORY.md` → `MASTER_PLAN.md` → `TODO.md`.
2. Confirm the next task with the user before starting.
3. Work only within the current phase gate.
4. At session end, update `HANDOFF.md` and `TODO.md`; add lessons to `MEMORY.md`.
5. If a decision changes architecture, milestone boundaries, or an integrity rule: record it in
   `MASTER_PLAN.md` and `MEMORY.md` first.

## Non-negotiable project invariants

These are review gates; violating one is a bug, not a style preference.

1. **One graph.** Every lesson maps to concepts; every path is a plan over the concept graph.
2. **Append-only events.** Learner state is derived; never mutate history.
3. **Immutable, versioned content.** Accepted status only via evals + curator. Never silently delete content.
4. **Deterministic core.** Verdicts, mastery, scheduling, and planning never depend on an LLM.
5. **Tutor is advisory.** No verdict authority, no reveal before bottom-out, no unverified number, withdrawn in
   the check phase.
6. **Local-first.** The core loop performs zero network calls; cloud features are opt-in per use.
7. **Typed boundaries.** Zod schemas are the single source; every interaction primitive implements one contract.
8. **Accessibility by construction.** Keyboard-operable, screen-reader-labeled, non-color verdict cues.
9. **No Brilliant content, assets, names, or branding.** Mechanics only; all content fresh.
10. **Milestone closure.** A feature depends only on features in its own or an earlier milestone.

## Known AI failure modes for this project

| # | Failure mode | Guard |
|---|---|---|
| F1 | **Copying Brilliant.** Reproducing lesson text, diagrams, names, or branding from observation. | Write fresh content; use only mechanics and topic names. Flag any verbatim-looking text. |
| F2 | **Trusting generated content.** Treating an LLM-authored item as correct without running the eval gate. | No item is accepted without solver/CAS/simulation checks; quarantine failures. |
| F3 | **Hand-editing generated artifacts.** Patching the YAML/matrix instead of `features.py`. | Rebuild; QA must pass with 0 errors. |
| F4 | **Milestone leakage.** Adding a dependency on a later-phase feature. | Run the build script; it enforces closure. |
| F5 | **Elo drift.** Co-updating ability and item difficulty under adaptive selection. | Difficulty is fixed from solver traces; never live-updated. |
| F6 | **Answer leakage.** Tutor reveals the answer, is active in the check phase, or emits an unverified number. | Solver in context, CAS check every number, bottom-out-only reveal, check-phase mute. |
| F7 | **Scope creep.** Importing features from other products or building v2/v1.x work early. | Only Brilliant-derived, schema-selected features. Check the release field. |
| F8 | **Dependency drift.** Adding a library without approval or swapping the approved stack. | D3 is locked; new dependencies need explicit user approval. |
| F9 | **Hallucinated research.** Asserting product facts not present in `docs/research/` or `docs/synthesis/`. | Cite the file/ref; mark inference as inference; re-run the research prompt if needed. |
| F10 | **Non-determinism in the core.** Putting an LLM in verdicts, mastery, scheduling, or planning. | Those modules take event data and return deterministic results; test them without network. |
| F11 | **Schema drift.** Changing lesson/item/attempt shapes without versioning or migration. | Version every schema; migrate + snapshot; content is never destroyed. |
| F12 | **Retrofitting accessibility.** Leaving keyboard/SR/non-color cues until the end. | Requirements live in the primitive contract from P0/P1. |
| F13 | **Fabricated completion.** Claiming a phase is done without running its exit gate. | Report evidence (test output, QA result); otherwise say what remains. |

## Code standards (when code begins)

- TypeScript strict mode; no `any` at module boundaries; validate all external data with Zod.
- The lesson player is an explicit statechart; no implicit boolean state machines.
- Interaction primitives use Pointer Events and expose `render / getState / validate / reset /
  describeForTutor / highlightTargets`.
- Solvers and schedulers are pure and unit-tested against hand-computed cases.
- Every content item carries provenance, generator version, seed, and eval report.
- No comments unless they explain non-obvious intent; no dead code; no silent fallbacks.

## Scope boundaries

**In scope (core + v1):** 67 features per the selection schema.

**Explicitly out:** accounts/paywall, leagues, parent/educator dashboards, community voting, cross-device sync,
standards alignment, code editors/sandboxes (until the CS track), voice/character (until the text tutor is stable).

If a request falls outside this list, say so and propose a schema change rather than building it silently.
