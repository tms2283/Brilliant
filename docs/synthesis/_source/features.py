"""Single source of truth for the /synthesis canonical feature objects.

Generated artifacts (run tools/build_synthesis.py, never hand-edit them):
  docs/synthesis/02-feature-matrix.csv   - spreadsheet-importable matrix (all 11 scoring dimensions)
  docs/synthesis/02-feature-matrix.md    - human-readable matrix grouped by cluster
  docs/synthesis/04-selection-schema.yaml - machine-usable selection schema

Products:
  B26 = Brilliant (2026): current tutor-first app. Directly observed 2026-10-10, plus official help/blog.
  BL  = Brilliant-Legacy (2014-2024): problems/community/wiki era and the broad-STEM course catalog.
        Seen through archives, release notes, and reviews.
  NEW = recommended improvement with no Brilliant source. Its pattern_source names the
        implementation pattern (an algorithm or library), not a competing product's feature.

Score order (1-5): user_value, use_frequency, differentiation, comprehensibility, workflow_leverage,
  implementation_complexity (5 = hardest), maintenance_burden (5 = heaviest), privacy_risk (5 = riskiest),
  feature_synergy, mvp_fit, expansion_potential
Epistemic marker of each feature *definition*: verified | observed | inferred | recommended
Release milestones: core = first runnable app (deterministic learning loop, no LLM required);
  v1 = completes the first full release (adaptivity + AI + breadth); v1.x / v2 = deferred with promotion
  conditions in the rationale; none = dropped. keep/merge => core|v1, defer => v1.x|v2, drop => none.
Research ids (e.g. HC-09, OBS-E) point into docs/research/*.md. OBS-x = 01-direct-observation.md section x.
"""

DIMS = [
    "user_value", "use_frequency", "differentiation", "comprehensibility", "workflow_leverage",
    "implementation_complexity", "maintenance_burden", "privacy_risk", "feature_synergy",
    "mvp_fit", "expansion_potential",
]

FEATURES = []


def F(name, cluster, sources, overlap, role, desc, value, inputs, outputs, deps, scores, state,
      rationale, pattern, evidence, confidence, release, score_notes, refs):
    vals = [int(x) for x in scores.split()]
    assert len(vals) == 11, name
    assert state in {"keep", "merge", "defer", "drop", "investigate"}, name
    assert overlap in {"unique", "overlapping", "complementary", "weak_substitute", "obsolete", "unclear"}, name
    assert role in {"input", "processing", "output", "organization", "review"}, name
    FEATURES.append(dict(
        canonical_feature=name, cluster=cluster, source_products=sources, overlap_status=overlap,
        workflow_role=role, description=desc, user_value_text=value, inputs=inputs, outputs=outputs,
        dependencies=deps, scores=dict(zip(DIMS, vals)), recommended_state=state, rationale=rationale,
        recommended_source_pattern=pattern, evidence_tier=evidence, confidence=confidence,
        release=release, score_notes=score_notes, refs=refs,
    ))


# ───────────────────────────── curriculum_structure ─────────────────────────────
F("concept_skill_graph", "curriculum_structure", ["B26", "BL"], "complementary", "organization",
  "Typed DAG of concepts/skills (Big Idea > objective > skill) with prerequisite and encompassing edges; lessons and items map to skills many-to-many.",
  "Lets the app know what you know, what you're ready for, and why a lesson matters.",
  "authored or generated concepts, edges with provenance", "graph used by scheduler, paths, coverage, tutor routing",
  ["lesson_document_format"], "5 5 4 3 5 4 3 1 5 5 5", "merge",
  "Merge B26's coded skill framework (CFL-1 style ids, lesson-to-skill tags, standards map) with BL's cross-domain course prereq/next-steps graph; primary = B26 skill granularity, add BL cross-domain edges and typed edge weights (FIRe encompassing).",
  "merge: B26 Coding Skills Framework ids + BL course-graph edges + Math Academy encompassing weights",
  "verified", "high", "core",
  "ic=4: DAG integrity, provenance, editing UI; leverage/synergy=5: every adaptive feature reads it; privacy=1: no personal data.",
  ["HC-21", "HC-29", "CH-36", "ENG-21", "SR-04", "OBS-H"])

F("learning_path_catalog", "curriculum_structure", ["B26", "BL"], "overlapping", "organization",
  "Curated ordered sequences of courses per subject with level labels (grade band or tier).",
  "A clear 'where do I start / what's next' answer for a subject.",
  "course list + order + level label", "path page with recommended course order",
  ["concept_skill_graph"], "4 3 2 5 3 2 2 1 4 4 3", "merge",
  "Keep curated paths as the default face, but compute them as views over the skill graph so they can be re-ordered per learner; primary = B26 path UI, add knowledge-aware ordering (NEW).",
  "merge: B26 learning paths rendered from concept_skill_graph",
  "verified", "high", "v1",
  "differentiation=2: every course platform has paths; ic=2: a sorted view; comprehensibility=5.",
  ["HC-44", "OBS-J"])

F("course_level_lesson_hierarchy", "curriculum_structure", ["B26", "BL"], "overlapping", "organization",
  "Course > Level > Lesson > Exercise containers, with level-end review nodes and course-end practice.",
  "Bite-size, finishable units with visible structure.",
  "course definition", "gameboard of levels and nodes",
  ["lesson_document_format"], "4 5 2 5 4 2 2 1 5 5 3", "keep",
  "Observed directly (GameboardLessonNode / LevelReviewNode shapes); proven structure, trivial to model.",
  "B26 gameboardV2 (levels[], nodesV2[], node status/action)",
  "observed", "high", "core",
  "use_frequency=5: every session; differentiation=2: standard; ic=2.",
  ["OBS-B", "HC-02"])

F("content_versioning_and_archive", "curriculum_structure", ["B26"], "weak_substitute", "organization",
  "Courses and lessons carry versions; retired content moves to an always-available archive shelf with progress migrated across rename/merge/split.",
  "You never lose a course or your progress mid-way (top complaint about Brilliant).",
  "course versions, migration maps", "archive shelf, changelog, migrated progress",
  ["course_level_lesson_hierarchy"], "4 2 4 4 3 3 2 1 3 3 3", "keep",
  "B26 has versionName/retiringOn but hides archives on desktop only and drops progress silently; improved version is cheap locally and fixes a trust failure.",
  "B26 versionName/retiringOn fields, improved: archive on every surface + progress migration",
  "observed", "high", "v1",
  "differentiation=4: Brilliant's documented failure; frequency=2: rarely visible; privacy=1.",
  ["OBS-B", "CH-10", "CH-11", "HC-33", "HC-34"])

F("broad_stem_catalog", "curriculum_structure", ["BL"], "unique", "organization",
  "Restore legacy breadth (science titles peaked around 2022-23 at ~19-20): physics (mechanics, E&M, waves/optics, gravitation, relativity, quantum), chemistry, biology, electronics, energy, info theory, quant finance, built from shared simulation generators.",
  "Learn the sciences Brilliant retired: the user's stated core motivation.",
  "domain syllabi skeletons (topic names only), generators per domain", "courses per science domain",
  ["parameterized_puzzle_generators", "simulation_primitive_library", "custom_topic_path_generation"],
  "5 4 5 4 4 5 4 1 5 3 5", "keep",
  "Primary user goal. Brilliant retired breadth plausibly due to per-course content cost (about 2x exercise density in rebuilt courses); a generator-plus-eval engine makes breadth cheap. MVP ships one science domain (circuits/electricity); others roll out per roadmap.",
  "BL 2019-2024 catalog as scope reference; content written fresh",
  "observed", "high", "v1",
  "ic=5 and mb=4: each domain needs simulators + validators; differentiation=5: no current Brilliant equivalent; mvp_fit=3: one domain in MVP.",
  ["CH-03", "CH-04", "CH-06", "CH-16", "CH-22", "CH-29"])

F("coverage_audit_view", "curriculum_structure", ["B26"], "unique", "review",
  "Per-domain Covered/Partial/Gap audit of skills; coverage = (C + 0.5P)/total; gaps link to 'generate lessons for this'.",
  "See exactly which parts of a subject are missing and fill them on demand.",
  "skill framework, lesson-skill mapping", "coverage dashboard, gap list",
  ["concept_skill_graph"], "3 2 4 4 4 2 2 1 4 2 4", "defer",
  "Cheap once the skill graph exists and powerful with generation, but not needed for the first learning loop. Promote when 3+ domains exist.",
  "B26 coding-coverage audit formula",
  "verified", "high", "v1.x",
  "differentiation=4 when tied to on-demand generation; mvp_fit=2; ic=2.",
  ["HC-22", "ENG-23"])

F("standards_alignment_mapping", "curriculum_structure", ["B26"], "unique", "organization",
  "Tag skills to external frameworks (Common Core, NGSS, AP, SAT) and generate coverage pages.",
  "Useful for school alignment and test prep.",
  "skill-to-standard tags", "searchable standards pages",
  ["concept_skill_graph"], "2 1 2 4 2 2 3 1 3 1 3", "defer",
  "Valuable for classrooms/test-prep, low value for a single self-directed learner. Promote if the user targets an exam.",
  "B26 18-framework skill-level map",
  "verified", "high", "v2",
  "user_value=2, frequency=1, mvp_fit=1 for a personal app.",
  ["HC-28", "HC-29"])

