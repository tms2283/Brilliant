# Teardown cards (Artifact 1)

**Framing.** The user asked for a rebuild based *only* on Brilliant, so the seed set is Brilliant at two points in
time:
- **Brilliant-2026 (B26):** the current product.
- **Brilliant-Legacy (BL):** the 2014–2024 product.

Outside learning-science patterns appear only as implementation patterns for gaps in Brilliant (see
`05-implementation-blueprint.md` §4). They are never a pool of competitor features.

Epistemic markers: `verified` (official Brilliant source) · `observed` (direct walkthrough, archives, docs, reviews) ·
`inferred` (reasoning). Research ids point into `docs/research/`; `OBS-x` = `01-direct-observation.md` §x.

---

## Card 1: Brilliant-2026 (B26)

| Field | Content |
|---|---|
| **Category** | Interactive STEM learning app (web, iOS, Android). Tagline: "Your Personal Tutor for Math & Coding" `verified` (CH-08) |
| **Target user** | Grade 5 through college learners, adults, parents, homeschoolers, teachers `verified` |
| **Core jobs-to-be-done** | (1) Build real understanding of math and coding by doing, not watching. (2) Practice daily in short sessions. (3) Get unstuck with a tutor that doesn't hand over answers. `verified` |
| **Feature inventory** | Paths > courses > levels > lessons; learn phase + 3-item Skills Check; Level Review; level check (jump-ahead); per-lesson practice sets; Warm Up insertions; personalized practice (Premium); Koji tutor (highlight, annotate, voice/chat, Ask Koji routing); streak + charges; XP; Leagues; You dashboard; parent/educator dashboards; K-5 generator-based practice; coding skills framework + coverage audit; standards maps. See `02-feature-matrix.md` |
| **Key workflows** | **Lesson** `observed`: title > ~5 escalating problems on one manipulative (concept card after the first 2) > takeaway > 3 one-shot check items > celebration chain (XP > streak > charge > league > upsell) (OBS-C). **Wrong answer** `observed`: amber state, the simulation plays the consequence, a misconception-specific hint, Try again / See answer (OBS-E). **Warm Up** `observed`: home inserts a 3-item practice set from the previous level before the next lesson (OBS-H). **Ask Koji** `verified`: free text > routed lesson or practice (HC-18) |
| **Inputs** | Taps, toggles, drags, sliders, MathLive math entry, token-slot code edits, MC choices, free-text and voice questions to Koji |
| **Outputs** | Verdicts, simulated outcomes, explanations, XP, streak, lesson scores (thirds), assessment accuracy, skills learned, weekly summary |
| **Core entities** `observed` | Course{version, retiringOn, conceptsInclude, prerequisites}, Level{insertion}, GameboardLessonNode{status, action, nextPracticeSlug, gatingLevelCheck}, LevelReviewNode, PersonalizedPracticeSet, ContentMetering{quota 2}, User.activity{attempts, tries, streak}, TutorPreferences (OBS-B) |
| **Differentiators** | Learn and measure kept separate (OBS-G) `observed`. Consequence-simulation feedback `observed`. One manipulative per lesson with escalating configurations `observed`. Generator + LLM + eval content pipeline (ENG-19/20) `verified`. Graphical tutor acting on lesson state (ENG-02) `verified` |
| **Integrations / stack** | Next.js/React shell; Elm interactives rendered as SVG; GraphQL (Apollo); Python/Django backend; MathLive + MathJSON + an "expectations" checker; Rive animation; ElevenLabs TTS; third-party LLM; Camperdown lesson markup; Diagrammar diagrams `observed` (OBS-A, ENG-12…15, ENG-08) |
| **Pain points** | Courses retired mid-progress, including Chemical Reactions and advanced math (CH-11) `observed`. Terse, puzzle-like explanations (LP-34). No offline use (HC-13). 2 keys/day caps practice, and warm-ups cost keys (HC-07). Weak cumulative review (LP-33). Gamification seen as twee (LP-36). Fragile drags (LP-43). No documented accessibility (HC-19/20). All tier 6 `observed` unless noted |
| **Evidence quality** | **High.** Direct logged-in observation, official help/blog (tier 1–2), verified job posts, and an engineering podcast. 6 of 7 research areas adversarially verified, with no finding refuted |

## Card 2: Brilliant-Legacy (BL, 2014–2024)

| Field | Content |
|---|---|
| **Category** | Problem-practice community (2014–2016), then an interactive course catalog with broad STEM (about 2017–2024) `observed` (CH-01…06) |
| **Target user** | Self-motivated STEM learners, olympiad and test-prep students, community problem authors |
| **Core jobs-to-be-done** | (1) Explore all of STEM, including physics, chemistry, biology, energy, and finance. (2) Solve challenging daily problems. (3) Learn from peers' explanations |
| **Feature inventory** | 60–110+ courses, with science peaking around 2022–23 at about 19–20 titles. Physics: everyday, mechanics, gravitation, E&M, waves/light, relativity, quantum objects, astrophysics. Also solar energy, The Chemical Reaction, Molecules, Computational Biology, and creator mini-courses. Daily Challenges with an insight primer; community problems (100k+ by 10k+ authors); voted explanations; a wiki; a 5-difficulty per-topic rating; an offline mode (2019–2021). `observed` (CH-04/05, CH-30…33, HC-37, LP-42) |
| **Key workflows** | Daily Challenge: insight primer > solve > read voted community explanations (CH-32). Course: named chapters of quizzes/guided problems, with typed modes (Explore / Apply / Derive) and capstone "Problem" lessons (CH-19, CH-26). Cross-domain prerequisite graph between courses (CH-36). All `observed` |
| **Inputs** | MC and numeric answers, Python (orbital simulations, computational biology), drag-and-drop circuit simulator (Quantum Computing), community submissions |
| **Outputs** | Solutions, explanations, per-topic rating and level, wiki pages |
| **Core entities** | Course{chapters, prereqs, nextSteps}, Quiz/Problem, CommunityProblem, Explanation{votes}, WikiPage, TopicRating `observed`/`inferred` |
| **Differentiators** | Breadth across sciences; community-written alternative explanations; daily cross-subject problems; reference wiki `observed` |
| **Integrations** | Microsoft (Q#) for Quantum Computing; creator partnerships (Kurzgesagt, MinutePhysics, MinuteEarth, Sabine, Real Engineering) `observed` |
| **Pain points** | Text-heavy lessons with only occasional interactivity (LP-45). Thin chemistry and missing biology (CH-35). Unfinished courses (E&M had 9 lessons, CH-18). Community was "confusing or intimidating" and costly to moderate (CH-30). `observed` |
| **Evidence quality** | **Medium-high.** Arquivo.pt snapshots, official FAQ archive, release notes, reviews. Lesson-level mechanics of removed courses are not observable (pages were behind login and not archived) |

## Retirement mechanism (why the user's observation is right)

- Brilliant retires courses that "no longer meet our threshold" into a desktop "Archived" section and reuses their
  URLs. For example, `/courses/physics-everyday/` now serves Circuits. `verified` (CH-10, CH-14)
- Rebuilt courses carry about 2x the exercises per lesson (12.7–17 vs 6.3–8.6). `inferred` (CH-16)
- So reaching the new quality bar per science course is the plausible cost driver. The rebuild answers it with
  generators, simulators, and evals, which make breadth cheap.
