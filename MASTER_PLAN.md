# MASTER PLAN — Noesis

> Strategic north star for a local, single-user, improved Brilliant.
> **Status:** conceptual architecture locked for P0; concrete module/interface/repo design deferred to
> `/MasterBuild`. Decisions D1–D5 answered (Session 2).
> **Authoring source of truth for features:** `docs/synthesis/_source/features.py`.
> **Generated machine-readable projection:** `docs/synthesis/04-selection-schema.yaml` (rebuild with
> `python -I tools/build_synthesis.py`). On conflict, `features.py` + rebuild wins.
> **Build spec:** `docs/synthesis/05-implementation-blueprint.md`.
> **Codename:** Noesis (Greek *noēsis*: understanding, insight). No Brilliant branding.

---

## 1. Design purpose

**Noesis exists so one person can learn any STEM subject by doing — with a curriculum that adapts to what they actually know, content that passes automated correctness gates before a learner sees it, and no network, paywall, or account standing between them and the next problem.**

It is not a course library with a player attached. It is a learning engine that can grow new domains without hand-building every lesson.

## 2. The crux

> **How do we make breadth, adaptivity, and custom topics affordable for a single developer without letting generated content become "almost right" — which is worse than no content at all?**

Every major decision below resolves one half of that tension:

- Breadth is cheap only if content is **generated against a shared model**, not hand-authored per course.
- Adaptivity is cheap only if the learner model and scheduler are **deterministic projections** of an event log, not bespoke per-course logic.
- Custom topics are cheap only if a topic is a **graph proposal** that can be validated, edited, and planned — not a new app.
- Correctness is affordable only if **every generated item passes an automated gate before a learner ever sees it**.

## 3. Master concept — The Living Curriculum Graph

**One typed concept graph is the curriculum. Lessons, paths, review queues, tutor context, and progress views are all projections of that graph and the append-only attempt log.**

```
                         ┌──────────────────────────────┐
                         │      CONCEPT GRAPH           │
                         │  concepts · typed edges      │
                         │  provenance · confidence     │
                         └──────────────┬───────────────┘
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        │                               │                               │
   CONTENT FACTORY                 PATH PLANNER                  TUTOR CONTEXT
   generators → items              plan over graph               lesson + graph slice
   evals → accepted                scheduler → next task         verified explanation
        │                               │                               │
        └───────────────────────────────┼───────────────────────────────┘
                                        │
                                 LESSON PLAYER
                              attempts (append-only)
                                        │
                                 LEARNER MODEL
                              mastery · FSRS · next review
```

The graph is the **single source of truth for structure**. The event log is the **single source of truth for what happened**. Everything else is derived. If a feature cannot be expressed as a read or write against those two, it does not belong in the core.

**Why this is the right concept:**

- It resolves the crux without adding a second system for each new capability.
- It makes the three differentiators (breadth, dynamic paths, custom topics) the *same* mechanism at different levels of ambition.
- It gives correctness one chokepoint: content enters the graph only after evaluation.
- It survives growth: a new domain is a graph slice + generator pack, not a rewrite.

## 4. Product thesis

Reproduce Brilliant's proven core loop, then close the three gaps Brilliant does not address at the scope Noesis targets.

**Core loop to reproduce:**

> interactive manipulative → consequence feedback → scaffolded learn phase → clean check phase → practice/review

**The three improvements:**

1. **Restored STEM breadth.** Shared simulators and generators make a new domain an authoring cost, not a hand-built-course cost. Target ≥ 4 science domains by v1.
2. **Knowledge-aware dynamic paths.** A per-concept learner model, concept-level FSRS, and a deterministic scheduler re-render the path per learner: skip mastered lessons, insert warm-ups, remediation, and reviews.
3. **Custom-topic paths.** Ask for any STEM topic; get an editable, externally validated concept graph, a planned path, and generated lessons that pass the same eval gate as built-in content.

**Supporting improvements:** local-first/offline, open learner model, multi-depth explanations, accessibility by construction, content that is never silently retired.

## 5. Non-goals