# ───────────────────────────── lesson_experience ─────────────────────────────
F("lesson_learn_phase", "lesson_experience", ["B26"], "unique", "processing",
  "Scaffolded problem sequence: unlimited retries, tutor hints, See answer, Start over; attempts here never count toward mastery scores.",
  "Mistakes feel safe, so learners experiment and build intuition.",
  "lesson document, learner interactions", "attempt log (unscored), XP",
  ["lesson_player_state_machine", "interaction_primitive_contract"], "5 5 5 5 5 3 2 1 5 5 4", "keep",
  "Directly observed core mechanic; separating learning from measuring is Brilliant's key design insight.",
  "B26 lesson learn phase (observed)",
  "observed", "high", "core",
  "user_value/frequency/leverage=5: this IS the product; differentiation=5 vs answer-only quiz apps; ic=3.",
  ["OBS-C", "OBS-E", "HC-10"])

F("lesson_check_phase", "lesson_experience", ["B26"], "unique", "review",
  "End-of-lesson Skills Check: ~3 one-shot items in fresh configurations, no tutor, explanation only; scored in thirds.",
  "An honest signal of whether the idea stuck, without punishing the learning phase.",
  "variant items from the lesson's generators", "skills-check score feeding learner model",
  ["lesson_learn_phase", "variation_generator"], "5 5 4 5 5 2 2 1 5 5 4", "keep",
  "Observed directly; cheap given generators; it is the clean evidence source for the knowledge model.",
  "B26 check phase (observed) + HC-02 Skills Check",
  "observed", "high", "core",
  "leverage=5: only clean mastery evidence; ic=2 once generators exist.",
  ["OBS-C", "OBS-E", "HC-02", "HC-04"])

F("action_first_sequencing", "lesson_experience", ["B26"], "unique", "processing",
  "Lesson authoring rule: pose 1-2 hands-on problems before any concept explanation; concept cards follow, then a takeaway.",
  "Curiosity before vocabulary; learners discover the rule themselves.",
  "lesson template", "ordered pages",
  ["lesson_document_format"], "4 5 4 4 4 1 1 1 4 5 3", "keep",
  "Observed (concept page after two problems) and stated ('Action first. Theory later.'); productive-failure evidence supports it when prior knowledge exists. Add an adaptive switch to worked examples for brand-new learners (NEW, expertise reversal).",
  "B26 lesson pattern + productive-failure/expertise-reversal switch",
  "observed", "high", "core",
  "ic=1: an authoring/generation constraint; differentiation=4.",
  ["OBS-C", "PE-04", "PE-05"])

F("escalating_configuration_sequence", "lesson_experience", ["B26"], "unique", "processing",
  "Within a lesson, one manipulative is reused with configurations that escalate difficulty, each targeting one misconception.",
  "Deep understanding of one idea instead of shallow exposure to many.",
  "generator + ordered difficulty radicals", "page sequence",
  ["parameterized_puzzle_generators", "difficulty_from_solver_trace"], "5 5 4 4 5 3 2 1 5 5 4", "keep",
  "Observed in Current Loops (switch topology escalation) and the blog (one core activity per course); maps directly onto generators.",
  "B26 one-core-manipulative pattern",
  "observed", "high", "core",
  "leverage=5: makes generated lessons coherent; ic=3: needs misconception-tagged radicals.",
  ["OBS-C", "ENG-14"])

F("concept_and_takeaway_cards", "lesson_experience", ["B26", "BL"], "overlapping", "output",
  "Short narrative/concept cards (text + diagram) and a one-sentence takeaway card with an animated diagram.",
  "Names the idea after you've felt it; a memorable summary.",
  "lesson document", "rendered cards",
  ["lesson_document_format"], "4 5 2 5 3 1 2 1 4 5 2", "keep",
  "Observed; trivial to implement; required for every lesson.",
  "B26 concept/takeaway pages",
  "observed", "high", "core",
  "differentiation=2, ic=1, comprehensibility=5.",
  ["OBS-C"])

F("typed_lesson_modes", "lesson_experience", ["BL"], "unique", "processing",
  "Lesson types beyond standard: Explore / Apply / Derive lessons, end-of-level applied capstone 'Problem' lessons, narrative thought-experiment games, mini-courses.",
  "Variety and transfer to real applications.",
  "lesson type tag", "differently scaffolded lessons",
  ["lesson_document_format"], "3 2 3 4 3 2 2 1 3 2 4", "defer",
  "Legacy evidence only; valuable for advanced science courses. Promote with the second science domain.",
  "BL Gravitational Physics Explore/Apply + Classical Mechanics capstones",
  "observed", "medium", "v1.x",
  "mvp_fit=2, frequency=2, ic=2.",
  ["CH-19", "CH-26", "CH-27"])

F("daily_problem", "lesson_experience", ["BL"], "unique", "processing",
  "One cross-subject problem per day with an 'insight' primer, multiple explanations after solving, and a browsable archive.",
  "A low-friction daily habit hook that spans subjects.",
  "generator pool across domains, date seed", "daily item + archive",
  ["parameterized_puzzle_generators", "multi_depth_explanations"], "3 4 3 5 3 2 2 1 4 2 3", "defer",
  "Removed from Brilliant; cheap to restore once several domains have generators. Promote when 2+ domains are live.",
  "BL Daily Challenges / Science Puzzles one-a-day",
  "observed", "high", "v1.x",
  "frequency=4 (daily); ic=2; mvp_fit=2.",
  ["CH-32", "CH-33", "HC-36", "CH-29"])

# ───────────────────────────── interaction_primitives ─────────────────────────────
F("interaction_primitive_contract", "interaction_primitives", ["B26"], "unique", "processing",
  "One typed interface for every interactive (render, getState, setState, validate, reset, describeForTutor, highlightTargets) with a declared input list plus a pure state-to-view function; widgets can subscribe to each other's state.",
  "Every interactive is checkable, resettable, and tutor-visible by construction.",
  "widget config (Zod-typed)", "rendered SVG widget + state events",
  [], "5 5 5 3 5 4 3 1 5 5 5", "keep",
  "Brilliant's Diagrammar (inputs + pure function) and restricted problem APIs are what make generation, evals and Koji possible; this is the platform's spine.",
  "B26 Diagrammar + restricted Elm problem APIs, re-expressed in TypeScript",
  "observed", "high", "core",
  "leverage/synergy/expansion=5; ic=4: careful API design up front; comprehensibility=3 (developer-facing).",
  ["ENG-12", "ENG-14", "ENG-16", "ENG-17", "OBS-A"])

F("simulated_component_toggle", "interaction_primitives", ["B26"], "unique", "input",
  "Click/tap components inside a simulation (switches, gates, valves); the simulation is evaluated on Check and plays the outcome.",
  "Learn by changing a real system and seeing the result.",
  "simulation config + toggled component states", "simulated outcome animation",
  ["interaction_primitive_contract", "simulation_primitive_library"], "5 4 4 5 4 3 3 1 5 5 5", "keep",
  "Observed in Circuits; the template for all science domains.",
  "B26 Circuits switch interactive (observed)",
  "observed", "high", "core",
  "user_value=5, expansion=5 (reused by every science domain); ic=3.",
  ["OBS-F", "OBS-E"])

F("choice_tiles", "interaction_primitives", ["B26", "BL"], "overlapping", "input",
  "Single/multi-select tiles (horizontal short options or vertical text options), with per-option result marks.",
  "Fast answers where construction isn't the point.",
  "options (correct + misconception distractors)", "selected option(s)",
  ["interaction_primitive_contract", "misconception_distractors"], "3 5 1 5 3 1 1 1 4 5 2", "keep",
  "Observed; trivial; needed for code-reading and concept checks. Distractors must come from misconception rules.",
  "B26 MC tiles (observed)",
  "observed", "high", "core",
  "differentiation=1, ic=1, mb=1; frequency=5.",
  ["OBS-F", "LP-16"])

F("structured_math_input", "interaction_primitives", ["B26"], "overlapping", "input",
  "Math field with fraction/root templates, cursor navigation, multiple answer boxes with per-field feedback; parsed to MathJSON and checked by an expectations library.",
  "Type real math answers on any device.",
  "keystrokes / virtual keyboard", "MathJSON value + field-level verdicts",
  ["interaction_primitive_contract", "answer_expectations_checker"], "5 5 3 4 5 3 3 1 5 5 4", "keep",
  "Brilliant wraps MathLive (observed via assets + engineer write-ups); MathLive is MIT and maintained.",
  "B26 MathLive custom element > MathJSON > Elm expectations",
  "observed", "high", "core",
  "user_value/frequency/leverage=5; ic=3 thanks to MathLive.",
  ["HC-09", "LP-11", "ENG-15", "OSS-06", "OBS-A"])

