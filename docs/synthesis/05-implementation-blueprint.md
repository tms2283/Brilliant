# Merged implementation blueprint (Artifact 5)

> Build spec for a local, single-user, improved Brilliant. Authoring source of truth for feature states:
> `docs/synthesis/_source/features.py`; `04-selection-schema.yaml` is the generated machine-readable projection.
> Rebuild with `python -I tools/build_synthesis.py`.
>
> **Status:** D1–D5 approved 2026-10-20; the stack below is locked for P0. Every library named here was a proposal
> subject to global rule G3 (no new dependencies without approval). Changes require a decision record.

**Product thesis** `recommended`: reproduce Brilliant's core loop:
- **interactive manipulative** → **consequence feedback** → **scaffolded learn phase** → **clean check phase** →
  **practice/review**.

Then close the three gaps Brilliant does not address at the scope Noesis targets:
1. **Breadth:** restore the sciences through generator + simulator + eval content.
2. **Knowledge-aware dynamic paths:** a per-concept learner model, FSRS review, and a deterministic scheduler.
3. **Custom topics:** LLM-proposed concept graphs, externally validated and deterministically planned.

All of it runs locally, offline-first, with no paywall.

---

## 1. Feature set by milestone

### Core (first runnable app: deterministic learning loop, no LLM required). 34 features.

- **Spine:**
  - `interaction_primitive_contract`
  - `lesson_document_format`
  - `lesson_player_state_machine`
  - `attempt_event_log`
  - `local_first_offline`
  - `accessibility_baseline` (baked into the contract)
- **Lesson:**
  - `lesson_learn_phase`
  - `lesson_check_phase`
  - `action_first_sequencing`
  - `escalating_configuration_sequence`
  - `concept_and_takeaway_cards`
  - `retry_and_reveal_controls`
  - `immediate_verdict_feedback`
  - `consequence_simulation_feedback`
  - `misconception_targeted_hints`
  - `report_problem_quarantine`
- **Primitives:**
  - `simulated_component_toggle`
  - `choice_tiles`
  - `structured_math_input`
  - `drag_manipulatives`
  - `parameter_slider`
- **Content engine:**
  - `parameterized_puzzle_generators`
  - `variation_generator`
  - `automated_puzzle_evals`
  - `answer_expectations_checker`
  - `difficulty_from_solver_trace`
  - `misconception_distractors`
  - `golden_example_library`
  - `simulation_primitive_library` (DC circuits + balance/statics)
- **Structure:**
  - `concept_skill_graph` (hand-authored for 2 domains)
  - `course_level_lesson_hierarchy`
  - `path_node_visualization`
  - `lesson_practice_set`
  - `assessment_only_measurement`

**Core content target:**
- Two complete courses that showcase the engine on Brilliant's two strongest proven manipulatives: **Circuits**
  (science) and a **balance-equations course** (math; working title — Brilliant's observed course is *Solving
  Equations*).
- Every lesson must meet 12–17 generator-backed exercises per lesson.
- All content is freshly written. Nothing is copied from Brilliant.

### v1 (completes the first full release). 33 features.

- **Adaptivity:**
  - `knowledge_state_model`
  - `spaced_review_scheduler`
  - `next_best_task_scheduler`
  - `dynamic_path_insertion`
  - `warm_up_retrieval`
  - `remediation_branching`
  - `interleaved_practice`
  - `level_review_set`
  - `level_check_test_out`
  - `adaptive_placement_diagnostic`
  - `open_learner_model`
- **AI:**
  - `llm_provider_adapter`
  - `ai_tutor_core`
  - `socratic_hint_ladder`
  - `canvas_annotation_tools` (highlight + annotate)
  - `tutor_math_verification`
  - `tutor_fading_policy`
  - `tutor_mute_and_verdict_channel`
  - `multi_depth_explanations`
  - `ask_to_route`
  - `custom_topic_path_generation`
  - `llm_config_generation`
  - `curator_review_queue`