- **Not** a multi-user platform. No accounts, leagues, parent/educator dashboards, or community features.
- **Not** a copy of Brilliant's content, assets, names, or branding. Mechanics only; all content freshly written or generated.
- **Not** a general-purpose LMS. No standards alignment, rosters, or grading workflows in v1.
- **Not** a coding platform in v1. Token-slot code and sandboxes are promoted only when the CS track begins.
- **Not** cloud-dependent. The core loop must work with the network unplugged.
- **Not** feature parity for its own sake. Every retained feature must earn its place against the graph-and-log architecture.

## 6. Conceptual architecture

Six domains. Each has one responsibility; dependencies point downward. Concrete modules, interfaces, and repo layout belong to `/MasterBuild`.

### 6.1 Experience Surface

**Responsibility:** render the graph and content, capture intent and attempts.

- Home (resume, next-best task, “what do you want to learn?”).
- Path view (lesson / practice / review / check / inserted nodes).
- Lesson player (learn phase, check phase, feedback, celebration chain).
- Open learner model (mastery with uncertainty, next review, test-out).
- Custom-topic graph editor (propose → inspect → edit → accept).
- Dashboard and settings.

**Rule:** the surface never computes correctness, mastery, or scheduling. It sends intent/attempts and renders derived state.

### 6.2 Curriculum Core

**Responsibility:** define what can be learned and how it is structured.

- Concept graph: concepts, typed edges (`prerequisite`, `encompasses(w)`, `confusable`), provenance, confidence.
- Course → level → lesson hierarchy; ordered nodes; lesson status and version.
- Lesson document (typed JSON): learn/check segments, primitive configs, concept/takeaway cards, feedback rules.
- Lesson-to-concept map (`introduces`, `practices`).

**Rule:** every lesson must map to at least one concept; every path node must resolve to a lesson or a scheduling action.

### 6.3 Content Factory

**Responsibility:** produce candidate content and prove it correct before publication.

- Simulator library (DC circuits, balance/statics first; optics, kinetics, mechanics later).
- Parameterized generators + variation + misconception distractors.
- Answer/expectations checker and solver-trace difficulty.
- Automated evals: solvability, uniqueness, answer agreement, unit sanity, constraint satisfaction, back-translation.
- Golden example library and regression set.
- Curator review queue; accepted items only.

**Rule:** LLM output is a *candidate*, never content. Nothing reaches a learner without passing the gate. Deterministic generators ship before LLM configuration generation.

### 6.4 Learner Intelligence

**Responsibility:** turn events into decisions.

- Attempt event log (append-only) → knowledge state (per-concept ability + mastery + memory).
- FSRS review scheduling with credit propagation through `encompasses` edges.
- Next-best-task scheduler (outer fringe ∪ due reviews; target 75–85% predicted success).
- Path planner and dynamic insertion (warm-up, remediation, review).
- Placement diagnostic and level test-out.
- All deterministic. No LLM in the hot path.

**Rule:** state is derived, never hand-edited. The learner can inspect and correct the model, but corrections are events, not mutations of history.

### 6.5 Tutor

**Responsibility:** help without giving away the answer or becoming a second source of truth.

- Provider adapter (Claude primary, Ollama fallback) behind one interface.
- Tool calls on lesson state: highlight, annotate, point at a primitive.
- Socratic hint ladder, fading policy, mute/verdict separation.
- Math verification of every number the tutor emits; solver solution in context.
- Multi-depth explanations.

**Rule:** the tutor is advisory. It cannot issue a verdict, cannot reveal before bottom-out, is withdrawn during the check phase, and cannot emit an unverified number.

### 6.6 Local Platform

**Responsibility:** make the whole thing ownable, offline, and durable.

- SQLite (local Node backend) for content, events, state, settings.
- Content store with immutable versions and archive; snapshots for reversible resets.
- OS keychain for provider keys; no telemetry.
- Accessibility baseline baked into the primitive contract.
- Offline-first asset and model strategy.

**Rule:** the core loop performs zero network calls. Cloud features are opt-in per use and send lesson context only.

### 6.7 Primary flows

**Learning flow**

