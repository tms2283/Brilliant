# BUILD BLUEPRINT — Noesis

> Concrete build translation of `MASTER_PLAN.md` and `docs/synthesis/05-implementation-blueprint.md`.
> Status: P0–P4 complete; P5 custom-topic workflow complete (proposal, persistence, editing, curator queue). P5 breadth is not started. Deferred items are named.

## Build purpose

Deliver a local, deterministic learning engine that runs offline, proves every generated item before showing it, and
lets one learner progress through Circuits and balance-equations courses with an auditable attempt log.

## Build crux

**Keep the core loop a pure, testable pipeline:** content document → item materialization → primitive verdict → attempt
event → learner-state projection. If the player, solver, and scheduler stay pure and the database stays append-only,
the UI can change without touching correctness.

## Build concept

**A modular monolith with enforced layer direction and two sources of truth.**

```
Presentation (React)  ──> Application (player, path, tutor) ──> Domain (schemas, solvers, generators, learner model)
                                                                      │
Infrastructure (SQLite, HTTP, providers) ─────────────────────────────┘
```

- Domain has zero React, HTTP, or SQL imports.
- Presentation never computes correctness.
- SQLite stores content versions + append-only attempts; learner state is derived and cached.
- Zod schemas are the contract source; TypeScript types are inferred, never duplicated.

## ADRs

| # | Decision | Alternatives | Why |
|---|---|---|---|
| ADR-001 | Modular monolith: one Node process, one Vite app | microservices, separate content service | Single user, local-first; boundaries enforced by folder + lint review, not network |
| ADR-002 | Zod as contract source, `z.infer` types | hand-written interfaces + JSON Schema | One definition drives validation, TS types, and LLM structured output |
| ADR-003 | Hono local API + better-sqlite3 | browser-only IndexedDB; Fastify | Approved stack; SQL is inspectable; easy to test in memory |
| ADR-004 | Pure domain functions for solvers/scheduler | classes with state | Deterministic, trivially unit-testable, no hidden I/O |
| ADR-005 | Append-only `attempt` table; derive `concept_state` | mutate mastery in place | Auditable, resettable, supports replay |
| ADR-006 | Vitest + Testing Library; engine tests outnumber UI tests | E2E-first | Fast feedback; critical journeys get one smoke test |
| ADR-007 | Local deterministic tutor fallback; Claude/Ollama adapters behind one port | cloud-only tutor | Offline core, no answer leaks, testable without keys |
| ADR-008 | Course content is data + generator specs, not code | hand-authored lesson components | New lessons/domains are authoring, not engineering |

## Repository structure

```text
src/
  schemas/            Zod contracts: concept, lesson, primitive, item, attempt, path
  domain/
    circuits/         DC solver + circuit generators + evals
    balance/          linear-balance solver + generators + evals
    content/          generator registry, difficulty, misconception rules, materializer
    learner/          PFAE-Elo, EMA mastery, FSRS, scheduler, path planner
    tutor/            provider port, local tutor, verification, hint ladder
    topic/            custom-topic graph proposal, critics, deterministic planner
  db/                 SQLite connection, migrations, repositories
  server/             Hono routes, validation, error model
  app/                React shell: Home, Path, Player, Dashboard, Custom Topic
  ui/                 primitives: Toggle, ChoiceTiles, Slider, Balance, MathInput
  content/            course definitions + lesson documents (JSON/TS data)
tests/                engine, schema, db, API, and one UI smoke test
scripts/              seed + dev runner
data/                 local SQLite (gitignored)
```

## Contracts

- `LessonDoc`: id, version, title, conceptIds, learn items, check items, takeaway, generator spec for practice.
- `PrimitiveSpec` discriminated union: toggle / choice / slider / balance / math.
- `Item`: generator id+version, seed, primitive, answer, solution steps, difficulty, eval report, status.
- `AttemptEvent`: append-only; phase, response, correct, first attempt, hint level, revealed, duration.
- `ConceptState`: derived projection: theta, attempts, EMA, mastery, FSRS card, last seen.
- `PathPlan`: ordered nodes with lesson / review / warm-up / remediation reasons.

## Test strategy

| Layer | Tests |
|---|---|
| Schemas | one valid fixture per document type; rejection cases |
| Solvers | hand-computed series/parallel circuits; balance substitution; uniqueness |
| Generators | 100 seeded variants; every item passes eval; deterministic by seed |
| Player | every state transition; learn retry vs check one-shot; reveal gating |
| Learner | Elo/PFAE update, mastery thresholds, FSRS due dates, scheduler ordering |
| DB/API | in-memory SQLite; attempt insert is append-only; state projection updates |
| UI | one smoke test: Home → lesson → answer → feedback → path advances |

## Build sequence and gates

| Gate | Deliverable | Exit check | Status |
|---|---|---|---|
| P0 | schemas, SQLite migration, fixture, build tool | fixture validates; `npm test` green | Complete |
| P1 | DC solver, player machine, toggle/choice/slider, Circuits lesson | lesson playable; transitions + solver tests green | Complete |
| P2 | generators/evals, balance engine, math input, drag balance, 2 courses, path, log | 0 eval-failing items; ≥12 practice items; API tests green | Complete |
| P3 | learner model, FSRS, scheduler, dashboard | simulated learner in 75–85% band; review dates sane | Complete (model + dashboard + tests) |
| P4 | tutor port + local tutor + Claude/Ollama adapters | 0 answer leaks; 0 unverified numbers in tests | Complete |
| P5 | topic graph proposal + critics + planner + curator | invalid DAG rejected; valid topic yields path | Custom-topic workflow complete; breadth pending |

## Non-negotiables carried into code

1. Domain layer imports no React, Hono, or SQLite.
2. Verdicts, mastery, and scheduling never call an LLM.
3. Attempts are append-only; content versions are immutable.
4. Every generated item carries an eval report and is rejected on failure.
5. Tutor output is verified and never shown in the check phase.
6. Keyboard + screen-reader labels + non-color verdict cues on every primitive.
7. No Brilliant text, assets, names, or branding.