- **Breadth:**
  - `broad_stem_catalog` (target ≥ 4 domains: circuits, mechanics/statics, optics, chemistry kinetics)
  - `learning_path_catalog`
  - `content_versioning_and_archive`
  - `draggable_graph_point`
  - `ordering_and_sorting`
- **Habit and reflection:**
  - `daily_streak_with_charges`
  - `xp_points`
  - `celebration_chain`
  - `focus_mode`
  - `progress_dashboard`

### v1.x / v2 (deferred, with promotion conditions in the schema)

| Feature(s) | Promote when |
|---|---|
| `daily_problem` | 2+ domains have generators |
| `coverage_audit_view` | 3+ domains exist |
| `tutor_voice_io` and `tutor_character` | The text tutor is stable |
| `token_slot_code_editor` + `code_execution_sandbox` | The CS track begins |
| `adaptive_lesson_shape` | The player and generators are stable |
| `concept_reference_notes` | Tutor retrieval work begins |
| `local_reminders` | The desktop shell exists |
| `typed_lesson_modes` | The second science domain arrives |
| `missed_problem_bookmarks`, `personal_best_weeks`, `weekly_summary_narrative`, `progress_reset_controls` | v1.x polish (low-value/cheap; reset needs local snapshots) |
| `free_code_editor`, `block_code_puzzle`, `cross_device_sync`, `user_authored_problems`, `standards_alignment_mapping` | v2 |

### Dependency graph (core spine, simplified)

```text
A ──> B means "B depends on A" (matches the schema's dependencies field).

interaction_primitive_contract ──> lesson_player_state_machine ──> lesson_learn_phase ──> lesson_check_phase
lesson_player_state_machine ──> attempt_event_log
lesson_check_phase + attempt_event_log ──> assessment_only_measurement
interaction_primitive_contract + simulation_primitive_library ──> simulated_component_toggle
    ──> consequence_simulation_feedback
interaction_primitive_contract + answer_expectations_checker ──> structured_math_input
interaction_primitive_contract ──> drag_manipulatives / parameter_slider / choice_tiles
lesson_document_format ──> concept_skill_graph
lesson_document_format ──> course_level_lesson_hierarchy ──> path_node_visualization
interaction_primitive_contract + answer_expectations_checker ──> parameterized_puzzle_generators
parameterized_puzzle_generators ──> variation_generator ──> lesson_check_phase / lesson_practice_set
parameterized_puzzle_generators ──> automated_puzzle_evals ──> report_problem_quarantine
v1: attempt_event_log + concept_skill_graph + difficulty ──> knowledge_state_model ──> spaced_review_scheduler
    ──> next_best_task_scheduler ──> dynamic_path_insertion ──> warm_up_retrieval / remediation_branching
v1: llm_provider_adapter ──> ai_tutor_core (+ tutor_math_verification) ──> socratic_hint_ladder / canvas_annotation_tools
v1: llm_provider_adapter + evals + next_best_task_scheduler ──> custom_topic_path_generation ──> broad_stem_catalog
```

The machine-checked version is the `dependencies` field of each feature in `04-selection-schema.yaml`. The build script
verifies there are no cycles, no dangling references, and no dependency on a later milestone.

## 2. Strategic differentiators (vs Brilliant-2026)

1. **Restored STEM breadth.** Shared simulators (circuits, statics, optics, kinematics/orbits, kinetics/equilibrium,
   molecules, logic, qubits) make new domains a generator-authoring cost, not a hand-built-course cost.
2. **Knowledge-aware dynamic paths.** Paths re-render per learner: mastered lessons are skipped, and warm-ups,
   remediation, and reviews are inserted. Brilliant has fixed insertions and population recommenders.
3. **Custom-topic learning paths.** Ask for any STEM topic and get an editable, validated concept graph, a planned path,
   and generated lessons.
4. **Real spaced retrieval.** Concept-level FSRS with credit flowing through the graph, where Brilliant's review sets are
   still "rolling out".