F("drag_manipulatives", "interaction_primitives", ["B26"], "overlapping", "input",
  "Draggable objects with visible handles: tiles, weights on balances, blocks, pieces snapping to positions.",
  "Physical intuition for abstract quantities.",
  "drag events (pointer events)", "manipulative state",
  ["interaction_primitive_contract"], "5 4 4 3 4 3 3 1 5 4 4", "keep",
  "Core to Solving Equations / Negative Numbers / mobiles; users report fragile drags, so build on Pointer Events with obvious handles.",
  "B26 tile/balance manipulatives",
  "verified", "high", "core",
  "comprehensibility=3: handles hard to discover per reviews; ic=3.",
  ["HC-09", "LP-12", "LP-43"])

F("parameter_slider", "interaction_primitives", ["B26", "BL"], "overlapping", "input",
  "Sliders bound to model parameters that update a diagram live (exploration) or set an answer.",
  "See how a system responds as you vary one thing.",
  "slider value", "re-rendered diagram",
  ["interaction_primitive_contract"], "4 4 2 5 4 1 1 1 5 5 3", "keep",
  "Long-standing (2018 release notes); trivial; essential for science exploration.",
  "B26/BL graph sliders",
  "observed", "high", "core",
  "ic=1, mb=1, differentiation=2.",
  ["LP-16", "ENG-14"])

F("draggable_graph_point", "interaction_primitives", ["B26"], "overlapping", "input",
  "Drag points/lines on a coordinate plane (tangent lines, fits, vectors) with snapping and constraints.",
  "Feel the math of functions and geometry.",
  "pointer drag", "point coordinates",
  ["interaction_primitive_contract"], "4 3 3 4 4 3 3 1 4 4 4", "keep",
  "Named by Brilliant (dragging a tangent line); JSXGraph or a thin custom SVG layer covers it.",
  "B26 graph interactives; JSXGraph (MIT option)",
  "verified", "high", "v1",
  "ic=3 for snapping/constraints; mb=3.",
  ["LP-18", "OSS-02"])

F("token_slot_code_editor", "interaction_primitives", ["B26"], "unique", "input",
  "Code view with editable slots filled from a token palette (no free typing); the program runs on Check with output console and execution pointer.",
  "Mobile-friendly, always-parseable coding practice (predict, diagnose, fix).",
  "slot selections", "program output + trace",
  ["interaction_primitive_contract", "code_execution_sandbox"], "4 3 4 4 4 3 3 1 4 2 4", "defer",
  "Observed and elegant, but coding is not the first priority (science breadth is). Promote with the first CS course.",
  "B26 Warm Up fix-the-program editor (observed)",
  "observed", "high", "v1.x",
  "mvp_fit=2 given science-first scope; ic=3.",
  ["OBS-F"])

F("free_code_editor", "interaction_primitives", ["B26"], "overlapping", "input",
  "Full Python editor with Run, hidden tests, and repeated submissions (run/read, predict, debug, complete-the-logic).",
  "Real programming practice offline.",
  "code text", "test results, output",
  ["code_execution_sandbox"], "4 3 2 3 3 3 3 1 3 1 4", "defer",
  "Brilliant has 2,081 run-and-edit problems; important for CS but not MVP. CodeMirror 6 (mobile-capable), not Monaco.",
  "B26 Thinking in Python editor; CodeMirror 6 + Pyodide",
  "verified", "high", "v2",
  "mvp_fit=1; differentiation=2 (common).",
  ["LP-10", "HC-23", "OSS-11", "OSS-12"])

F("block_code_puzzle", "interaction_primitives", ["B26"], "overlapping", "input",
  "Drag-and-drop code blocks / pseudocode puzzles before text code.",
  "Gentle on-ramp to programming.",
  "block arrangement", "program behavior",
  ["code_execution_sandbox"], "3 2 2 4 3 3 3 1 3 1 3", "defer",
  "Part of Brilliant's CS pedagogy; Blockly (Apache-2.0) available. v2 with CS track.",
  "B26 Thinking in Code drag-and-drop; Blockly",
  "observed", "medium", "v2",
  "mvp_fit=1, frequency=2.",
  ["ENG-16", "OSS-13"])

F("ordering_and_sorting", "interaction_primitives", ["B26"], "overlapping", "input",
  "Reorder or categorize items (steps of a proof, magnitudes, process stages).",
  "Checks understanding of sequence and classification.",
  "drag order", "ordering",
  ["interaction_primitive_contract"], "3 3 1 5 3 2 1 1 4 3 3", "keep",
  "Cheap, generic primitive essential for custom-topic lessons where no simulator exists.",
  "Perseus orderer/sorter taxonomy (reference only); B26 Order Logic",
  "inferred", "medium", "v1",
  "differentiation=1, ic=2, mb=1.",
  ["OSS-55", "LP-01"])

# ───────────────────────────── feedback_and_explanation ─────────────────────────────
F("lesson_player_state_machine", "feedback_and_explanation", ["B26"], "unique", "processing",
  "Explicit statechart per page: pristine > dirty > checked_correct | checked_incorrect > (try_again | see_answer) > continue; single primary button label from state; phase-aware (learn vs check).",
  "Predictable, consistent flow on every screen.",
  "page events", "UI state + event log the tutor reads",
  ["interaction_primitive_contract"], "4 5 3 4 5 3 2 1 5 5 4", "keep",
  "Observed in detail; an explicit statechart is the cleanest way to reproduce it and to expose an event log to the tutor.",
  "B26 observed state machine; XState v5 (MIT)",
  "observed", "high", "core",
  "frequency/leverage=5; ic=3.",
  ["OBS-E", "LP-03", "OSS-23"])

F("immediate_verdict_feedback", "feedback_and_explanation", ["B26", "BL"], "overlapping", "output",
  "Instant verdict on Check: green border + glow + short message when correct; amber (never red) when wrong; per-field marks; XP chip.",
  "Know immediately, without shame.",
  "validation result", "verdict UI + sound",
  ["lesson_player_state_machine"], "5 5 2 5 4 1 1 1 5 5 2", "keep",
  "Observed; trivial; amber-not-red is a deliberate low-shame choice to keep. Add a non-color cue (icon/text) for accessibility.",
  "B26 green/amber verdict (observed)",
  "observed", "high", "core",
  "ic=1, differentiation=2.",
  ["OBS-E", "HC-03"])

F("consequence_simulation_feedback", "feedback_and_explanation", ["B26"], "unique", "output",
  "On Check, the simulation always plays out the learner's own configuration, including wrong ones (bulb stays dark, current takes the short path).",
  "The wrong answer becomes its own explanation.",
  "learner configuration + simulator", "animated consequence",
  ["simulation_primitive_library", "simulated_component_toggle"], "5 4 5 5 4 3 3 1 5 5 5", "keep",
  "Directly observed; the strongest pedagogical pattern found; requires real simulators (not answer keys), which the science engine needs anyway.",
  "B26 Circuits check animation (observed)",
  "observed", "high", "core",
  "differentiation=5, expansion=5; ic=3.",
  ["OBS-E"])

F("misconception_targeted_hints", "feedback_and_explanation", ["B26"], "unique", "output",
  "Wrong states are classified against misconception rules; the hint names the specific rule violated (e.g. 'current takes a bulb-free path').",
  "Feedback that diagnoses the actual misunderstanding.",
  "learner state + misconception rule set", "targeted hint text",
  ["misconception_distractors", "simulation_primitive_library"], "5 4 5 5 4 3 3 1 5 5 4", "keep",
  "Observed (state-specific Koji bubble); implement as deterministic rules per generator with optional LLM phrasing, so no hallucination risk.",
  "B26 state-specific hint (observed) + Oppia misconception branches",
  "observed", "high", "core",
  "differentiation=5; ic=3: rules per generator.",
  ["OBS-E", "OSS-53", "PE-03"])

F("retry_and_reveal_controls", "feedback_and_explanation", ["B26"], "unique", "input",
  "Learn phase: Try again (keeps configuration), See answer, Start over; check phase: no retry; both phases: Why? opens a short explanation built from the solver's solution steps.",
  "Control over how much help you take.",
  "button events", "state transitions",
  ["lesson_player_state_machine"], "4 5 3 5 4 1 1 1 5 5 2", "keep",
  "Observed; trivial once the state machine exists.",
  "B26 Try again / See answer / Start over (observed)",
  "observed", "high", "core",
  "ic=1, mb=1.",
  ["OBS-E", "LP-13"])

F("multi_depth_explanations", "feedback_and_explanation", ["B26", "BL"], "complementary", "output",
  "Explanations at several depths: one-line Why, step-by-step worked view (staged animation on the same canvas), 'explain differently' alternatives, glossary popovers for terms.",
  "Fixes the #1 content complaint: terse, puzzle-like explanations.",
  "solver solution steps + item config", "explanation layers",
  ["answer_expectations_checker", "ai_tutor_core"], "5 4 4 5 4 3 3 1 4 4 4", "merge",
  "Primary = B26 'Why?' modal; add BL's multiple community explanations as generated alternatives and a step-by-step layer derived from the solver trace (never free LLM math).",
  "merge: B26 Why? modal + BL voted alternative explanations (generated) + solver-step worked view",
  "observed", "high", "v1",
  "user_value=5 per complaint frequency; ic=3; differentiation=4.",
  ["OBS-E", "LP-06", "LP-34", "CH-32"])

