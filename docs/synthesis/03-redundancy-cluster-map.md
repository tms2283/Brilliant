# Redundancy cluster map (Artifact 3)

Overlap labels:
- **unique:** one source.
- **overlapping:** both eras.
- **complementary:** the eras combine.
- **weak_substitute:** Brilliant has a degraded form of a stronger pattern.
- **obsolete:** superseded.

Per-feature detail is in `02-feature-matrix.md`.

| Cluster | Competing / combining features | Relationship | Cluster decision |
|---|---|---|---|
| **curriculum_structure** | `concept_skill_graph` (B26 skill ids ⊕ BL cross-domain course graph) · `learning_path_catalog` · `course_level_lesson_hierarchy` · `content_versioning_and_archive` · `broad_stem_catalog` · `coverage_audit_view` · `standards_alignment_mapping` | The skill graph **supersedes** fixed paths: paths become views over the graph. Versioning fixes B26's silent retirement | **Merge** into a skill-graph backbone. Breadth is kept (one domain in core). Coverage audit deferred to v1.x, standards to v2 |
| **lesson_experience** | `lesson_learn_phase` + `lesson_check_phase` (complementary) · `action_first_sequencing` · `escalating_configuration_sequence` · `concept_and_takeaway_cards` · `typed_lesson_modes` (BL) · `daily_problem` (BL) | Learn and check are complementary halves. BL lesson modes and daily problems extend them | **Keep** B26's lesson anatomy as-is. Defer BL modes and daily problem to v1.x |
| **interaction_primitives** | `interaction_primitive_contract` (spine) · toggle / choice / math input / drag / slider (core) · graph point / ordering (v1) · token-slot / free code / blocks (later) | All primitives implement one contract. Code editors overlap; token-slot is the mobile-first subset of the free editor | **Keep** the contract plus science-first primitives. Code primitives deferred until the CS track |
| **feedback_and_explanation** | `immediate_verdict_feedback` · `consequence_simulation_feedback` · `misconception_targeted_hints` · `retry_and_reveal_controls` · `multi_depth_explanations` (B26 Why? ⊕ BL voted explanations) · `report_problem_quarantine` | BL community explanations are **obsolete** as a social feature but survive as generated alternatives. The report flag is upgraded to a QA loop | **Keep** everything. Merge explanations |
| **assessment_and_mastery** | `assessment_only_measurement` · `level_review_set` · `level_check_test_out` · `adaptive_placement_diagnostic` (B26 ⊕ BL 5-level probe) · `open_learner_model` (NEW) | Placement: B26's opaque diagnostic and BL's 5-difficulty probe **combine** with KST fringe selection | **Keep / merge**. Soft gating only |
| **review_and_recall** | `lesson_practice_set` · `warm_up_retrieval` · `variation_generator` · `spaced_review_scheduler` · `interleaved_practice` · `missed_problem_bookmarks` | B26 "personalized practice" is a **weak substitute** for concept-level FSRS + FIRe. Bookmarks overlap with the scheduler | **Merge** into one scheduler-driven review system. Bookmarks deferred |
| **personalization_and_paths** | `knowledge_state_model` · `next_best_task_scheduler` · `dynamic_path_insertion` · `remediation_branching` · `ask_to_route` · `custom_topic_path_generation` · `adaptive_lesson_shape` | B26 has hooks (insertions, Ask Koji, next-problem prediction) but population recommenders. Single-user patterns replace them (weak_substitute → merge) | **Merge**. This cluster is the headline improvement. Adaptive lesson shape deferred |
| **tutoring** | `ai_tutor_core` · `socratic_hint_ladder` · `canvas_annotation_tools` · `tutor_math_verification` · `tutor_fading_policy` · `tutor_mute_and_verdict_channel` · `tutor_voice_io` · `tutor_character` | Voice and character **complement** the text tutor but aren't required for its value | **Keep** the text tutor with tools in v1. Voice and character deferred |
| **content_production** | `lesson_document_format` · `parameterized_puzzle_generators` · `llm_config_generation` · `automated_puzzle_evals` · `curator_review_queue` · `difficulty_from_solver_trace` · `misconception_distractors` · `golden_example_library` · `simulation_primitive_library` · `answer_expectations_checker` | Deterministic generators (core) and LLM config generation (v1) **complement** each other. Evals gate both | **Keep**. The deterministic path ships first |
| **motivation_and_habit** | `daily_streak_with_charges` · `xp_points` · `weekly_leagues` · `personal_best_weeks` · `celebration_chain` · `path_node_visualization` · `local_reminders` · `focus_mode` | Leagues are **obsolete** for one user; personal_best_weeks replaces them | **Keep** streak, XP, path, and a skippable celebration chain plus focus mode. **Drop** leagues |
| **progress_and_reflection** | `attempt_event_log` · `progress_dashboard` · `weekly_summary_narrative` · `progress_reset_controls` · `parent_and_educator_dashboards` | Parent and educator views are out of scope | **Keep** the log and dashboard. Defer summary and resets. **Drop** parent/educator |
| **platform_and_access** | `local_first_offline` · `llm_provider_adapter` · `accessibility_baseline` · `code_execution_sandbox` · `cross_device_sync` · `accounts_and_paywall` | Local-first makes accounts and paywall **obsolete** | **Keep** local-first, the adapter, and accessibility. **Drop** monetization |
| **reference_and_community** | `concept_reference_notes` (BL wiki) · `user_authored_problems` · `community_discussion_voting` | Community is obsolete (single user); its useful remnant is merged into explanations | Defer reference notes (v1.x) and authoring (v2). **Drop** discussion |

## Drop reasons (all four)

| Feature | Reason |
|---|---|
| `weekly_leagues` | out of scope (single user) + privacy risk (other users' data) |
| `parent_and_educator_dashboards` | out of scope + privacy risk (minors' data, multi-account) |
| `accounts_and_paywall` | out of scope + harms learning (key caps) |
| `community_discussion_voting` | superseded by `multi_depth_explanations` |

## Investigate

None at the feature level. Open questions (Level Check format, Koji's tool schema, Pyodide subset size, Compute Engine
equivalence reliability) are tracked as technical risks in the blueprint (§7) and as spikes in the roadmap.