5. **Local-first.** Offline, no keys or ads, the user owns their data, an open learner model, and content that never
   silently disappears.
6. **Explanations at several depths,** fixing the top content complaint.
7. **Accessibility by construction,** where Brilliant documents none.

## 3. Integration model

**External services (all optional at runtime):**
- **Claude API**: tutor, generation, routing. Called from the local backend only, never the browser (the SDK disables
  browser use by default).
- **Ollama / llama.cpp**: local models for offline AI, with schema-constrained output.

No other network dependency.

**Data flow:**

```text
UI (React SPA) ──events──> Lesson player (statechart) ──> attempt_event_log (SQLite, local)
      ^                                                         │
      │ render lesson/items                                     v
Content store <── accepted ── curator_review_queue <── evals <── generators / LLM configs
      │                                                         │
      └── scheduler(knowledge model, FSRS, skill graph) <───────┘
Tutor: lesson state + solver solution + tutor notes ──> LLM adapter ──> verified text + tool calls ──> canvas overlay
```

**Approved stack (D1–D3):**

| Area | Choice |
|---|---|
| Language and UI | TypeScript, React, Vite |
| Interactives | SVG rendering |
| Lesson flow | XState statechart |
| Schemas | Zod as the single source of truth, exported as JSON Schema for constrained LLM output |
| Math rendering | KaTeX + mhchem |
| Math input | MathLive |
| Equivalence checks | Cortex Compute Engine `isIdenticallyEqual`, with SymPy/Pyodide as the fallback (v1.x) |
| Units | math.js |
| Spaced repetition | ts-fsrs |
| Storage | SQLite (better-sqlite3) via a small local Node backend (Hono or Fastify) |
| Desktop wrapper | Electron later (consistent Chromium for WASM: Pyodide, RDKit, ngspice) |

**Avoid** (license or fit):
- GeoGebra (non-commercial).
- PhET post-2026 (CC BY-NC).
- CircuitJS embedded (GPL).
- tldraw (license key).
- Monaco (no mobile support).
- Rive authoring (paid exports and splash screen).
- Piper (now GPL).

## 4. UX model

**Core flows:**
1. **Home.** Resume card, then the next-best task (which may be a Warm Up or review), then Start. "What do you want to
   learn?" box, streak strip.
2. **Path.** Vertical node trail per course. Node types: lesson, practice, review, check, and inserted
   (warm-up/remediation). A node popover offers Start, Practice, or Redo.
3. **Lesson player.** Header: close, progress (learn segment + check dots), XP, streak. Card: flag, prompt, canvas,
   Start over. One primary button: Check → Continue / Finish. Tutor avatar bottom-left (learn phase only).
4. **Feedback.**
   - Correct: green, plays the outcome, [Why?] [Continue].
   - Wrong (learn phase): amber, plays the consequence, misconception hint, [See answer] [Try again].
   - Wrong (check phase): no retry, [Why?] [Continue].
5. **End chain.** XP → streak → charge, each skippable. Focus mode collapses it to one line.
6. **Custom topic.**
   - The user requests a topic.
   - The app shows a draft concept graph with sources and confidence, which the user can edit.
   - The user accepts, a path is planned, and lessons are generated into the curator queue.
7. **Open learner model.** Mastery map with uncertainty and the next review date. "I know this" opens a test-out.

**Interaction primitives:** listed in §1. All are keyboard-operable, screen-reader-labeled from `describeForTutor`,
use non-color verdict cues, and run on Pointer Events. No swipe navigation.

**Onboarding:**
- Pick a domain.
- 6–10 item adaptive placement (outer fringe).
- First lesson within 2 minutes.
- No account.

## 5. Data model (SQLite)