F("report_problem_quarantine", "feedback_and_explanation", ["B26"], "weak_substitute", "review",
  "Flag icon on every item records generator id, seed and config; flagged items are quarantined, regenerated, and added to a regression set.",
  "Bad content gets fixed and never comes back.",
  "flag + reason", "quarantine entry, regression test",
  ["parameterized_puzzle_generators", "automated_puzzle_evals"], "3 2 3 5 4 2 2 1 4 4 3", "keep",
  "B26 only sends a report to staff; local closed loop with the generator pipeline is cheap and essential for AI content.",
  "B26 flag/report (observed) improved into a local QA loop",
  "observed", "high", "core",
  "frequency=2; leverage=4 for content quality; ic=2.",
  ["OBS-D", "HC-39", "LP-19"])

# ───────────────────────────── assessment_and_mastery ─────────────────────────────
F("assessment_only_measurement", "assessment_and_mastery", ["B26"], "unique", "review",
  "Only check-phase, practice, and review items feed accuracy and mastery; learn-phase attempts are logged but unscored. First-attempt and eventual accuracy are stored separately.",
  "Clean evidence for adaptivity; learning stays risk-free.",
  "attempt log with phase tag", "evidence stream for learner model",
  ["lesson_check_phase", "attempt_event_log"], "4 5 4 3 5 1 1 1 5 5 3", "keep",
  "Observed arithmetic (83.3% = 5/6 assessed items) and K-5 docs (first-attempt vs eventual). Trivial and foundational.",
  "B26 assessment accuracy model (observed) + K-5 first-attempt split",
  "observed", "high", "core",
  "leverage=5; ic=1.",
  ["OBS-G", "LP-09", "HC-26"])

F("level_review_set", "assessment_and_mastery", ["B26"], "overlapping", "review",
  "10-15 item end-of-level review with no hints, mixing the level's skills; readiness signal.",
  "Consolidates a level; reveals gaps before moving on.",
  "level skill set", "review score, gap list",
  ["variation_generator", "interleaved_practice"], "4 3 3 5 4 2 2 1 5 5 3", "keep",
  "Verified structure; cheap with generators; doubles as interleaved practice.",
  "B26 Level Review",
  "verified", "high", "v1",
  "ic=2; leverage=4.",
  ["HC-03", "OBS-B"])

F("level_check_test_out", "assessment_and_mastery", ["B26"], "overlapping", "review",
  "Optional gate to skip ahead: pass a level check using the same mastery criterion, which credits the skipped skills.",
  "Don't waste time on what you already know.",
  "target level skill set", "unlock + mastery credit",
  ["knowledge_state_model", "variation_generator"], "4 2 3 4 4 2 2 1 4 4 3", "keep",
  "Verified (Premium-only at Brilliant); soft gating is better than hard gating per mastery-learning evidence.",
  "B26 level check (jump-ahead gate), soft",
  "verified", "high", "v1",
  "frequency=2; ic=2.",
  ["HC-06", "PE-02"])

F("adaptive_placement_diagnostic", "assessment_and_mastery", ["B26", "BL"], "complementary", "input",
  "Short adaptive diagnostic over the skill graph that finds the knowledge frontier (outer fringe) and seeds per-concept ability.",
  "Start at the right place on day one.",
  "diagnostic responses", "initial knowledge state + recommended start",
  ["concept_skill_graph", "knowledge_state_model"], "4 1 4 4 5 3 2 2 5 4 4", "merge",
  "Primary = B26 signup diagnostic (opaque); add BL 5-difficulty probe per topic and KST outer-fringe selection to cut questions.",
  "merge: B26 diagnostic + BL 5-level probe + KST fringe / Math Academy frontier",
  "verified", "medium", "v1",
  "frequency=1 (once per domain); leverage=5; privacy=2: knowledge profile is personal but stays local.",
  ["HC-06", "CH-38", "KG-01", "SR-05"])

F("open_learner_model", "assessment_and_mastery", ["NEW"], "unique", "output",
  "Visible per-concept mastery, uncertainty, last-retrieved date and next review; the user can correct it ('I know this').",
  "Trust and agency: see and steer what the app believes about you.",
  "knowledge state", "mastery map UI",
  ["knowledge_state_model", "spaced_review_scheduler"], "4 3 5 4 4 2 2 2 5 4 4", "keep",
  "Learner-model research says an open learner model matters as much as the estimator; Brilliant shows only lesson percentages.",
  "Pelánek UMUAI 2017 open learner model",
  "recommended", "medium", "v1",
  "differentiation=5 vs Brilliant; ic=2; privacy=2 (local only).",
  ["LM-05", "OBS-I"])

# ───────────────────────────── review_and_recall ─────────────────────────────
F("lesson_practice_set", "review_and_recall", ["B26"], "overlapping", "review",
  "Each lesson owns a practice set (scaffolds off) reachable from the completed node: [Practice] or [Redo].",
  "Strengthen a specific lesson on demand.",
  "lesson skills", "practice session",
  ["variation_generator", "lesson_player_state_machine"], "4 3 2 5 4 2 2 1 5 5 3", "keep",
  "Observed (nextPracticeSlug on every lesson node); trivial with generators.",
  "B26 nextPracticeSlug practice sets (observed)",
  "observed", "high", "core",
  "differentiation=2, ic=2.",
  ["OBS-B", "OBS-H", "LP-20"])

F("warm_up_retrieval", "review_and_recall", ["B26"], "unique", "review",
  "Before the next new lesson, insert a short practice set retrieving the previous level's skills, chosen by the scheduler.",
  "Retrieval before new learning, automatically.",
  "scheduler pick", "inserted path node",
  ["spaced_review_scheduler", "dynamic_path_insertion"], "4 4 3 5 4 2 2 1 5 5 3", "keep",
  "Observed (Warm Up from previous level, home recommendation); becomes scheduler-driven instead of fixed.",
  "B26 Warm Up insertion (observed) driven by FSRS",
  "observed", "high", "v1",
  "ic=2; leverage=4.",
  ["OBS-H", "HC-07"])

F("variation_generator", "review_and_recall", ["B26"], "unique", "processing",
  "Produces fresh surface-varied variants of an item that keep the learning objective, including predict / diagnose / fix trios on one scenario.",
  "Practice the skill, not the memorized item.",
  "item config + variation rules", "new validated items",
  ["parameterized_puzzle_generators", "automated_puzzle_evals"], "5 5 4 3 5 3 3 1 5 5 5", "keep",
  "Verified (Brilliant's variation tool) and observed (Warm Up trio); every review and check item depends on it.",
  "B26 variation tool + K-5 generator contract",
  "verified", "high", "core",
  "leverage/synergy=5; ic=3.",
  ["ENG-20", "HC-27", "OBS-F"])

F("spaced_review_scheduler", "review_and_recall", ["B26", "NEW"], "weak_substitute", "review",
  "Per-concept FSRS-6 memory card (not per item); reviews draw fresh variants; FIRe-style implicit credit flows through encompassing edges.",
  "Long-term retention: Brilliant's biggest pedagogical gap (review sets only 'rolling out').",
  "assessed outcomes mapped to ratings", "due-review queue",
  ["knowledge_state_model", "variation_generator", "concept_skill_graph"], "5 4 5 4 5 4 3 2 5 5 5", "merge",
  "Primary = FSRS-6 via ts-fsrs (MIT) at concept level; take B26's 'personalized practice' and review-set intent; add FIRe credit propagation (Math Academy pattern).",
  "merge: B26 personalized practice intent + FSRS-6 (ts-fsrs) + FIRe encompassing credit",
  "recommended", "medium", "v1",
  "differentiation=5, ic=4 (no partial-review API in ts-fsrs); privacy=2 (local).",
  ["ENG-05", "LP-31", "SR-01", "SR-02", "SR-04"])

F("interleaved_practice", "review_and_recall", ["B26"], "overlapping", "review",
  "Mixed practice sets that deliberately pair confusable concepts (series vs parallel, molarity vs molality).",
  "Learn to choose the right method, the skill that matters on real problems.",
  "concept confusability edges", "mixed sets",
  ["concept_skill_graph", "next_best_task_scheduler"], "4 3 3 4 4 2 2 1 5 4 3", "keep",
  "Brilliant tests it; strong evidence (d=0.83 RCT, g=0.42 meta); cheap with confusable edges.",
  "B26 mixed practice + Rohrer RCT",
  "verified", "high", "v1",
  "ic=2; leverage=4.",
  ["LP-31", "KG-03"])

F("missed_problem_bookmarks", "review_and_recall", ["NEW"], "unique", "review",
  "Auto-collect missed items and allow manual bookmarks; review them later as a set.",
  "Requested by users; personal review list.",
  "attempt log, bookmark taps", "bookmarks list / set",
  ["attempt_event_log"], "3 2 3 5 3 1 1 1 4 3 2", "defer",
  "User-requested; trivial; scheduler already covers most of the value. Promote in v1.x polish.",
  "user request (LP-33)",
  "recommended", "high", "v1.x",
  "ic=1; differentiation=3.",
  ["LP-33"])