```
Home → next-best task → lesson (learn: act → consequence → card → escalate)
     → check (one shot per item) → verdict → celebration → updated learner state
```

**Authoring flow**

```
generator / LLM proposal → candidate item → eval gate → curator queue
     → accepted item → versioned content store → eligible for lessons
```

**Review flow**

```
event log → concept state → FSRS due set ∪ outer fringe → scheduler
     → warm-up / review / remediation insertion → path re-render
```

**Custom-topic flow**

```
user topic → LLM graph proposal (sources + confidence) → external critics
     (DAG, textbook order, coverage) → user edits → deterministic planner
     → generated lessons → eval gate → curator queue → path
```

**Tutor flow**

```
lesson state + solver solution + tutor notes → provider adapter
     → verified text + tool calls → canvas overlay (learn phase only)
```

## 7. Integrity rules (non-negotiable)

| # | Rule | Why it matters |
|---|---|---|
| I1 | **One graph.** Every lesson maps to concepts; every path is a plan over the graph. | Prevents a second, drifting curriculum model. |
| I2 | **Events are append-only.** Learner state is derived. | Makes adaptivity auditable and resettable. |
| I3 | **Content is immutable and versioned.** Accepted status only via evals + curator. | Prevents silent retirement and untested content. |
| I4 | **The core is deterministic.** Verdicts, mastery, scheduling, and planning never depend on an LLM. | Keeps the loop correct, offline, and testable. |
| I5 | **The tutor is advisory and verified.** No verdict authority, no early reveal, no unverified numbers. | Answer leaks and math errors destroy trust fastest. |
| I6 | **Local-first.** Core loop works offline; cloud is opt-in per feature. | The product's ownership promise. |
| I7 | **Typed boundaries.** Zod schemas are the single source; every primitive implements one contract. | Makes generation, evals, and tutoring possible. |
| I8 | **Accessibility by construction.** Keyboard-operable, screen-reader-labeled, non-color verdict cues. | Cannot be retrofitted cheaply. |
| I9 | **No Brilliant content or branding.** Mechanics only; fresh content. | Legal and ethical bottom line. |
| I10 | **Milestone closure.** A feature may depend only on features in its own or an earlier milestone. | Keeps every phase runnable. |

The build script enforces I10 plus structural QA (duplicate names, dangling dependencies, cycles, rationale/merge/state-release consistency, and score-note presence); I1–I9 remain review gates.

## 8. Learning engine defaults

These are **tunable defaults, not proven optima**. Tune on simulated learners before real use.

| Component | Default |
|---|---|
| Ability per concept | PFAE-Elo θ; P = g + (1−g)·σ(θ−d), g = 1/k for k-option MC; step U(n) = a/(1+b·n), a=1, b=0.05 |
| Item difficulty | Fixed from solver-trace radicals; never co-updated live (avoids Elo drift under adaptive selection) |
| Mastery | Provisional when EMA (α≈0.9) ≥ 0.85, ≥ 3 correct across ≥ 2 variants, last answer correct without bottom-out hint. Mastered after a spaced retrieval ≥ 1 day later |
| Memory | One ts-fsrs card per concept; retention 0.9; default weights. Again = wrong or bottom-out; Hard = correct after hints; Good = correct unaided; Easy = fast, unaided, first variant |
| Credit propagation | FIRe-style: success sends w·(1−R) credit down encompassing edges; failure sends a small θ penalty upward |
| Scheduler | Candidates = outer fringe ∪ due reviews (R < 0.9). Score = 0.4·urgency + 0.25·compression + 0.25·goal relevance + 0.1·interleave − recency. Choose items at 75–85% predicted success |
| Gating | Soft only. Test-out through a level check using the same mastery rule |

## 9. Data model (conceptual)