| Entity | Key fields |
|---|---|
| `Concept` | id, domain, title, knowledge_points[], generator_ids[], provenance, confidence |
| `ConceptEdge` | from, to, type {prerequisite, encompasses(w∈[0,1]), confusable}, provenance {authored, textbook, llm, user}, confidence |
| `Course` / `Level` / `Lesson` | id, version, status {active, archived}, ordered nodes; `Lesson.doc` = typed lesson document (JSON) |
| `LessonConceptMap` | lesson_id, concept_id, role {introduces, practices} |
| `Generator` | id, domain, version, param schema, radicals, misconception rules |
| `Item` | id, generator_id@version, seed, config (JSON), answer, solution_steps, difficulty_d, eval_report, status {candidate, accepted, quarantined} |
| `Attempt` (append-only) | id, item_id, lesson_id, phase {learn, check, practice, review, placement}, response, correct, first_attempt, hint_level, revealed, duration_ms, ts |
| `ConceptState` | concept_id, theta, n_attempts, ema, mastery {none, provisional, mastered}, fsrs_card (JSON), last_seen |
| `PathPlan` | id, goal (topic or course), node sequence, inserted_reason, generated_at |
| `TutorSession` / `TutorTurn` | lesson/item refs, messages, tool calls, verification results |
| `Flag` | item_id, reason, note, ts |
| `Settings` | provider keys (OS keychain, not the DB), sound, focus mode, retention target |

**Persistence:**
- Everything is local.
- Snapshots make resets reversible.
- Content versions are never deleted.

**Privacy:**
- No telemetry.
- Cloud LLM calls are opt-in per feature and send only lesson context (no identity).
- API keys live in the OS keychain.

## 6. Learning engine defaults (inferred defaults to tune, not proven optima)

| Component | Default |
|---|---|
| Ability per concept | PFAE-Elo θ; P = g + (1−g)·σ(θ−d), with g = 1/k for k-option MC; step U(n) = a/(1+b·n) with a=1, b=0.05 |
| Item difficulty | Fixed from solver-trace radicals (never co-updated live; avoids Elo drift under adaptive selection) |
| Mastery | Provisional when EMA (α≈0.9) ≥ 0.85, ≥ 3 correct across ≥ 2 variants, and the last answer was correct without a bottom-out hint. Mastered after a spaced retrieval ≥ 1 day later |
| Memory | One ts-fsrs card per concept, retention 0.9, default weights. Ratings: Again = wrong or bottom-out; Hard = correct after hints; Good = correct unaided; Easy = fast, unaided, first variant |
| Credit propagation | FIRe-style: success sends w·(1−R) credit down encompassing edges; failure sends a small θ penalty upward |
| Scheduler | Candidates = outer fringe ∪ due reviews (R < 0.9). Score = 0.4·urgency + 0.25·compression + 0.25·goal relevance + 0.1·interleave − recency. Choose items at 75–85% predicted success |
| Gating | Soft only. Test-out through a level check using the same mastery rule |

## 7. Technical risk register

| # | Risk | Sev | Like | Mitigation |
|---|---|---|---|---|
| R1 | Generated items are wrong or unsolvable ("almost right is catastrophic") | H | H | Deterministic generators first; CAS + solver + simulation evals; uniqueness solver; back-translation; quarantine loop; golden regression set |
| R2 | LLM-proposed prerequisite graphs are wrong (invisible to LLM judges) | H | H | External critics (DAG check, textbook order, coverage); user-editable graph; data-driven edge revision; deterministic planner |
| R3 | Scope explosion across STEM domains | H | H | Core = 2 domains; one new simulator family per milestone, except P5's explicit breadth bundle (mechanics/statics, optics, chemistry-kinetics); a domain ships only when its generators pass evals |
| R4 | Tutor gives away answers or makes math errors | H | M | Solver solution in context; CAS check of every number; bottom-out-only reveal; withdrawn in the check phase; eval set of tutoring transcripts |
| R5 | Learner-model miscalibration for one user | M | M | Simple models; open learner model with user correction; tune thresholds on simulated learners before release |
| R6 | Heavy WASM pieces (Pyodide, RDKit, ngspice) bloat or slow the app | M | M | Defer to v1.x; lazy-load in Web Workers; measure a curated Pyodide subset; Compute Engine for the hot path |
| R7 | Drag interactions fragile on touch and browsers | M | M | Pointer Events, visible handles, keyboard alternatives, test matrix |
| R8 | Copyright: reproducing Brilliant content or branding | H | L | Mechanics only; all content generated or written fresh; no Brilliant names or assets; topic names only from archives |
| R9 | Cloud LLM cost and availability | M | M | Provider adapter with a local fallback; cache accepted generations; generation is authoring-time, not per-view |
| R10 | Open-textbook licensing (OpenStax titles are generally CC BY-NC-SA; verify per title because some adopter copies still say CC BY 4.0) | M | M | Personal-local use only; store attribution; never redistribute excerpts |