# ───────────────────────────── personalization_and_paths ─────────────────────────────
F("knowledge_state_model", "personalization_and_paths", ["B26", "NEW"], "weak_substitute", "processing",
  "Per-concept ability theta (Elo/PFAE with uncertainty function), item difficulty frozen from generator features, EMA-based mastery with separate 'mastered' promotion after spaced retrieval.",
  "The app knows what you know: the basis of dynamic lessons and paths.",
  "assessed attempts, item difficulty", "theta, uncertainty, mastery state per concept",
  ["attempt_event_log", "concept_skill_graph", "difficulty_from_solver_trace"], "5 5 5 3 5 4 3 2 5 5 5", "merge",
  "Brilliant describes 'user knowledge modeling' and next-problem prediction with population recommenders; single-user needs PFAE-Elo (no fitting) + EMA mastery. DKT is unsuitable without data.",
  "merge: B26 knowledge modeling intent + Pelánek PFAE-Elo + EMA mastery criterion",
  "recommended", "medium", "v1",
  "leverage/expansion=5; ic=4; privacy=2 (local).",
  ["ENG-05", "LM-01", "LM-02", "LM-03", "LM-07"])

F("next_best_task_scheduler", "personalization_and_paths", ["B26", "NEW"], "weak_substitute", "processing",
  "Chooses the next lesson/review/item from outer fringe + due reviews, scored by urgency, compression, goal relevance, and interleave bonus; targets 75-85% predicted success.",
  "Always the right next challenge: Brilliant's own data says this drives engagement more than game mechanics.",
  "knowledge state, FSRS queue, goals, graph", "ranked next tasks",
  ["knowledge_state_model", "spaced_review_scheduler", "concept_skill_graph"], "5 5 5 4 5 4 3 1 5 5 5", "merge",
  "Primary = B26 'predict optimal next problem X' intent; implement with KST fringe + FIRe-style compression + desirable-difficulty band.",
  "merge: B26 next-problem prediction intent + KST outer fringe + Math Academy task selection",
  "recommended", "medium", "v1",
  "differentiation/leverage=5; ic=4.",
  ["ENG-05", "ENG-06", "KG-01", "KG-04", "SR-05"])

F("dynamic_path_insertion", "personalization_and_paths", ["B26"], "unique", "organization",
  "The scheduler inserts nodes into a course path (warm-ups, remediation, reviews) and skips mastered lessons; the path re-renders per learner.",
  "Paths that bend to what you know: the user's requested 'dynamic lessons/paths'.",
  "scheduler output", "personalized gameboard",
  ["next_best_task_scheduler", "course_level_lesson_hierarchy"], "5 4 5 4 5 3 3 1 5 5 4", "keep",
  "Observed hooks (gameboardV2 includeInsertions, Level.insertion); generalize them to full knowledge-aware path rendering.",
  "B26 gameboard insertions (observed), generalized",
  "observed", "high", "v1",
  "differentiation=5 (beyond Brilliant's fixed insertions); ic=3.",
  ["OBS-B", "OBS-H"])

F("remediation_branching", "personalization_and_paths", ["NEW"], "unique", "processing",
  "When a learner stalls on X (2 halted attempts or repeated misconception), insert diagnostic items on X's highest-weight prerequisites up to 2 hops back, then return.",
  "Fix the real gap instead of repeating the same lesson.",
  "failure events, graph", "inserted remediation nodes",
  ["dynamic_path_insertion", "concept_skill_graph", "knowledge_state_model"], "5 3 5 4 4 3 2 1 5 4 4", "keep",
  "Brilliant only offers 'new practice problems' after a failed Skills Check; prerequisite remediation is a proven pattern (Math Academy, Oppia branches).",
  "Math Academy remedial reviews + Oppia misconception branches",
  "recommended", "medium", "v1",
  "differentiation=5; ic=3.",
  ["HC-04", "SR-05", "OSS-53"])

F("ask_to_route", "personalization_and_paths", ["B26"], "overlapping", "input",
  "Free-text 'What do you want to learn?' mapped onto skill-graph nodes, returning a starting lesson/practice or a proposed path.",
  "Learn what you need right now without knowing course names.",
  "free text", "matched nodes + start point",
  ["concept_skill_graph", "llm_provider_adapter"], "4 3 3 5 4 2 2 2 5 4 4", "keep",
  "Verified (Ask Koji, math-only, web-only); extend to all subjects; same entry point as custom paths.",
  "B26 Ask Koji routing",
  "verified", "high", "v1",
  "ic=2 with LLM classification over a closed node list; privacy=2 (query may go to cloud LLM).",
  ["HC-18", "LP-41", "ENG-25"])

F("custom_topic_path_generation", "personalization_and_paths", ["B26", "NEW"], "weak_substitute", "processing",
  "For any user-requested topic: retrieve open-textbook grounding, LLM proposes concepts and edges (structured output), external critics validate (DAG, textbook order, coverage), user edits the graph, a deterministic planner orders the path, and generators or generic primitives fill lessons.",
  "Learn anything in STEM, not just what a catalog offers: the user's headline improvement and the route back to breadth.",
  "topic request, optional source texts", "editable concept graph + planned path + generated lessons",
  ["concept_skill_graph", "llm_provider_adapter", "automated_puzzle_evals", "next_best_task_scheduler"],
  "5 3 5 4 5 5 4 2 5 3 5", "merge",
  "Primary = B26 Ask Koji routing (limited to existing math curriculum); extend with LLM graph proposal + deterministic planning (LLMs plan paths poorly: 29.5% pass) + external validation (LLM prerequisite flaws are invisible to LLM judges). Phased: path + generic-primitive lessons first, simulator lessons where a domain generator exists.",
  "merge: B26 Ask Koji + LLM graph proposal + KST/topological deterministic planner",
  "recommended", "medium", "v1",
  "ic=5: hardest feature; privacy=2: topic requests to cloud LLM; mvp_fit=3: ships late-MVP in reduced form.",
  ["HC-18", "LC-01", "LC-02", "LC-04", "LC-05", "LC-06"])

F("adaptive_lesson_shape", "personalization_and_paths", ["NEW"], "unique", "processing",
  "Per-learner lesson variant: question-first when prerequisites are mastered, worked-example-with-backward-fading when brand new, collapsed explanations for experts.",
  "Dynamic lessons: same objective, different route depending on what you know.",
  "knowledge state + first-step diagnostic", "lesson page sequence variant",
  ["knowledge_state_model", "lesson_document_format"], "4 4 5 3 4 3 3 1 4 3 4", "defer",
  "Strong evidence (expertise reversal, productive-failure prerequisites) but needs two authored/generated shapes per lesson. Promote after the base player and generators are stable.",
  "Kalyuga rapid diagnostics + Renkl backward fading",
  "recommended", "medium", "v1.x",
  "differentiation=5; mvp_fit=3; ic=3.",
  ["PE-04", "PE-05"])

# ───────────────────────────── tutoring ─────────────────────────────
F("ai_tutor_core", "tutoring", ["B26"], "unique", "processing",
  "Socratic tool-calling tutor grounded in live lesson state (widget state, attempt history, pauses) with per-concept tutor notes; never gives the answer before bottom-out; withdraws in check/assessment.",
  "One-on-one help exactly where you're stuck.",
  "lesson event log, item config + solver solution, tutor notes", "short guiding replies + tool calls",
  ["lesson_player_state_machine", "interaction_primitive_contract", "llm_provider_adapter", "tutor_math_verification"],
  "5 4 5 4 5 4 4 3 5 4 5", "keep",
  "Koji is Brilliant's 2026 centerpiece; the architecture (constrained LLM over deterministic lesson state, expert tutor notes, short replies) is documented. Safeguarded tutors avoid the 17% exam harm seen with unconstrained GPT.",
  "B26 Koji: constrained LLM over deterministic lesson infrastructure",
  "verified", "high", "v1",
  "ic=4, mb=4 (prompts/evals); privacy=3: lesson context to a cloud LLM unless local model; differentiation=5.",
  ["ENG-02", "ENG-03", "ENG-04", "ENG-31", "PE-06", "PG-04"])

F("socratic_hint_ladder", "tutoring", ["B26", "NEW"], "complementary", "output",
  "On-demand pointing hint, then teaching hint (the principle), then bottom-out; only bottom-out counts as failure for mastery.",
  "Help that keeps you doing the thinking.",
  "item, learner state", "graded hint sequence",
  ["ai_tutor_core", "misconception_targeted_hints"], "5 4 4 5 4 2 2 1 5 5 3", "merge",
  "Primary = B26 Koji 'asks instead of tells'; add Andes 3-level ladder semantics and the mastery accounting rule.",
  "merge: B26 Koji Socratic policy + Andes pointing/teaching/bottom-out ladder",
  "verified", "high", "v1",
  "ic=2: deterministic ladder with optional LLM phrasing.",
  ["ENG-31", "PE-03", "PE-01"])