| Entity | Role |
|---|---|
| `Concept`, `ConceptEdge` | The curriculum graph, with provenance and confidence |
| `Course`, `Level`, `Lesson` | Structure and typed lesson documents, versioned |
| `LessonConceptMap` | What each lesson introduces/practices |
| `Generator`, `Item` | Content factory output, candidate → accepted/quarantined |
| `Attempt` | Append-only event log (learn/check/practice/review/placement) |
| `ConceptState` | Derived ability, mastery, FSRS card, last seen |
| `PathPlan` | Ordered nodes with inserted-reason and generation time |
| `TutorSession`, `TutorTurn` | Tutor context, tool calls, verification results |
| `Flag` | Learner-reported problems feeding quarantine |
| `Settings` | Local preferences; provider keys in OS keychain, never the DB |

See blueprint §5 for fields and persistence/privacy rules.

## 10. Roadmap

Each phase ends with a runnable system and a hard exit gate. No phase starts before its gate passes.

| Phase | Deliverable | Exit gate |
|---|---|---|
| **P0 Foundations** | Repo, project docs, Zod schemas (lesson doc, primitive contract, item, attempt), SQLite schema, synthesis build tool | Schemas compile; one hand-written lesson validates |
| **P1 Player + first simulator** | Lesson player statechart; toggle/choice/slider primitives; DC circuit solver; one hand-authored Circuits lesson end-to-end | Full lesson runs offline; every state transition tested; solver matches hand-computed results |
| **P2 Content engine** | Generator framework, variation, evals, difficulty, misconception rules, math input + checker, drag/balance primitive; Circuits + balance-equations course (working title; Brilliant's observed course is Solving Equations); practice sets; path UI; event log | 0 eval-failing items shown; target 12–17 items/lesson with a release floor of ≥ 12; variants pass uniqueness + solver checks |
| **P3 Adaptive engine** | Knowledge model, FSRS, scheduler, dynamic insertion, interleaved practice, warm-ups, remediation, placement, level review/check, open learner model, streak/XP/celebration/focus, dashboard | Simulated learners land in the 75–85% band; mastered lessons skipped; reviews surface on schedule |
| **P4 AI tutor + routing** | Provider adapter (Claude + Ollama), tutor tools (highlight/annotate), hint ladder, fading policy, mute/verdict channel, math verification, multi-depth explanations, Ask-to-route | 0 answer leaks before bottom-out; 0 unverified numbers; works offline with a local model |
| **P5 Custom topics + breadth** | LLM graph proposal with critics, editable graph UI, deterministic planner, LLM config generation, curator queue; learning path catalog; archive UI; draggable-graph-point + ordering/sorting primitives; mechanics/statics, optics, chemistry-kinetics simulators | Requested topic yields a valid DAG, planned path, eval-passing lessons; ≥ 4 science domains live; `content_versioning_and_archive` complete |
| **P6 v1.x** | Daily problem, coverage audit, voice, character, reference notes, token-slot code + Pyodide, reminders, resets, typed lesson modes, adaptive lesson shape, personal-best weeks, weekly summary narrative, missed-problem bookmarks | Each promoted feature meets its promotion condition in the schema |

**Milestone content:** core = 34 features; v1 = 33; v1.x = 14 (deferred); v2 = 5 (deferred); 4 dropped.
The authoritative per-feature milestone lists are blueprint §1 and `04-selection-schema.yaml`; this table is phase-level.
**Critical path:** P0 → P1 → P2 → P3 → P4 → P5. P2 and P3 are the schedule risk; P4 depends on a stable lesson state and solver.
**P6 sequencing:** the promotions are *triggered* by capabilities from P2/P4 but are *sequenced* after P5 (blueprint §8).

## 11. Dependency map (milestone level)

```
P0 schemas + docs
   └─> P1 player + DC solver
          └─> P2 generators + evals + math/balance + 2 courses
                 └─> P3 learner model + FSRS + scheduler + path insertion
                        └─> P4 tutor + provider adapter + verification
                               └─> P5 custom topics + breadth (≥4 domains)
                                      └─> P6 v1.x promotions (daily problem needs 2+ live
                                             generator domains; voice needs a stable text tutor;
                                             code needs the CS track)
```

**Feature-level dependency closure is machine-checked** in `04-selection-schema.yaml` (`dependencies`, `build_layer`). Do not add a dependency that points to a later milestone; the build script will fail.

**Key chains inside core** (`A → B` means B depends on A, matching the schema):

- `interaction_primitive_contract` → `lesson_player_state_machine` → `lesson_learn_phase` → `lesson_check_phase`
- `lesson_player_state_machine` → `attempt_event_log`; `lesson_check_phase` + `attempt_event_log` → `assessment_only_measurement`
- `interaction_primitive_contract` + `simulation_primitive_library` → `simulated_component_toggle` → `consequence_simulation_feedback`
- `interaction_primitive_contract` + `answer_expectations_checker` → `structured_math_input`
- `lesson_document_format` → `concept_skill_graph` and `course_level_lesson_hierarchy` (independent children)
- `course_level_lesson_hierarchy` → `path_node_visualization`
- `parameterized_puzzle_generators` → `variation_generator`; `variation_generator` → `lesson_check_phase` and `lesson_practice_set`

## 12. Risk register

| # | Risk | Sev | Like | Mitigation |
|---|---|---|---|---|
| R1 | Generated items wrong/unsolvable (“almost right is catastrophic”) | H | H | Deterministic generators first; CAS + solver + simulation evals; uniqueness solver; quarantine; golden regression set |
| R2 | LLM-proposed prerequisite graphs wrong (invisible to LLM judges) | H | H | External critics (DAG, textbook order, coverage); user-editable graph; data-driven edge revision; deterministic planner |
| R3 | Scope explosion across STEM domains | H | H | Core = 2 domains; one new simulator family per milestone, except P5's explicit breadth bundle (mechanics/statics, optics, chemistry-kinetics); a domain ships only when its generators pass evals |
| R4 | Tutor gives away answers or makes math errors | H | M | Solver solution in context; CAS check of every number; bottom-out-only reveal; withdrawn in check phase; transcript eval set |
| R5 | Learner-model miscalibration for one user | M | M | Simple models; open learner model with correction; tune thresholds on simulated learners |
| R6 | Heavy WASM (Pyodide, RDKit, ngspice) bloats/slows the app | M | M | Defer to v1.x; lazy-load in Web Workers; curated Pyodide subset; Compute Engine for the hot path |
| R7 | Drag interactions fragile on touch/browsers | M | M | Pointer Events, visible handles, keyboard alternatives, test matrix |
| R8 | Copyright: reproducing Brilliant content/branding | H | L | Mechanics only; all content fresh; no Brilliant names/assets; topic names only from archives |
| R9 | Cloud LLM cost/availability | M | M | Provider adapter with local fallback; cache accepted generations; generation is authoring-time |
| R10 | Open-textbook licensing (OpenStax CC BY-NC-SA) | M | M | Personal-local use; store attribution; never redistribute excerpts |
| R11 | Solo-maintainer bus factor / plan drift | M | M | This document + HANDOFF/MEMORY; hard phase gates; tests as the contract |
| R12 | Authoring bottleneck persists despite generators | M | M | Golden examples; per-domain generator templates; measure items-per-hour at P2 |
| R13 | Schema churn breaks stored content | M | M | Version every schema; migrations + snapshots; content never deleted |
| R14 | Evals give false confidence | M | M | Golden set + human spot checks + learner flags feed quarantine; track eval escape rate |
| R15 | Accessibility regressions | M | M | Contract-level requirements; automated checks in P1/P2; manual keyboard/SR matrix each phase |

## 13. Decisions (locked)

| # | Decision | Choice | Consequence |
|---|---|---|---|
| D1 | Form factor | **Local web app first** (Node backend + browser); Electron wrapper later | Fast iteration now; consistent Chromium/WASM only when wrapped |
| D2 | LLM provider | **Claude API primary + Ollama fallback** | Best quality online; degraded but functional offline; key + usage cost |
| D3 | Dependencies | **Approved as proposed** in blueprint §3 | Stack is fixed for P0; changes require a decision record |
| D4 | First domains | **Circuits + balance-equations course** (working title; Brilliant's observed course is *Solving Equations*) | Two proven manipulatives; science + math; engine showcase |
| D5 | Codename | **Noesis** | No Brilliant branding; folder stays `BrilliantRebuild` |

**D3 approved set (summary):** TypeScript, React, Vite, SVG, XState, Zod, KaTeX + mhchem, MathLive, Cortex Compute Engine (SymPy/Pyodide fallback later), math.js, ts-fsrs, SQLite/better-sqlite3, Hono or Fastify, Electron later.
**Avoid:** GeoGebra (NC), PhET post-2026 (CC BY-NC), CircuitJS embedded (GPL), tldraw (license key), Monaco (mobile), Rive authoring (paid), Piper (GPL).

## 14. Open questions and spikes

| # | Question | When | Owner |
|---|---|---|---|
| Q1 | How reliable is Compute Engine `isIdenticallyEqual` on our target expressions? | P2 spike | Content engine |
| Q2 | What is the minimum viable Pyodide subset (size/startup)? | P2/P6 spike | Content engine |
| Q3 | What is the Level Check format (item count, pass rule)? | P3 design | Learner intelligence |
| Q4 | Koji's exact tool schema is not publicly documented; only high-level descriptions of its tool behavior are available. What tool surface do we need? | P4 design | Tutor |
| Q5 | How reliable is schema-constrained output from Ollama models? | P4 spike | Tutor |
| Q6 | Which drag/pointer test matrix is sufficient across browsers and touch? | P1 design | Experience surface |
| Q7 | How many items per hour can a generator pack produce at eval-passing quality? | P2 measurement | Content factory |
| Q8 | Does FIRe credit propagation improve outcomes on simulated learners vs flat review? | P3 experiment | Learner intelligence |

## 15. Success criteria

**Learning**
- Scheduled items land in the 75–85% predicted-success band on simulated learners.
- Mastered concepts are skipped on the path; due reviews surface on time.
- A learner can test out of known material and see why.

**Content**
- Zero eval-failing items shown (target; measured per release).
- Target 12–17 generator-backed exercises per lesson in core courses; release floor ≥ 12.
- ≥ 4 science domains live by end of P5.
- Generated variants pass uniqueness and solver agreement checks.

**Product**
- First lesson reachable in under 2 minutes from first launch.
- Core loop works with the network unplugged.
- No account required; no telemetry; keys in OS keychain.

**Tutor**
- Zero answer leaks before bottom-out in the eval set.
- Zero unverified numbers in tutor output.
- Works offline with a local model at degraded quality.

**Accessibility**
- Every primitive keyboard-operable and screen-reader-labeled.
- Verdicts conveyed without color alone.
- Manual keyboard/SR matrix passes each phase.

## 16. Technical Debt log

Debt is logged, not silently fixed (global rule P6). Each item names the trigger that forces repayment.

| # | Debt | Incurred | Repay trigger |
|---|---|---|---|
| TD1 | Cortex Compute Engine may return `undefined`; SymPy/Pyodide fallback deferred to v1.x | P0/P2 | > 2% undefined on core item checks, or any learner-visible wrong verdict |
| TD2 | Hand-written DC solver; ngspice cross-check deferred | P1 | P5 breadth work, or any solver mismatch report |
| TD3 | Browser-only until Electron wrapper; WASM behavior varies by browser | P0 | When Pyodide/RDKit/ngspice enter the core loop |
| TD4 | No cross-device sync or accounts | P0 | v2 promotion, or explicit user request |
| TD5 | Content archive has storage/versioning but no archive UI | P2 | P5 |
| TD6 | No voice or tutor character | P4 | After text tutor stability |
| TD7 | FSRS is per concept, not per item | P3 | If review calibration misses the retention target |
| TD8 | LLM config generation ships after deterministic generators | P5 | P5, by design |
| TD9 | Research gaps: `user_voice` and completeness critic never run | Session 1 | Before P4 tutor design; re-run the prompt |
| TD10 | No standards alignment | — | v2 |
| TD11 | No item-level difficulty recalibration from live data (deliberate, avoids Elo drift) | P2 | Revisit only with a held-out calibration design |
| TD12 | Celebration chain and XP are cosmetic, not pedagogically validated | P3 | If they crowd out learning time or feel coercive |
| TD13 | Custom-topic proposals now persist, revise, and re-critique; the remaining limitation is that proposals only draw from the authored catalog, not generated domain content | P5 | P5 breadth work |
| TD14 | Main client bundle is ~1.24 MB (~360 kB gzip) because KaTeX/mathjs load eagerly | P5 | Before packaging or when first-load time becomes a measured problem |

## 17. Builder Handoff Brief

**Core intent.** Noesis must feel like a calm, fast, private tutor that always has the next right problem ready. The learner should never wonder what to do next, never see a wrong answer declared correct, and never lose progress to a paywall or a retired course.

**Non-negotiables**
1. The concept graph + append-only event log are the only sources of truth.
2. No content reaches a learner without passing the eval gate.
3. The core loop is deterministic, offline, and account-free.
4. The tutor is advisory, verified, and never issues verdicts.
5. Content is versioned and never silently deleted.
6. All primitives satisfy one accessibility-bearing contract.
7. No Brilliant content, names, or branding.

**Flexible zones**
- Repo layout, module boundaries, and interface signatures (Builder’s call).
- Exact SQLite table shapes, indexes, and migration mechanics.
- Whether the local server is Hono or Fastify; both are approved.
- Lesson document field names, provided the semantics and versioning hold.
- Visual design system, provided accessibility and non-color verdict cues hold.
- Electron timing, provided the browser build stays first-class.

**Known tensions**
- *Breadth vs correctness:* resolved by making every domain pay the same generator + eval cost; no domain ships on hand-authored content alone.
- *Adaptivity vs determinism:* resolved by deriving all decisions from the event log; no LLM in scheduling.
- *Tutor helpfulness vs answer leakage:* resolved by bottom-out-only reveal and check-phase withdrawal.
- *Local-first vs rich AI:* resolved by an adapter; cloud is an enhancement, not a dependency.
- *Feature ambition vs solo maintenance:* resolved by hard phase gates and explicit non-goals.

**Critical user journeys**
1. First launch → pick domain → placement → first lesson in < 2 minutes.
2. Learn phase → wrong answer → consequence → misconception hint → retry → succeed.
3. Check phase → one shot → verdict → celebration → path advances.
4. Return visit → warm-up/review inserted → mastered lessons skipped.
5. Custom topic → draft graph → edit → planned path → generated lessons.
6. Ask for help → verified hint → no answer leak → continue.

**Failure sensitivities**
- A single wrong verdict destroys trust faster than a missing feature.
- A tutor that reveals answers or miscalculates is worse than no tutor.
- A path that ignores mastery feels like a generic course library.
- A drag interaction that fails on touch blocks entire lessons.
- Silent content retirement or data loss breaks the ownership promise.

**Open questions for the Builder**
- Q1–Q8 above. Resolve with spikes at the named phase; do not guess silently.

**Decision notes**
- D1 web-first keeps iteration speed while preserving a clean Electron path.
- D2 Claude + Ollama gives quality online and a real offline story.
- D3 locks the stack so P0 can start; changes need a record.
- D4 two domains prove the engine on both a science simulator and a math manipulative.
- D5 Noesis is short, pronounceable, and semantically aligned (understanding), with no Brilliant association.

## 18. Document map

| Document | Role |
|---|---|
| `MASTER_PLAN.md` | This document: strategy, architecture, roadmap, risks, debt |
| `HANDOFF.md` | Current state and next action |
| `TODO.md` | Prioritized queue with definitions of done |
| `MEMORY.md` | Lessons learned; read at session start |
| `CLAUDE.md` | Project rules and known AI failure modes |
| `docs/synthesis/05-implementation-blueprint.md` | Build spec (features, stack, UX, data, risks, phases) |
| `docs/synthesis/04-selection-schema.yaml` | Machine-checked feature decisions |
| `docs/research/01–07` | Evidence base: `01` direct observation; `02–07` adversarially verified (72 checks) |

**Change control.** Changes to the concept graph schema, milestone boundaries, or integrity rules require an entry here and in `MEMORY.md`. Changes to feature state go through `features.py` + rebuild, never by hand-editing generated artifacts.