## 8. Implementation roadmap

| Phase | Deliverable (runnable at end) | Depends on | Success criteria |
|---|---|---|---|
| **P0 Foundations** | Repo, five project docs, Zod schemas for lesson doc / primitive contract / item / attempt, SQLite schema, the build-synthesis tool | n/a | Schemas compile; one hand-written lesson JSON validates |
| **P1 Player + first simulator** | Lesson player statechart; toggle + choice + slider primitives; DC circuit solver; one hand-authored Circuits lesson playable end-to-end with learn/check phases and consequence feedback | P0 | A full lesson runs offline; every state transition is covered by tests; the solver matches hand-computed results |
| **P2 Content engine (core done)** | Generator framework, variation, evals, difficulty, misconception rules, math input + checker, drag/balance primitive; **Circuits** and a **balance-equations course** (working title) generated; practice sets; path UI; event log | P1 | 0 eval-failing items shown; target 12–17 items/lesson with a release floor of ≥ 12; generated variants pass the uniqueness and solver checks |
| **P3 Adaptive engine** | Knowledge model, FSRS, scheduler, dynamic path insertion, interleaved practice, warm-ups, remediation, placement, level review/check, open learner model, streak/XP/celebrations/focus mode, dashboard | P2 | Simulated-learner tests hit a 75–85% success band; mastered lessons are skipped; reviews surface on schedule |
| **P4 AI tutor + routing** | Provider adapter (Claude + Ollama), tutor with tool calls (highlight/annotate), hint ladder, fading policy, mute/verdict channel, math verification, multi-depth explanations, Ask-to-route | P3 | Tutor eval set: 0 answer leaks before bottom-out, 0 unverified numbers; works offline with a local model |
| **P5 Custom topics + breadth (v1 done)** | LLM graph proposal with critics, editable graph UI, deterministic planner, LLM config generation, curator queue; learning path catalog; archive UI; draggable-graph-point + ordering/sorting primitives; add mechanics/statics, optics, and chemistry-kinetics simulators | P4 | A requested topic yields a valid DAG, a planned path, and eval-passing lessons; ≥ 4 science domains live; `content_versioning_and_archive` complete |
| **P6 v1.x** | Daily problem, coverage audit, voice, character, reference notes, token-slot code + Pyodide, reminders, resets, typed lesson modes, adaptive lesson shape, personal-best weeks, weekly summary narrative, missed-problem bookmarks | P5 | Each promoted feature meets the promotion condition in its schema |

## Decisions (answered 2026-10-20)

- **D1. Form factor.** Local web app first (Node backend + browser), wrapped in Electron later. *Chosen.*
- **D2. LLM provider.** Claude API as primary with Ollama as an offline fallback. *Chosen.* Requires an API key and has
  usage cost.
- **D3. Dependencies.** The proposed library list in §3 is approved. *Chosen.*
- **D4. First domains.** Circuits + a balance-equations course (working title; Brilliant's observed course is *Solving
  Equations*). *Chosen.*
- **D5. Product name.** Codename **Noesis**. The folder stays `BrilliantRebuild`. No Brilliant branding.