F("canvas_annotation_tools", "tutoring", ["B26"], "unique", "output",
  "Tutor tools that act on the interactive: highlight a component, draw/annotate, add a point, pose an intermediate question, swap to a simpler variant.",
  "Show, don't tell: the tutor points at the exact thing.",
  "tool calls referencing widget element ids", "overlay annotations, inserted mini-question",
  ["interaction_primitive_contract", "ai_tutor_core"], "5 3 5 4 4 4 3 1 5 3 5", "keep",
  "The 'graphical tutor' differentiator; needs describeForTutor/highlightTargets on every primitive. MVP: highlight + annotate; v1.x: rearrange, intermediate question.",
  "B26 Koji highlight/annotate/rearrange; perfect-freehand (MIT) for ink",
  "verified", "high", "v1",
  "differentiation=5; ic=4; mvp_fit=3 (reduced set).",
  ["ENG-02", "ENG-32", "OSS-18"])

F("tutor_math_verification", "tutoring", ["NEW"], "unique", "processing",
  "Every number/expression in tutor text is checked against the CAS/solver before display; tutor receives the solver's step-by-step solution in context.",
  "A tutor that doesn't make math mistakes.",
  "tutor draft text + solver solution", "verified or regenerated text",
  ["answer_expectations_checker"], "5 4 4 3 4 3 2 1 5 5 3", "keep",
  "Brilliant claims accuracy 'technology' without detail; Khanmigo routes math through a calculator; Kestin RCT enriched prompts with expert solutions; wrong spoken numbers are 'catastrophic'.",
  "Khan calculator routing + Kestin solution-in-context + Brilliant evals ethos",
  "recommended", "medium", "v1",
  "ic=3; user_value=5 (trust).",
  ["ENG-08", "PG-04", "PG-05"])

F("tutor_fading_policy", "tutoring", ["B26"], "unique", "processing",
  "More help on new concepts, less as mastery rises; silent during check, review, and level-check items.",
  "Builds independence, not dependency.",
  "mastery state, phase", "help availability level",
  ["ai_tutor_core", "knowledge_state_model"], "4 4 4 4 3 1 1 1 4 5 2", "keep",
  "Verified Koji behavior and observed (no Koji in check phase); trivial policy.",
  "B26 Koji fading (verified, observed)",
  "verified", "high", "v1",
  "ic=1.",
  ["ENG-02", "OBS-E"])

F("tutor_voice_io", "tutoring", ["B26"], "overlapping", "input",
  "Tutor speaks first on each page (what changed), reads problems aloud, accepts voice questions; local STT/TTS option.",
  "Lowers the barrier to asking; accessibility for reading load.",
  "audio", "speech + transcripts",
  ["ai_tutor_core"], "4 3 4 4 3 4 3 3 3 2 4", "defer",
  "Brilliant found voice 'essential' in testing, but it adds TTS/STT stacks and number-verification of speech. Kokoro (Apache-2.0) + whisper.cpp (MIT) viable locally. Promote after text tutor is stable.",
  "B26 Koji voice (ElevenLabs) re-done with Kokoro + whisper.cpp",
  "verified", "medium", "v1.x",
  "ic=4; privacy=3 (microphone); mvp_fit=2.",
  ["ENG-08", "HC-19", "OSS-37", "OSS-38"])

F("tutor_character", "tutoring", ["B26"], "overlapping", "output",
  "Animated tutor avatar with a state machine (idle, wave, nod, react-easy, react-struggle, celebrate) and speaking amplitude.",
  "Students ask 'dumb' questions more freely with a character than a chat box.",
  "tutor events", "avatar animation",
  ["ai_tutor_core"], "3 5 3 5 2 3 3 1 3 2 2", "defer",
  "Brilliant's testing favored a character; MVP uses a simple static/CSS avatar; full rig later (Rive authoring now needs a paid plan, so use Lottie/CSS/SVG).",
  "B26 Koji Rive rig; re-implemented with SVG/Motion",
  "verified", "medium", "v1.x",
  "ic=3 (assets); workflow_leverage=2; mvp_fit=2.",
  ["ENG-09", "OSS-15", "OSS-16"])

F("tutor_mute_and_verdict_channel", "tutoring", ["B26"], "unique", "output",
  "Mute tutor chatter while keeping a minimal correct/incorrect verdict channel.",
  "Focus without losing feedback.",
  "setting toggle", "verdict-only feedback",
  ["ai_tutor_core", "immediate_verdict_feedback"], "3 3 2 5 2 1 1 1 3 5 1", "keep",
  "Verified Koji behavior; trivial.",
  "B26 Koji mute",
  "verified", "high", "v1",
  "ic=1; differentiation=2; leverage=2.",
  ["HC-17", "LP-21"])

# ───────────────────────────── content_production ─────────────────────────────
F("lesson_document_format", "content_production", ["B26"], "unique", "organization",
  "Typed, declarative lesson documents (pages of cards/problems referencing widget configs by id), validated by schema; diffable and LLM-generatable; optional branching edges.",
  "Lessons that can be generated, validated, versioned, and adapted.",
  "lesson source (JSON/YAML validated by Zod)", "runtime lesson model",
  [], "4 5 4 3 5 3 2 1 5 5 5", "keep",
  "Brilliant drafts lessons in Camperdown (strict markup compiled to an app) and calls the lesson 'a layout engine that supports modules' with branching; a typed doc is the generation target.",
  "B26 Camperdown markup + module layout engine",
  "observed", "high", "core",
  "leverage/expansion=5; ic=3.",
  ["ENG-13", "LP-15"])

F("parameterized_puzzle_generators", "content_production", ["B26"], "unique", "processing",
  "Per-skill generators that sample parameters within published ranges, compute answers deterministically, and expose difficulty radicals and misconception rules.",
  "Unlimited correct practice; breadth becomes cheap.",
  "generator params, seed", "item config + answer + solution steps",
  ["interaction_primitive_contract", "answer_expectations_checker"], "5 5 5 3 5 4 4 1 5 5 5", "keep",
  "Brilliant's game types are parameterized generators; the K-5 contract (rule-based per skill, fresh set each open, validity rules) is the default path.",
  "B26 generator APIs + K-5 generator contract",
  "verified", "high", "core",
  "leverage/expansion=5; ic=4, mb=4 per domain.",
  ["ENG-17", "ENG-20", "HC-27"])

F("llm_config_generation", "content_production", ["B26"], "unique", "processing",
  "LLM emits puzzle/lesson configs in an LLM-friendly representation under JSON-schema-constrained output (Claude structured outputs or Ollama format), never free-form UI.",
  "New lessons for any topic in minutes.",
  "designer/user intent, schema, golden examples", "candidate configs",
  ["llm_provider_adapter", "lesson_document_format"], "4 3 5 3 5 3 3 2 5 4 5", "keep",
  "Brilliant: representation redesign took gear-train generation from 0% to 93%; constrained decoding guarantees schema validity (not semantic validity).",
  "B26 LLM content agent + Zod > JSON Schema > constrained decoding",
  "verified", "high", "v1",
  "differentiation=5; privacy=2 (prompts to cloud unless local model).",
  ["ENG-19", "ENG-20", "LC-06", "OSS-24"])

F("automated_puzzle_evals", "content_production", ["B26"], "unique", "review",
  "Gate every generated item: math correctness (CAS simplify + numeric sampling), unique solvability (solver counting to 2), simulation consistency, impossible states, visual overlap, physical plausibility. Failures never reach the learner.",
  "100% correct content: 'almost right is catastrophically wrong'.",
  "candidate configs", "pass/fail with reasons; regression corpus",
  ["parameterized_puzzle_generators", "answer_expectations_checker", "simulation_primitive_library"],
  "5 5 4 2 5 4 4 1 5 5 4", "keep",
  "Brilliant's six eval dimensions; external checks are required because LLM self-correction doesn't fix reasoning errors.",
  "B26 evals framework + MathCAMPS back-translation + SymPy dual check",
  "verified", "high", "core",
  "ic=4, mb=4; comprehensibility=2 (internal).",
  ["ENG-19", "LC-05", "PG-01", "PG-02"])

F("curator_review_queue", "content_production", ["B26"], "weak_substitute", "review",
  "Generated lessons/paths enter a preview queue where the user (as curator) can playtest, edit, accept, or reject before they enter the catalog; auto-accept allowed for eval-passing items in known generators.",
  "Human-in-the-loop quality without a staff team.",
  "eval-passing candidates", "accepted content",
  ["automated_puzzle_evals"], "3 2 3 4 4 2 2 1 4 4 3", "keep",
  "Brilliant's human review rounds are essential; in a single-user app the learner is the curator, with auto-accept for proven generators.",
  "B26 multi-round human review, adapted to a single user",
  "inferred", "medium", "v1",
  "frequency=2; ic=2.",
  ["ENG-20", "ENG-18"])

F("difficulty_from_solver_trace", "content_production", ["NEW"], "unique", "processing",
  "Item difficulty (logit) computed from generator radicals and solver trace (steps, operation complexity, dependency depth); no population data needed.",
  "Right-sized challenge from session one.",
  "item config + solver trace", "difficulty d_i",
  ["parameterized_puzzle_generators"], "4 5 4 2 5 3 2 1 5 4 4", "keep",
  "Required by the single-user knowledge model (co-estimating difficulty drifts under adaptive selection); solver-trace difficulty correlated r=0.95 with human solving time for Sudoku.",
  "Pelánek solver-trace difficulty + LLTM radicals",
  "recommended", "medium", "core",
  "leverage=5; comprehensibility=2 (internal).",
  ["PG-07", "LM-03"])

