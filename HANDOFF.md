# HANDOFF — Noesis (BrilliantRebuild)

> Current state. Updated at every session end.

## Last updated
2026-10-21. P0–P5 complete and verified: **P5 breadth complete** (≥4 live science domains + math, 11 generators, 11 authored lessons, Path Catalog UI, Content Archive UI, Settings UI, and full nav integration).

## Goal
A local, single-user, offline-first interactive STEM learning app: deterministic manipulative → feedback → explanation → check → practice/review loops, knowledge-aware paths, verified tutoring, and custom-topic paths. Mechanics and visual language are inspired by Brilliant; no Brilliant text, assets, names, or branding.

## Locked decisions
| # | Decision |
|---|---|
| D1 | Local web app first (React + Hono + SQLite); Electron wrapper later |
| D2 | Claude primary; Ollama offline fallback; deterministic local tutor fallback |
| D3 | Approved dependency list only; no new dependencies without approval |
| D4 | STEM breadth: Circuits + Balance + Mechanics + Optics + Chemical Kinetics (≥4 live science domains) |
| D5 | Codename **Noesis** (folder remains `BrilliantRebuild`) |

## Current state
- **Courses & Breadth (≥4 Live Science Domains + Math):**
  1. *Circuits* (Science 1): 3 lessons (`circuits-01`, `02`, `03`), DC circuit solver, toggle/choice primitives.
  2. *Mechanics / Statics* (Science 2): 2 lessons (`mechanics-01`, `02`), statics torque solver, interactive `LeverView` primitive.
  3. *Optics* (Science 3): 2 lessons (`optics-01`, `02`), Snell's law ray solver, interactive SVG ray `OpticsView` primitive.
  4. *Chemical Kinetics* (Science 4): 2 lessons (`chemistry-01`, `02`), reaction rate solver, molecular collision chamber `KineticsView` primitive.
  5. *Balance Equations* (Math): 2 lessons (`balance-01`, `02`), balance engine, scale `BalanceView` primitive.
  11 lessons total, all seeded and playable.
- **Content graph:** 12 concepts across 5 domains, 8 typed prerequisite/encompasses edges.
- **Generators:** 11 deterministic generators in `src/domain/content/registry.ts`. 100 seeds tested per generator (1,100 items), 100% eval pass rate, zero eval-failing items exposed.
- **Learner:** theta + EMA + attempt count, mastery gate (`nAttempts >= 3`, `ema >= 0.55`, `theta >= 0.6`), per-concept FSRS cards, due-review projection.
- **Paths:** due reviews → weak-concept remediation → next lesson → practice. `GET /api/path/:courseId`.
- **Tutor:** policy limits learning/practice to hints; checks/reviews return `403`; hint ladder 1–3; numeric and answer-leak verification; Anthropic/Ollama adapters; deterministic fallback.
- **Custom topics:** authored-catalog graph proposal, DAG/coverage critics across all 5 domains, deterministic topological planner, curator status. Proposals persist in `topic_proposal` with revisions; nodes/edges editable. `POST /api/topics/propose`, `GET /api/topics`, `GET/PUT /api/topics/:id`. Unsupported topics return `422`.
- **UI screens & routes:**
  - `#/`: Home course dashboard
  - `#/paths`: STEM Tracks Catalog (Physics, Chemistry, Math tracks with progress and direct continuation)
  - `#/path/:courseId`: Adaptive course path
  - `#/progress`: Learner progress & concept mastery
  - `#/custom`: Custom topic generator
  - `#/custom/:id`: Proposal editor
  - `#/curator`: Curator queue
  - `#/archive`: Content versioning, immutable shelf, changelog, playable historical lessons, JSON attempt export
  - `#/settings`: Tutor provider preferences (Claude/Ollama/Deterministic), live connection test, accessibility toggles
  - `#/lesson/:lessonId`: Interactive player
  - `#/practice/:generatorId?count=N`: Focused practice session
- **Persistence:** SQLite at `data/noesis.db`; attempts append-only via triggers and idempotent by ID.

## Verification (latest)
- `npm run typecheck` — passed cleanly (0 errors).
- `npm test` — **91 tests / 17 files passed**, covering all 5 domains, generators, player, schemas, DB, learner, path, tutor, topic, server, and UI screens.
- `npm run build` — passed (`tsc --noEmit && vite build`), `dist` current.
- Server running on port 8787 via `tsx`.

## Commands
```powershell
npm run dev        # Hono 8787 + Vite 5173 with /api proxy
npm run typecheck  # tsc --noEmit
npm test           # vitest run
npm run build      # tsc --noEmit && vite build
node_modules\.bin\tsx.cmd src/server/index.ts   # production-style local server, no watch
```

## Important environment notes
- Node v25.8.0, npm 11.11.0, PowerShell 5.1, Windows.
- `ls -la` fails; use `Get-ChildItem`.
- PowerShell/Chrome output capture can mangle `Ω`, `×`, `²`, `→`; source/API bytes are valid UTF-8.
- `@testing-library/user-event` is not installed; use `fireEvent`.
- React async hint fetches must be awaited in tests with `findBy*` to avoid `act(...)` warnings.
- `data/` contains the DB, screenshots, and server logs.

## P5 Status: COMPLETE
All P5 gates met:
1. ≥4 live science domains (Circuits, Mechanics, Optics, Chemistry) + Balance math.
2. 11 pure solver/eval backed generators with 100% pass rate.
3. Path Catalog screen (`#/paths`), Archive screen (`#/archive`), and Settings screen (`#/settings`) fully implemented and styled.
4. Custom topic proposer routes and DAG critics support all 5 domains with strict 422 rejection on unsupported topics.

## Next Phase: P6
- Daily problem, coverage audit, voice/character, reference notes, code slots + Pyodide, reminders/resets, typed lesson modes, adaptive lesson shape, personal-best weeks, weekly narrative, missed-problem bookmarks. Promote only when each feature meets its schema promotion condition.