F("misconception_distractors", "content_production", ["B26", "NEW"], "complementary", "processing",
  "Distractors and wrong-state classifiers come from per-skill misconception rules, never free LLM text.",
  "Wrong options that reveal real misunderstandings.",
  "misconception rule set per skill", "distractors + diagnosis labels",
  ["parameterized_puzzle_generators"], "4 5 4 3 4 2 2 1 5 5 3", "keep",
  "Brilliant skill guides list common mistakes; 49% of raw LLM MCQs are flawed, so rule-derived distractors are required.",
  "B26 K-5 skill-guide misconceptions + K-5 'nearby choices' rule",
  "verified", "high", "core",
  "ic=2; leverage=4.",
  ["HC-26", "LP-32", "PG-06"])

F("golden_example_library", "content_production", ["B26"], "unique", "organization",
  "Hand-checked exemplar items/lessons per generator used as few-shot anchors and regression tests.",
  "Keeps generated content on-voice and on-standard.",
  "curated items", "few-shot set, tests",
  ["lesson_document_format"], "3 2 3 4 4 2 2 1 4 5 3", "keep",
  "Brilliant scales 'from hand-selected golden examples to AI generation at scale'.",
  "B26 Producer (AI Tooling) golden examples",
  "observed", "medium", "core",
  "frequency=2 (internal); ic=2.",
  ["ENG-18"])

F("simulation_primitive_library", "content_production", ["B26", "BL"], "complementary", "processing",
  "Shared deterministic simulators: DC circuit nodal analysis, digital logic, statics/moments (mobiles, balances), gear trains, 2D ray optics, kinematics/orbit integrator, reaction kinetics/equilibrium, molecule validation (RDKit), qubit circuits.",
  "Real behavior for every science domain; correctness and consequence feedback for free.",
  "domain config", "simulated state/outcome + checks",
  ["interaction_primitive_contract"], "5 4 5 3 5 5 4 1 5 3 5", "merge",
  "B26 has circuits, gears, mobiles, pool, optics, structures (Scientific Thinking games); BL breadth needs kinetics, orbits, molecules, quantum. Build in-house small solvers, cross-check with ngspice-WASM/Planck.js; avoid GPL CircuitJS and NC PhET. MVP = DC circuits + balance/statics.",
  "merge: B26 puzzle-science game engines + BL domain coverage, implemented with small TS solvers",
  "observed", "high", "core",
  "ic=5, mb=4 overall (per-domain incremental); mvp_fit=3 (two simulators in MVP).",
  ["CH-15", "CH-29", "ENG-19", "OSS-42", "OSS-43", "OSS-51"])

F("answer_expectations_checker", "content_production", ["B26"], "unique", "processing",
  "Composable validators over MathJSON values with field-level messages (integer required, point on line, unique values, equivalent expression, unit-aware numeric tolerance).",
  "Precise, fair checking of typed answers.",
  "learner value + item expectations", "verdict + per-field feedback",
  [], "5 5 4 3 5 3 2 1 5 5 4", "keep",
  "Brilliant's 'expectations' library over MathJSON; Compute Engine (MIT) isIdenticallyEqual() (symbolic + random-point sampling, may return undefined) for fast checks, SymPy-in-Pyodide as fallback when undefined, math.js for units.",
  "B26 expectations library; Cortex Compute Engine + SymPy + math.js",
  "observed", "high", "core",
  "leverage=5; ic=3.",
  ["ENG-15", "OSS-07", "OSS-08", "OSS-10"])

# ───────────────────────────── motivation_and_habit ─────────────────────────────
F("daily_streak_with_charges", "motivation_and_habit", ["B26"], "overlapping", "output",
  "Daily streak (3 assessed-or-learn problems or 1 lesson), lit at the moment of qualification; up to 2 streak charges auto-applied on a missed day; week strip.",
  "A gentle daily habit with forgiveness.",
  "daily activity", "streak count, charges, toasts",
  ["attempt_event_log"], "3 5 2 5 3 1 1 1 3 4 2", "keep",
  "Verified + observed; cheap; keep low-key (Brilliant's own data: game mechanics 'barely made a dent').",
  "B26 streak + Streak Charge rules",
  "verified", "high", "v1",
  "differentiation=2, ic=1; frequency=5.",
  ["OBS-I", "HC-14", "ENG-06"])

F("xp_points", "motivation_and_habit", ["B26"], "overlapping", "output",
  "15 XP per correct item, lesson (~+20) and practice (~+10) completion bonuses, no XP for same-day repeats.",
  "Visible effort currency.",
  "attempt outcomes", "XP totals",
  ["attempt_event_log"], "2 5 1 5 2 1 1 1 3 4 1", "keep",
  "Observed values; trivial; secondary motivator.",
  "B26 XP (observed values)",
  "observed", "high", "v1",
  "user_value=2, differentiation=1, ic=1.",
  ["OBS-G", "HC-15"])

F("weekly_leagues", "motivation_and_habit", ["B26"], "unique", "output",
  "30-person weekly XP leaderboards, 10 tiers, top-10 promote / bottom-5 demote.",
  "Social competition.",
  "XP, other users", "rank",
  [], "1 3 1 4 1 4 4 4 1 1 1", "drop",
  "Out of scope: single-user local app has no other learners; multiplayer needs a server, accounts, and other people's data (privacy risk). Replace with personal_best_weeks.",
  "n/a",
  "observed", "high", "none",
  "user_value=1 single-user; privacy=4 (other users' data); ic=4 (server).",
  ["OBS-I", "HC-15"])

F("personal_best_weeks", "motivation_and_habit", ["NEW"], "obsolete", "output",
  "Compete against your own past weeks (XP, mastery gained, reviews kept) instead of other people.",
  "Competition without other users.",
  "weekly aggregates", "self-comparison card",
  ["xp_points", "progress_dashboard"], "2 2 2 5 2 1 1 1 3 2 2", "defer",
  "Cheap replacement for leagues; low value, so v1.x polish.",
  "replacement for B26 leagues",
  "recommended", "medium", "v1.x",
  "user_value=2; ic=1; mvp_fit=2.",
  ["HC-15"])

F("celebration_chain", "motivation_and_habit", ["B26"], "overlapping", "output",
  "Declarative post-session event queue (lesson complete > XP > streak > charge), each skippable, collapsed to one line in focus mode.",
  "Satisfying closure without nagging.",
  "session events", "celebration screens",
  ["xp_points", "daily_streak_with_charges"], "3 5 2 5 2 2 2 1 3 3 2", "keep",
  "Observed chain; long-time users find heavy gamification 'twee', so make every step skippable and add focus mode.",
  "B26 end chain (observed) + focus mode",
  "observed", "high", "v1",
  "differentiation=2; ic=2.",
  ["OBS-C", "OBS-I", "LP-27", "LP-36"])

F("path_node_visualization", "motivation_and_habit", ["B26"], "overlapping", "organization",
  "Vertical trail of node pads per course (lesson, practice, review, check, inserted nodes) with status, color by domain, and a gold pad on completion.",
  "See progress and what's next at a glance.",
  "gameboard state", "path UI",
  ["course_level_lesson_hierarchy"], "4 5 2 5 4 2 2 1 5 5 3", "keep",
  "Observed; the visual home for dynamic paths.",
  "B26 gameboard UI (observed)",
  "observed", "high", "core",
  "ic=2; differentiation=2.",
  ["OBS-J", "ENG-10"])

F("local_reminders", "motivation_and_habit", ["B26"], "overlapping", "output",
  "Local notifications for daily practice and due reviews at a user-set time; no league/marketing reminders.",
  "Nudges at the right time without spam.",
  "settings, due queue", "OS notification",
  ["spaced_review_scheduler"], "3 4 2 5 3 2 2 1 4 3 2", "defer",
  "Brilliant documents four categories but no reminder time; local reminders need the desktop shell. Promote when the Electron/PWA shell lands.",
  "B26 notification categories, adapted",
  "verified", "high", "v1.x",
  "ic=2 (shell-dependent); mvp_fit=3.",
  ["HC-11"])

F("focus_mode", "motivation_and_habit", ["NEW"], "unique", "output",
  "One toggle that hides gamification chrome, skips celebrations, and mutes sounds.",
  "Serious learners keep the pedagogy without the confetti.",
  "setting", "minimal UI",
  ["celebration_chain"], "3 3 3 5 2 1 1 1 3 4 1", "keep",
  "HN complaints about 'twee gamification'; trivial.",
  "user complaint LP-36",
  "recommended", "high", "v1",
  "ic=1.",
  ["LP-36"])

# ───────────────────────────── progress_and_reflection ─────────────────────────────
F("attempt_event_log", "progress_and_reflection", ["B26"], "unique", "processing",
  "Append-only local log of every answer, hint request, reveal, pause, and session event with phase, item config hash, and timing.",
  "Everything adaptive and every stat is derived from one honest record.",
  "player events", "SQLite rows",
  ["lesson_player_state_machine"], "4 5 3 3 5 2 2 3 5 5 4", "keep",
  "Brilliant logs 'every answer choice, hint click, and session event'; local-only storage keeps privacy risk contained.",
  "B26 interaction logging (job post)",
  "observed", "high", "core",
  "leverage=5; privacy=3: detailed behavioral data, mitigated by local-only storage.",
  ["ENG-07", "OBS-B"])

F("progress_dashboard", "progress_and_reflection", ["B26"], "overlapping", "review",
  "Activities completed, assessment accuracy with week-over-week delta, problems solved chart, ranges (week/month/year/all), per-course lesson scores, skills learned.",
  "See growth over time.",
  "event log aggregates", "dashboard",
  ["attempt_event_log", "open_learner_model"], "3 2 2 5 3 2 2 1 4 4 3", "keep",
  "Observed (/you page); straightforward aggregates.",
  "B26 You page (observed)",
  "observed", "high", "v1",
  "frequency=2; ic=2.",
  ["OBS-I", "HC-42"])

F("weekly_summary_narrative", "progress_and_reflection", ["B26"], "unique", "review",
  "Natural-language weekly summary of what was learned and what's next.",
  "A human-readable reflection prompt.",
  "weekly aggregates", "summary paragraph",
  ["progress_dashboard", "llm_provider_adapter"], "2 2 2 5 2 1 2 2 3 2 2", "defer",
  "Observed but low value; trivial template version possible later.",
  "B26 weekly summary card (observed)",
  "observed", "high", "v1.x",
  "user_value=2; ic=1.",
  ["OBS-I"])

F("progress_reset_controls", "progress_and_reflection", ["B26"], "weak_substitute", "organization",
  "Reset a lesson, a level ('reset from here'), or a whole course, all reversible via snapshots.",
  "Restart cleanly without losing history forever.",
  "reset command", "snapshot + reset state",
  ["attempt_event_log"], "2 1 2 4 2 2 2 1 2 3 1", "defer",
  "Brilliant lacks whole-course reset and its level reset is irreversible; cheap with local snapshots. v1.x.",
  "B26 reset (verified) improved with snapshots",
  "verified", "high", "v1.x",
  "user_value=2, frequency=1.",
  ["HC-08"])

F("parent_and_educator_dashboards", "progress_and_reflection", ["B26"], "unique", "review",
  "Supervised child accounts, family dashboards, classrooms, assignments, rostering.",
  "Oversight for parents/teachers.",
  "multiple accounts", "dashboards",
  [], "1 1 1 4 1 5 4 5 1 1 2", "drop",
  "Out of scope for a single-user local app; requires multi-account server, rostering, and minors' data.",
  "n/a",
  "verified", "high", "none",
  "privacy=5 (minors' data); ic=5; user_value=1 for this user.",
  ["HC-40", "HC-41", "HC-42"])

# ───────────────────────────── platform_and_access ─────────────────────────────
F("local_first_offline", "platform_and_access", ["BL", "NEW"], "complementary", "organization",
  "All content, progress, and generation caches live in a local SQLite database; works fully offline except optional cloud-LLM features.",
  "Own your data; learn anywhere; no paywall keys.",
  "local files", "offline app",
  [], "5 5 5 4 4 3 2 1 5 5 3", "keep",
  "B26 requires a connection; BL once had offline mode; K-5 already stores progress on-device. Core user requirement ('locally').",
  "BL offline mode + B26 K-5 device-only progress",
  "observed", "high", "core",
  "differentiation=5 vs B26; privacy=1 (best case).",
  ["HC-13", "LP-42", "HC-26"])

F("llm_provider_adapter", "platform_and_access", ["NEW"], "unique", "processing",
  "One interface over Claude (cloud, best quality) and Ollama/llama.cpp (local, offline) with schema-constrained output, per-feature provider choice, and graceful degradation.",
  "AI features work offline when needed and best-in-class when online.",
  "prompts, schemas", "typed responses",
  [], "4 5 4 3 5 3 3 3 5 5 4", "keep",
  "Required by tutor, generation, and routing; Brilliant is 'fairly model agnostic'. Anthropic SDK must run server-side (browser use disabled by default).",
  "Anthropic TS SDK + Ollama structured outputs behind one adapter",
  "recommended", "high", "v1",
  "privacy=3: cloud provider receives prompts (user opt-in, keys local); leverage=5.",
  ["ENG-04", "OSS-32", "OSS-35", "OSS-24"])

F("accessibility_baseline", "platform_and_access", ["NEW"], "unique", "organization",
  "Keyboard alternatives to every drag, screen-reader labels from describeForTutor, non-color verdict cues, adjustable text size, reduced motion, dark mode.",
  "Usable by everyone, including when tired or on a phone.",
  "primitive metadata", "accessible UI",
  ["interaction_primitive_contract"], "4 5 4 4 3 3 3 1 4 4 3", "keep",
  "Brilliant documents no accessibility features (App Store declares none); building it into the primitive contract is cheap now, expensive later.",
  "gap in B26 (HC-19, HC-20)",
  "recommended", "high", "core",
  "differentiation=4; ic=3.",
  ["HC-19", "HC-20", "OBS-A"])

F("code_execution_sandbox", "platform_and_access", ["B26"], "overlapping", "processing",
  "Offline Python execution (Pyodide in a Web Worker) with output, traces, and hidden tests; SymPy available as CAS.",
  "Run code and heavy math locally.",
  "code", "output, trace, test results",
  [], "4 3 3 3 4 3 3 1 4 2 4", "defer",
  "Needed for CS lessons and as authoritative CAS; heavy (200+ MB full distro). MVP uses Compute Engine for math; promote with CS track.",
  "Pyodide (MPL-2.0) in a worker",
  "verified", "high", "v1.x",
  "mvp_fit=2; ic=3.",
  ["OSS-10", "LP-10"])

F("cross_device_sync", "platform_and_access", ["B26"], "overlapping", "organization",
  "Optional sync of the local database between the user's devices.",
  "Continue on phone where you left off on desktop.",
  "local DB", "synced DB",
  ["local_first_offline"], "3 3 2 4 2 4 4 3 3 1 3", "defer",
  "B26 syncs via accounts; for a local app it needs a sync layer or file-based sync. Promote when a mobile client exists.",
  "B26 cross-device progress",
  "verified", "high", "v2",
  "ic=4; privacy=3; mvp_fit=1.",
  ["HC-13"])

F("accounts_and_paywall", "platform_and_access", ["B26"], "obsolete", "input",
  "Accounts, 2-keys/day metering, Premium paywall, upsell screens, interstitial ads, gifts and family plans.",
  "Revenue for Brilliant; friction for learners.",
  "payments", "gated access",
  [], "1 5 1 4 1 3 3 4 1 1 1", "drop",
  "Out of scope and harmful to learning (keys cap practice; warm-ups cost keys); a personal local app has no monetization.",
  "n/a",
  "observed", "high", "none",
  "user_value=1; privacy=4 (payment, ad tracking).",
  ["OBS-K", "HC-07"])

# ───────────────────────────── reference_and_community ─────────────────────────────
F("concept_reference_notes", "reference_and_community", ["BL"], "unique", "output",
  "Per-concept reference page (definition, key formulas, worked example, links to lessons), separate from lessons; doubles as the tutor's retrieval corpus.",
  "Look things up without replaying a lesson; reviewers keep their own notes today.",
  "concept graph + generated/verified text", "reference pages",
  ["concept_skill_graph", "llm_config_generation"], "4 3 4 5 4 2 2 1 4 3 4", "defer",
  "BL wiki survives read-only because reference outlives course rewrites; reviewers ask for reference material. Promote in v1.x with the tutor retrieval work.",
  "BL community wiki (topic names only, fresh content)",
  "verified", "medium", "v1.x",
  "differentiation=4; mvp_fit=3.",
  ["CH-34", "HC-35", "LP-34"])

F("user_authored_problems", "reference_and_community", ["BL"], "unique", "input",
  "The user writes or edits problems/lessons through the same typed format and eval gate.",
  "Make your own practice; extend the catalog.",
  "author input", "validated content",
  ["lesson_document_format", "automated_puzzle_evals", "curator_review_queue"], "3 1 3 3 3 3 3 1 4 1 4", "defer",
  "BL community authored 100k+ problems; for one user it's a power feature. v2.",
  "BL community problems, single-user form",
  "observed", "medium", "v2",
  "frequency=1; mvp_fit=1.",
  ["CH-30", "CH-31"])

F("community_discussion_voting", "reference_and_community", ["BL"], "obsolete", "output",
  "Public discussion threads, solution voting, and solver counts.",
  "Social learning.",
  "other users", "threads",
  [], "1 1 1 4 1 4 4 4 1 1 1", "drop",
  "Superseded: single-user app has no community; the value (alternative explanations) is merged into multi_depth_explanations.",
  "n/a",
  "observed", "high", "none",
  "user_value=1; privacy=4; ic=4 (server + moderation).",
  ["CH-30", "LP-35"])
