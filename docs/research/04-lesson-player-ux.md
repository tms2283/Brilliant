# Lesson player UX (secondary sources)

- **Dimension:** `lesson_player_ux`
- **Findings:** 45 (29 load-bearing)
- **Adversarial verification:** confirmed: 2, corrected: 10

> Epistemic markers: `verified` = official Brilliant source; `observed` = docs, demos, archives,
> reviews; `inferred` = reasoning. Tier: 1 official … 7 third-party.

## Findings

### LP-01: A lesson or practice set starts from a modal over the course path: a lesson node opens a sheet with the lesson title and a 'Start lesson' button, and a practice node opens one with 'Start practice'.

- **Status:** `observed` · Tier 4 · <https://screensdesign.com/apps/brilliant-learn-by-doing/>
- **Detail:** Seen in the ScreensDesign 10:26 iOS walkthrough. The 'Understanding Variables' modal shows 'Start lesson' over the learning-path background. The Logic course 'Order Logic' node opens a modal with 'Start lesson'. Practice opens a modal with 'Start practice' while the Courses tab is active. Capture date not stated; the content (Foundational Math, How LLMs Work) suggests 2024-2026.

### LP-02 ★: A lesson opens with an intro screen (illustration, short descriptive text, 'Continue'). Concept or definition cards are mixed in with question screens; there is no long text block up front.

- **Status:** `observed` · Tier 4 · <https://screensdesign.com/apps/brilliant-learn-by-doing/>
- **Verification:** **corrected**. Correction: ScreensDesign shows two kinds of lesson-start screen: (1) a lesson introduction ('Understanding Expressions') with a central illustration, a progress bar and a 'Start lesson' button; (2) a concept screen introducing variables with an illustration, a definition card and 'Continue'. A screen with an illustration, descriptive text and Continue exists, but ScreensDesign labels it an 'Onboarding screen introducing Understanding Variables'. Multiple-choice, typed-input, keypad, bar-model concept and explanation screens are in the same capture set, but the gallery does not establish their order. 'Intro -> definition card -> MC question' and 'no long text block up front' are inferred. A Nibble blog post (2026, by a competitor) says Brilliant 'does not explain concepts at the beginning of the lesson' and starts with puzzles and games. (`observed`). Note: Re-fetched ScreensDesign: the lesson intro's button is 'Start lesson', not 'Continue'. The 'descriptive text + Continue' screens are labeled onboarding. The definition card sits on a 'lesson screen introducing variables', which is in mild tension with Nibble's claim that concepts are not explained first. The Nibble quote is verified at https://nibble-app.com/blog/is-brilliant-worth-it. That source is a competitor, roughly tier 6-7.
- **Detail:** ScreensDesign sequence: lesson intro (illustration, descriptive text, 'Continue'), then a definition card, then a multiple-choice question with 'All of the above' selected and a positive feedback banner. A 2026 Nibble review calls lessons 'problem-first' and says Brilliant 'does not explain concepts at the beginning.'

### LP-03 ★: Problem screens use one primary bottom button whose label depends on state: 'Check' or 'Submit' to evaluate, 'Continue' after evaluation, and 'Finish lesson' on the last item. A custom keypad has its own 'Done' button.

- **Status:** `observed` · Tier 4 · <https://screensdesign.com/apps/brilliant-learn-by-doing/>
- **Verification:** **corrected**. Correction: Labels observed on ScreensDesign: Check (typed input, keypad and some multiple-choice screens), Submit (other multiple-choice screens), Continue, Finish lesson (Review and Reflect and lesson-completion screens), Finish (an incorrect panel), Done (a screen with a custom keypad), Explanation, Back to problem, Review and reflect (after a correct answer), Start lesson and Start practice. That the label changes on a single primary button slot is inferred from static screenshots. Two screens contradict a strict one-way idle->checked->next machine: a 10x10 percent grid showing 'a feedback banner, and a Check button', and one showing 'Check and Explanation buttons'. These suggest that on some problems a learner can re-check after feedback. (`observed`). Note: Check and Submit both appear on multiple-choice screens. 'Review and reflect' replaces Continue after one correct answer. The Done screen has a 'custom keypad, and a Done button'. Whether Done belongs to the keypad or replaces the primary button is not shown. The single-slot state machine is inference.
- **Detail:** Labels seen in the ScreensDesign capture: Check, Submit, Continue, Finish lesson, Done (keypad), Explanation, Back to problem. Inferred: the label changes on the same button slot, as a small state machine (idle -> answered -> checked -> next).

### LP-04 ★: A correct answer shows a positive feedback banner with the XP earned for that problem and a 'Continue' button.

- **Status:** `observed` · Tier 4 · <https://screensdesign.com/apps/brilliant-learn-by-doing/>
- **Verification:** **corrected**. Correction: Most correct-answer screens in the ScreensDesign capture show a correct/success banner with an XP reward and a Continue button. This is not universal: two correct screens (10 kg, 'solved balance scale problem') mention a banner and Continue but no XP; one (10 + 3t) shows XP with a 'Review and reflect' button instead of Continue; one shows a banner awarding XP alongside the input and keyboard, with no Continue described. The help center separately confirms that a correct math-keyboard answer box 'turns green with a checkmark'. (`observed`). Note: The detail's examples are wrong: the 8 kg and 25 kg screens show an option selected plus Submit, and the 20 kg screen shows an option selected plus Check. They are pre-submit screens, not correct banners. The green-checkmark quote is verified at https://brilliant.org/help/features/how-do-i-use-interactives-on-brilliant/. Whether the XP shown is per-problem is not stated.
- **Detail:** ScreensDesign: 'correct banners with XP rewards and Continue' on balance-scale puzzles (8 kg, 25 kg, 20 kg answers). Separately, the help center says a correct math-keyboard answer box 'turns green with a checkmark' (feedback per field).

### LP-05 ★: An incorrect answer shows an incorrect banner with a secondary 'Explanation' button next to 'Continue' (or 'Finish'). The learner can move forward after a wrong answer.

- **Status:** `observed` · Tier 4 · <https://screensdesign.com/apps/brilliant-learn-by-doing/>
- **Verification:** **corrected**. Correction: Two incorrect-answer screens show an incorrect banner with an Explanation button and Continue. A third incorrect feedback panel shows a 'Finish' button, and no Explanation button is described there. So a wrong answer does not block forward progress. Whether Explanation is visually 'secondary' is not described. Two other screens (a feedback banner with Check still present; Check + Explanation together) suggest re-answering is possible on at least some problems. This is inferred because the banner type is not stated. (`observed`). Note: I could not find the 2018 Android 3.9.1 'scrolling bug when getting question wrong' note by search, so treat that detail as unverified. Brilliant's own help center says wrong answers get explanatory feedback (see LP-07). The free K-5 quizzes officially allow a retry after an error (LP-09).
- **Detail:** ScreensDesign: 'incorrect banners with an Explanation button and Continue/Finish.' Inferred: a wrong answer does not block progress through the lesson; the capture does not show whether re-answering is required or allowed. The 2018 Android 3.9.1 notes mention fixing a 'scrolling bug when getting question wrong,' so the wrong state changes the layout.

### LP-06 ★: The explanation is a separate view with an illustration and step-by-step reasoning, and two exits: 'Back to problem' and 'Continue'.

- **Status:** `observed` · Tier 4 · <https://screensdesign.com/apps/brilliant-learn-by-doing/>
- **Verification:** **corrected**. Correction: ScreensDesign shows explanation screens with scale illustrations and step-by-step or division reasoning. One explanation screen has both 'Back to problem' and 'Continue'. Others ('step-by-step weight calculation', 'algebraic expression explanation') show only 'Continue'. So the two-exit pattern is not universal. That the explanation is a separate view is inferred from it being a separate screen. A 10x10 percent-grid screen shows Check and Explanation together. Linking it to 'Percents in The News' (Everyday Math) is inference: those are separate captures. Learnopoly says 'for every problem you can choose to view explanations, often animated in stages'. (`observed`). Note: I verified the Learnopoly quote at https://learnopoly.com/?p=4893. It is a third-party review (tier 7) and undated; it was probably updated in 2025. Learnopoly also says hints exist 'for most problems'.
- **Detail:** ScreensDesign: 'Explanation screens: scale illustrations, step-by-step reasoning, Back to problem and Continue.' A 10x10 percent-grid exercise in 'Percents in The News' (Everyday Math) shows 'Check' and 'Explanation' together. Learnopoly (third-party) says every problem has an explanation option, 'often animated in stages.'

### LP-07 ★: Brilliant recommends reading the explanation after a correct answer too, and presents wrong answers as diagnostic feedback rather than a bare red X.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/why-brilliant/is-brilliant-good-for-remediation>
- **Verification:** **confirmed**. Note: The remediation page says, verbatim, that many platforms mark wrong answers with a red X and move on, but 'Brilliant doesn't work that way'. It says wrong answers get 'feedback that helps you understand why', and that Brilliant 'encourages learners to read the explanation even after a correct answer' because 'it's often where the deeper understanding forms'. The FAQ sentence 'Lessons provide explanations and immediate feedback as learners work' is on https://brilliant.org/faq/, not on the remediation page, but it is verified.
- **Detail:** Help center: wrong answers come with 'feedback that helps you understand why'. Reading the explanation after a correct answer is encouraged because 'it's often where the deeper understanding forms.' The FAQ says 'Lessons provide explanations and immediate feedback as learners work.'

### LP-08: Earlier versions of the player offered hints on most problems, showed the percentage of learners who answered correctly, and let users comment on exercises.

- **Status:** `observed` · Tier 7 · <https://learnopoly.com/brilliant-org-review/>
- **Detail:** Learnopoly review (undated, comments through Mar 2025): hints for most problems show 'the most direct way to a solution'. Probability problems show the percent who answered correctly ('it's never 100%'). The reviewer could leave comments on exercises, and some lessons have optional extra challenge problems. Treat this as a historical or partial snapshot; it is not confirmed for 2026.

### LP-09 ★: Brilliant's own quiz player allows a retry after an initial error and records first-attempt accuracy separately from eventual accuracy.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/practice/guides/free-math-practice-without-an-account/>
- **Verification:** **corrected**. Correction: Brilliant's free, account-free K-5 Math Practice hub says its 'Interactive quizzes provide a retry after an initial error and record first-attempt and eventual accuracy.' The hub currently has only Kindergarten and Grade 1 live; Grades 2-5 are marked 'Coming soon'. It stores progress on the device. Nothing documents the same retry and first-attempt split in the main lesson player. (`verified`). Note: The quote is verbatim on an official brilliant.org page. I narrowed 'Brilliant's own quiz player' to the K-5 practice hub so it is not read as the main lesson player. The page is on brilliant.org, so it is arguably tier 1 rather than 2.
- **Detail:** Brilliant's free K-5 practice guide: 'Interactive quizzes provide a retry after an initial error.' The player records 'first-attempt and eventual accuracy.' This is documented for the account-free K-5 player. Inferred: the main lesson player probably uses the same split for mastery and XP; not confirmed.

### LP-10 ★: Coding lessons use an in-browser Python editor with a Run button and allow repeated submissions. The main task types are run/read, predict, debug (find and fix), and complete-the-core-logic.

- **Status:** `verified` · Tier 1 · <https://brilliant.org/resources/coding/interactive-python-for-teens/>
- **Verification:** **corrected**. Correction: Python runs in the browser with no install. The homepage alt text shows 'A Python script ... with a Run button below the editor' and a practice exercise 'tracking elapsed time, with a Python loop in a code editor'. For Thinking in Python specifically (70 lessons, 874 exercises): all 70 lessons have learners run executable Python; 61 of 70 have learners diagnose or repair a bug; 301 working programs or features have learners complete the core logic in a defined function. 96% of learners aged 13-17 who made an incorrect code submission corrected it on a later attempt at the same problem (July 2026 data), which confirms repeated submissions. The page also says learners practice 'reading, running, and changing real code'. 'Predict' comes from a general pedagogy line ('Learners must predict, choose an approach, and test their reasoning'), not a counted task type. (`verified`). Note: The core facts are verified on official pages: the Python resource page and the brilliant.org homepage alt text. The corrections only tighten scope: the counts are for Thinking in Python, not all coding lessons, and the 'main task types' grouping is the researcher's synthesis.
- **Detail:** Thinking in Python: 70 lessons, 874 exercises. All 70 lessons have learners run executable Python, 61 of 70 include find-and-fix tasks, and 301 programs ask learners to complete core logic in a defined function. '96%' of learners aged 13-17 submitted correct code on a later attempt after an error. Homepage alt text shows a Python script with a Run button below the editor, plus a practice exercise that tracks elapsed time next to a loop.

### LP-11 ★: Numeric and expression answers use a custom math keyboard with structural templates (fraction, square root), arrow-key cursor movement, and support for several answer boxes per problem.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/features/how-do-i-use-interactives-on-brilliant/>
- **Verification:** **confirmed**. Note: The help center confirms all of these: keys 0-9 and +, -, x; a fraction key where 'If you've already typed something, it becomes the numerator'; a square-root key with an empty box under the root; arrow keys where the right arrow moves 'into a denominator, or back out of a fraction or square root'; a delete key; 'tap a box to select it' when there are several answer boxes; the active box is 'outlined in blue'; and a correct box 'turns green with a checkmark'. One detail is slightly off: ScreensDesign shows a 'custom keypad, and a Done button', and the screen it calls a 'numeric keypad' has Check, not Done.
- **Detail:** Help center: keys are 0-9, +, -, x, a fraction template (any existing input becomes the numerator), a square root with an empty radicand box, arrow keys to step into or out of the denominator or radicand, and delete. With multiple answer boxes, the learner taps a box to make it active (blue outline). A correct box 'turns green with a checkmark.' The ScreensDesign capture also shows a separate numeric keypad with 'Done.'

### LP-12: Manipulatives are handled directly and use explicit drag handles rather than taps. Example: negative-number tile stacks grow or shrink by dragging a pill-shaped handle.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/features/how-do-i-use-interactives-on-brilliant/>
- **Detail:** Help center, Negative Numbers course: drag the pill handle at the bottom of the tile stack down to add negative tiles and back up to remove them. 'Tapping tiles doesn't add them'. A +/- pair sums to zero. A 2026 Trustpilot reviewer said matrix-diagram 'handles' are 'not easy to find', so the handles are hard to discover.

### LP-13 ★: Each interactive has a 'Start over' control beneath the problem that resets it to a blank state.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/features/how-do-i-use-interactives-on-brilliant/>
- **Verification:** **corrected**. Correction: The help center says: 'If you ever want to start a problem again from a blank slate, look for the Start over button beneath the problem.' The number-tiles section adds: 'Made a mess? Tap Start over to reset the tiles and try again.' The page does not say every interactive or problem has this button. (`verified`). Note: 'Each interactive has' overgeneralizes. 'resets a problem to a blank slate' and 'if tiles get messy' are paraphrases, not verbatim quotes. The inference that interactives hold mutable local state separate from the submitted answer is reasonable but still inference.
- **Detail:** Help center: the 'Start over' button 'resets a problem to a blank slate' and is recommended 'if tiles get messy.' This implies interactives hold mutable local state separate from the submitted answer.

### LP-14 ★: Brilliant's design job postings name these interaction types: building up and simplifying symbolic expressions, drag-and-drop code blocks, constructing graphs, manipulating a neural network on a phone, digital circuits, and probability.

- **Status:** `verified` · Tier 2 · <https://www.workingnomads.com/jobs/product-designer-learning-interactives-brilliant>
- **Verification:** **corrected**. Correction: The Product Designer, Learning Interactives posting describes designing how someone 'builds up and simplifies a symbolic math expression, drags code blocks, or wrangles a neural network on a phone'. It also names new interactive patterns for 'symbolic math, constructing graphs, drag-and-drop coding, etc.' It mentions 'probability and chance' and 'digital circuits' only as topics learners will understand, not as interaction types. It says 'there are no videos, everything is interactive' and that the role designs 'the visual systems for feedback'. Prototyping tools: Figma, Principle, Framer, vibe coding. The 2023 Lead Product Designer, Learning Experience posting names 'symbolic math entry' and 'drag-and-drop code authoring' as hard interaction problems 'across different content use cases, screen sizes, and devices'. (`verified`). Note: The source is a third-party mirror (workingnomads, 'Posted 1 year ago', expired). The original Lever postings (jobs.lever.co/brilliant/9f63e8ed... and 35297824...) appear in search results but now return 404. 'Verified' is acceptable only because the claim is about what the postings said. The 2023 quotes come from https://dynamitejobs.com/company/brilliantorg/remote-job/lead-product-designer-learning-experience, not the workingnomads URL.
- **Detail:** Learning Interactives posting: 'there are no videos, everything is interactive'. The role includes 'the visual systems for feedback.' The 2023 Lead PD (Learning Experience) posting names 'symbolic math entry and drag-and-drop code authoring' as hard interaction problems across 'screen sizes, and devices.' Prototyping tools named: Figma, Principle, Framer, and 'vibe coding.'

### LP-15 ★: The lesson is a layout engine that arranges modules, with built-in support for branching paths, hints, and feedback.

- **Status:** `verified` · Tier 2 · <https://dynamitejobs.com/company/brilliantorg/remote-job/lead-product-designer-learning-experience>
- **Verification:** **corrected**. Correction: A 2023 Brilliant job posting (Lead Product Designer, Learning Experience, updated March 31, 2023, now closed) describes the role's scope as 'the core lesson experience, the layout engine that supports different modules for progressive discovery of math and science concepts, interactivity, branching paths, hints, and feedback'. It also says the designer owns 'the choreography of different modules'. The grammar leaves open whether 'branching paths, hints, and feedback' are properties of the modules or of the experience. The posting describes design scope as of 2023, not documented shipped behavior. How branching works and how often it is used are unknown. (`observed`). Note: The quotes are confirmed on the dynamitejobs mirror. The original posting is not reachable on Brilliant or Lever. The claim is about product architecture, not about what the posting said, so 'verified' is too strong for a third-party mirror of a 3-year-old posting. Search results also describe a related Staff Product Designer, Learning Interactives posting with 'a similar layout engine for progressively showing content, hints, and feedback', but I did not fetch it (the Lever URL returns 404).
- **Detail:** 2023 Lead Product Designer posting: the lesson is 'the layout engine that supports different modules'. Modules support interactivity, branching paths, hints, and feedback. The designer owns 'the choreography of different modules.' How branching works and how often it is used are not described.

### LP-16: Multiple choice supports single and multi-select. Graph sliders have been used inside problems since at least 2018, and at that time they conflicted with swipe-to-next-problem navigation.

- **Status:** `observed` · Tier 4 · <https://www.apkmirror.com/apk/brilliant-org/brilliant/brilliant-3-9-1-release/>
- **Detail:** Android 3.9.1 notes (APKMirror, May 2 2018): 'Added support for multi-select multiple choice questions'. 'Fixed graph sliders from swiping to the next problem in a quiz'. Also 'Changed multiple-choice question design to be more clear.' Current screens move forward with buttons, not swipes.

### LP-17: Concrete problem screens captured in an algebra lesson include balance-scale weight puzzles (multiple choice and numeric entry), bar models, expression evaluation with substitution, and a 10x10 grid for shading percents.

- **Status:** `observed` · Tier 4 · <https://screensdesign.com/apps/brilliant-learn-by-doing/>
- **Detail:** ScreensDesign 'Understanding Variables' lesson: weight of a square (8 kg), triangle (25 kg), circle (20 kg), and an 18 kg input. Evaluating 10 + 4b with b = 6 (input 34), 10 + 3t, and bar models. Everyday Math has a 10x10 grid exercise for 40%.

### LP-18: Reviewers describe games and simulations embedded in lessons (casino and dice games in Probability, visual logic puzzles), dragging points on graphs, and drag-and-drop challenges.

- **Status:** `observed` · Tier 7 · <https://learnopoly.com/brilliant-org-review/>
- **Detail:** Learnopoly: craps, roulette, and shut the box in Probability; Logic games are 'visual and kinaesthetic'. Headway (Aug 2026): lessons ask you to 'manipulate something on screen,' such as dragging a point on a graph. e-student (2026): 'drag-and-drop aspect of the challenges feels rewarding.' A Brilliant designer's 2021 UX Collective essay (seen only in a search snippet; fetching returned 403) gives a geometry example of a 3D shape that unfolds as you manipulate it.

### LP-19: After an answer is submitted, a flag icon next to 'Continue' opens a 'Report a problem' modal. The modal lists issue options, and its Continue button stays disabled until one is selected.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/help-and-support/how-can-i-report-bugs-issues-i-m-encountering-on-brilliant/>
- **Detail:** Help center: 'click the flag icon next to the Continue button' to report a problem. On mobile, shaking the device files a report with an automatic screenshot. ScreensDesign shows the modal with issue options and a disabled Continue.

### LP-20 ★: Practice sets remove the hints and visual scaffolds used during instruction. In 2026, hints inside lessons are mainly delivered by Koji, drawn over the interactive.

- **Status:** `verified` · Tier 1 · <https://brilliant.org/resources/choosing-brilliant/brilliant-vs-khan-academy/>
- **Detail:** Brilliant vs Khan page: in practice sets 'the hints and visual scaffolds used during instruction fall away'. Every lesson has an associated practice set, described as a 'low-stakes quiz.' Dyscalculia help page: Koji can 'overlay extra graphics and hints directly on the interactive.' Homepage: hints and alternative explanations 'by voice or chat.' Inferred: in courses without Koji, or after a free user's preview runs out, a separate hint button may not exist (unconfirmed).

### LP-21 ★: In Koji-enabled courses, short correct/incorrect feedback messages are part of Koji's speech-bubble channel and still appear when Koji is muted. The mute control is a sound icon in the lesson header.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/features/how-does-koji-work/>
- **Detail:** Koji help: muting 'disables Koji's speech bubbles, except for small feedback messages' about whether an answer was correct. On desktop the sound icon is at the top left of the learning experience. On mobile it is at the top right and is visible only while the chat is open. It can also be set in account preferences. Inferred: feedback is two-tier (a short verdict plus optional tutor commentary).

### LP-22 ★: Koji can read problems and explanations aloud and can re-explain using a different approach, which fills an accessibility gap reviewers had raised earlier.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/features/is-brilliant-good-for-learners-with-dyscalculia/>
- **Detail:** Dyscalculia help: Koji can narrate problems and explanations aloud and walk through reasoning step by step in chat. If an explanation doesn't land, the learner can ask Koji to try another approach. Homepage image: Koji offering to 'try another approach' in the lesson chat. An earlier App Store reviewer (via JustUseApp) found no lesson with an auditory option.

### LP-23: Koji's animation reacts to performance: reactions differ depending on whether the learner solved the problem easily or struggled, and Koji does a flip when a lesson is finished with every answer correct.

- **Status:** `verified` · Tier 2 · <https://rive.app/blog/brilliant-builds-its-math-and-coding-tutor-character-with-rive>
- **Detail:** Brilliant-team guest post on the Rive blog (Jun 4 2026): animations include waving, nodding, and a flip, with 'a full set of states' covering a tutoring session. Live lesson states drive Koji's responses. Koji has no mouth, so an audio-volume data-binding variable drives the speaking animation. Learner quote: 'Koji does a flip, it's amazing!'

### LP-24 ★: Brilliant now uses mastery assessments inside courses: falling short triggers targeted practice, and a 'lesson plan' screen builds prerequisite skills before the main lesson.

- **Status:** `verified` · Tier 1 · <https://brilliant.org/>
- **Detail:** Homepage: regular assessments check understanding of each concept, and when learners fall short Koji 'creates targeted practice.' An image shows a lesson-plan screen where skills are built up before the main lesson. Parents get notifications about mastery-assessment performance.

### LP-25 ★: The end of a lesson is a three-step sequence: 'Finish lesson' button, then a 'Review and reflect' screen, then a 'Lesson complete' screen showing total XP earned.

- **Status:** `observed` · Tier 4 · <https://screensdesign.com/apps/brilliant-learn-by-doing/>
- **Detail:** ScreensDesign: 'Finish lesson', then 'Review and reflect', then 'Lesson complete' with 115 XP; a later lesson shows 180 XP. What 'Review and reflect' contains (recap, missed items, self-rating) is not described. Whether accuracy is shown on the completion screen is not confirmed.

### LP-26: Since May 2023, finishing a lesson shows an XP breakdown and information about unlocking Leagues. A Stats screen was removed at the same time.

- **Status:** `observed` · Tier 4 · <https://www.apkmirror.com/apk/brilliant-org/brilliant/brilliant-7-13-0-release/>
- **Detail:** Android 7.13.0 notes (May 22 2023): 'Complete a lesson to see info on unlocking Leagues, as well as a breakdown of your XP.' The Stats screen moved to the Course Directory. Conflict: ScreensDesign shows a locked Leagues screen with an XP bar at 140/175 before a 'Hydrogen League' unlock with a countdown, while the current help page says you join a League automatically when you first earn XP in a week.

### LP-27 ★: After the completion screen, a chain of full-screen motivation screens follows: streak day count, a 3-day streak explainer, and a Streak Charge award (battery illustration), each closed with 'Continue'.

- **Status:** `observed` · Tier 4 · <https://screensdesign.com/apps/brilliant-learn-by-doing/>
- **Detail:** ScreensDesign: a 1-day streak screen with a motivational prompt, a 'three-day practice streak explainer' with graphic and counter, and a Streak Charge reward with a battery and Continue. Home shows a weekly streak tracker or calendar, and the help center says charges appear on Home 'they look like batteries'.

### LP-28: The streak celebration is a Rive state machine whose animation is timed to the day count incrementing. One Rive file ships to iOS, Android, and web, and path nodes and lines come in several color variants and node types.

- **Status:** `observed` · Tier 7 · <https://rive.app/blog/how-brilliant-org-motivates-learners-with-rive-animations>
- **Detail:** Rive blog (May 2 2024): event triggers mark when a streak is achieved. The streak was Brilliant's first feature launched on Android, iOS, and web at once from one shared file. Designers build the animation and developers 'trigger the desired states.' Lead PD quote: 'what you build in Rive is what's in the product.'

### LP-29: Sound effects are a user setting (shown enabled in the capture) and are used as rewards. No source documents haptics directly, though Brilliant recruits for haptics expertise.

- **Status:** `observed` · Tier 7 · <https://www.techlearning.com/learning/stem/what-is-brilliant-and-how-can-teachers-use-it>
- **Detail:** ScreensDesign settings: 'Sound effects toggle (enabled).' Tech & Learning (Feb 2026): sound effects and animations reward persistence and mastery. User Motivation designer posting: wants opinions on 'game feel principles' and nice-to-have 'deep expertise' in motion, sound, or haptics. Haptic behavior in lessons is unverified.

### LP-30 ★: A practice set runs in the same player and ends on a summary showing total XP, a points-breakdown card, 'Continue', and lifetime XP.

- **Status:** `observed` · Tier 4 · <https://screensdesign.com/apps/brilliant-learn-by-doing/>
- **Detail:** ScreensDesign 'Complete Practice Session' chapter (04:29-05:18): completion with total XP, points-breakdown card, Continue, and a lifetime XP summary of 140. What items the breakdown contains is not legible in the descriptions.

### LP-31 ★: Some practice sets mix topics on purpose so the learner has to choose the right method, and the next problem is predicted from prior work.

- **Status:** `verified` · Tier 1 · <https://brilliant.org/resources/choosing-brilliant/brilliant-vs-khan-academy/>
- **Detail:** Brilliant vs Khan page: Brilliant uses learning history to choose next problems, including extra work in weak areas. It tests spaced repetition, mixed practice, automaticity, set length, and difficulty. Review sets mixing earlier lessons are being rolled out course by course with human review.

### LP-32 ★: Brilliant's account-free K-5 practice player shows parameters useful for a local practice engine: a choice of session length (5 or 15), difficulty that ramps with the chosen length, pause, no timer, problems generated from stated ranges, and skill guides listing common misconceptions.

- **Status:** `verified` · Tier 1 · <https://brilliant.org/practice/grade-1/addition/count-on-to-add/>
- **Detail:** Guide: 'Quick check for five questions or Practice for fifteen'. Some quizzes ramp difficulty, and 'progression adjusts to the selected length'. Progress is stored only on the device. Quiz page 'count-on-to-add': first addend 21-89, second 2-9, answer picked from 'five nearby choices.' The skill guide has the standard (CCSS 1.OA.C.5), prerequisites, common mistakes (e.g., not updating the tens digit), and the next skill.

### LP-33 ★: Users report a gap in cumulative review: they ask for a Duolingo-style random review quiz and spaced repetition, and some keep their streak or rank with small actions instead of real practice.

- **Status:** `observed` · Tier 6 · <https://apps.apple.com/app/brilliant-learn-by-doing/id913335252>
- **Detail:** App Store reviewer wants a 'quiz of randomly selected information' for review. Another reviewer says 'streak rechargers' let users 'rise up through the lower ranks' without full practice. A JustUseApp reviewer asks for spaced repetition, and another wants to bookmark difficult problems within a quiz.

### LP-34 ★: The most common complaint about lesson content is explanations that are too terse, ambiguous, or puzzle-like, plus answer keys that force guessing.

- **Status:** `observed` · Tier 6 · <https://justuseapp.com/en/app/913335252/brilliant-solve-learn-grow/reviews>
- **Detail:** JustUseApp reviews: explanations so brief they were 'kind of puzzle itself' (the reviewer asks for a second, more detailed explanation option), technical terms 'introduced without ever defining them', questions that 'hides important information', 'a series of gotcha questions'. Substack (Nov 2024): learners had 'to suss out which answer the app wanted'. HN (Jan 2024): lessons 'out of sequence,' referring to material not yet covered.

### LP-35: Brilliant once had a community layer of user-submitted, upvoted solutions shown after answering. It was removed in July 2021, leaving only staff-written explanations.

- **Status:** `observed` · Tier 7 · <https://www.cultofmac.com/?p=604148>
- **Detail:** Cult of Mac (Feb 2019): after answering, right or wrong, you can read user explanations, and voting surfaces the clearest. A search snippet of brilliant.org/community-faq said the community section was removed on July 2, 2021, along with new explanation submissions on Daily Challenges (the URL now redirects to a Koji page). A JustUseApp user complains that only the staff solution remains. A Dec 2025 HN commenter plans an open-source clone of 'the old version.'

### LP-36 ★: Some long-time technical users object that recent player changes add gamification and cartoon content that interrupts focus. In 2022, users had praised Brilliant for keeping gamification quiet.

- **Status:** `observed` · Tier 6 · <https://hacker-news.firebaseio.com/v0/item/38317495.json>
- **Detail:** HN Nov 2023 (ben_w): 'twee gamification getting in the way of learning'; Brilliant changes are 'actively annoying.' HN Feb 2024: content shifted toward easy, unskippable cartoon material. HN Jan 2022 (bananarchist): Brilliant 'doesn't emphasize gamification', streaks are low-key, content 'nicely bite-sized'.

### LP-37 ★: Lesson length varies a lot by course: roughly 12-17 exercises per lesson in core courses, but exactly one puzzle per lesson in Science Puzzles.

- **Status:** `inferred` · Tier 1 · <https://brilliant.org/courses/science-puzzles-long-set/>
- **Detail:** Computed from catalog counts. Solving Equations: 1159 exercises / 68 lessons ≈ 17. Thinking in Python: 874 / 70 ≈ 12.5. Science Puzzles: 59 lessons / 59 exercises, 12 levels of about 5, 'one puzzle a day for a month.' SkillScouter estimates 10-25 problems per 15-30 minute lesson. Learnopoly counted 22 problems in Probability.

### LP-38 ★: Mobile navigation has four bottom tabs (Home, Courses, Leagues, More). Home has a weekly streak tracker, a resume card with 'Continue', and category chips. Course paths render as an isometric curriculum map or a vertical trail of lesson nodes.

- **Status:** `observed` · Tier 4 · <https://screensdesign.com/apps/brilliant-learn-by-doing/>
- **Detail:** ScreensDesign: the Foundational Math path (46 lessons) is an 'isometric curriculum map'. The Logic course (28 lessons) has 'vertical lesson nodes'. The catalog has Math, Data, Computer Science, and Science tabs in two-column card grids. Settings live under More: account, subscription, sound effects, and notifications.

### LP-39: New users go through about 14 screens of onboarding, account creation, a paywall, and plan building before landing on a Level 1 course card with 'Get started' that leads into the first lesson.

- **Status:** `observed` · Tier 4 · <https://screensdesign.com/apps/brilliant-learn-by-doing/>
- **Detail:** ScreensDesign chapters: Welcome, Persona, Learning Goal, Reinforcement, Topic, Daily Goal, Notification warm-up, System prompt, Math Comfort Level (e.g., 'Arithmetic Introductory'), Value Prop, Social Proof, Account (00:41-01:04), Paywall (01:04-01:36), 'Building Your Plan' (yellow circular loader), then recommendations and a 'Solving Equations' Level 1 card, with the first lesson at 02:00.

### LP-40: Lessons can be replayed or reset from the course page with a Redo icon or a Review button, depending on course structure. On the web, a level can be reset with 'Reset progress to here,' which also erases all later levels.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/features/can-i-reset-course-progress/>
- **Detail:** Help: select Redo or Review, then 'Reset lesson', then confirm. Level reset 'can't be undone.' Android 7.2.0 (around Aug 2022) fixed the 'Redo Lesson' button and 'Show Explanation' in Daily Challenges. Android 7.20.0 (Oct 2023) redesigned the course overview 'to move between lessons and track progress.'

### LP-41 ★: On the web Home tab, 'Ask Koji' accepts a free-text learning request, identifies the topic, and sends the learner to matching instruction or practice, a basic version of user-requested paths.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/features/ask-koji-a-math-question-and-find-the-right-lesson/>
- **Detail:** Help (updated Aug 11 2026), example prompts: 'I need help with quadratic equations', 'Give me practice with triangle similarity', 'What should I review before starting calculus?' Koji stays available during the routed work. Ambiguous requests and usage limits are not documented.

### LP-42 ★: Offline lessons used to exist (2021) but are now officially unavailable, so the current player always needs a connection.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/faq/>
- **Detail:** TapSmart (May 2021): 'Courses can be downloaded for offline use.' The current FAQ says an internet connection is required and 'Brilliant lessons are not available for offline use.' An e-student review updated in 2026 still lists offline mode as a Premium perk, so third-party sources disagree with the FAQ.

### LP-43 ★: Learners report fragile interactive input: drags failing on some mobile browsers, browser extensions breaking manipulatives, jerky dragging, and occasional bugs that block moving past a question.

- **Status:** `observed` · Tier 6 · <https://hn.algolia.com/api/v1/items/38000551>
- **Detail:** HN thread on the 'Halfsies' challenge (Oct 2023): drag did not work on Firefox mobile for some users, the Dark Reader extension stopped the shape from moving, and dragging felt 'jerky/sticky' on a phone. Trustpilot (Oct 2026): 'you could not move on from the first question' (fixed within hours) and windows that 'would not display anything.'

### LP-44: Brilliant's standalone challenges end on a results screen with an accuracy percentage, playful verdict copy, and a shareable grid with 'Can you do better?'

- **Status:** `observed` · Tier 6 · <https://hn.algolia.com/api/v1/items/38000551>
- **Detail:** HN Halfsies thread: score reported as a percent ('5 perfect gives you 100%'), and the verdict copy is upbeat even at 0% ('not half bad!'). Results include a share grid and a 'Can you do better?' prompt. Users wanted a per-round recap and asked how the area was scored, showing that the scoring rules were not explained.

### LP-45: The pre-2022 player was more text-heavy, with interactivity only occasional. The current design is action-first, a deliberate change rather than a constant.

- **Status:** `observed` · Tier 7 · <https://www.tapsmart.com/apps/review-brilliant/>
- **Detail:** TapSmart (May 2021): lessons mix written text with an 'occasional interactive demonstration or quiz'. Courses were 'text-heavy', and a screenshot is captioned 'Don't forget your reading glasses.' Tabs were Courses, Practice, and Today. Android 7.6.0 (Dec 2022) added a simplified course layout and 40% faster lesson loads. 2026 reviewers describe 'problem-first' lessons.

## Implications for the rebuild

- Model the lesson player as an explicit state machine per screen: screen types {intro/narrative card, definition card, problem, explanation, review-and-reflect, lesson-complete, celebration}. Problem states {pristine -> dirty (input given) -> checked_correct | checked_incorrect -> explanation_open <-> back_to_problem -> continue}. Use one bottom primary button whose label comes from state (Check -> Continue -> Finish lesson), a secondary 'Explanation' button, a 'Start over' reset, and a flag/report icon.
- Record first-attempt correctness separately from eventual correctness on every item, as Brilliant does in its K-5 player. Feed mastery and spaced-review scheduling from first-attempt data. Award a perfect-lesson flag (Koji's flip) only when all first attempts are correct. Always allow retries and never block forward progress after a wrong answer.
- Make explanations available after correct answers too, and author or generate them as staged, step-by-step animated sequences tied to the same interactive canvas. Fix the top user complaint (terse, puzzle-like explanations) by offering several depths: a short verdict, a worked steps view, an 'explain differently' option, and a glossary popover for every technical term on first use.
- Build a typed library of interaction primitives that all share one interface (render, getState, setState, validate, reset, describeForTutor, highlightTargets): single/multi-select MC, numeric keypad, structural math editor (fraction/root templates, cursor navigation, several answer boxes with per-box green/check feedback), drag tiles with visible handles, sliders, draggable graph points, grid shading, balance scale, ordering/sorting, code editor with Run plus hidden tests (predict/debug/complete-the-logic), drag-and-drop code blocks, circuit/gear/logic simulations. Per-field validation and a reset-to-pristine action are required by every primitive.
- Expose sub-element IDs and state from every primitive so a local AI tutor can highlight, annotate, or rearrange elements (Koji parity). Keep a separate low-noise verdict channel (short correct/incorrect message) that stays on when tutor chatter is muted. Add optional read-aloud (TTS) of prompts and explanations.
- Implement practice as the same player in a 'scaffolds-off' mode: hide hints and visual aids. Offer selectable session lengths (5 quick check / 15 practice) with difficulty ramping across the chosen length, interleaved mixed-topic sets that force method choice, and an end summary with an XP breakdown. Ship a real cumulative spaced-review queue from day one; Brilliant is only partly rolling this out, and users explicitly ask for it.
- Use parameterized item generators with explicit value ranges, distractor rules (e.g., 'five nearby choices'), and misconception metadata per skill (as in Brilliant's K-5 skill guides). Use the misconception tags to pick targeted feedback and to schedule remediation items.
- Add a mastery-check node type plus a pre-lesson 'lesson plan' warm-up that tests prerequisites. A failed check should generate targeted practice instead of just gating, matching Brilliant's 2026 homepage claims while staying knowledge-aware.
- Support variable lesson lengths in the schema, from 1-exercise puzzle-of-the-day lessons up to about 25-item lessons. Use a module/layout-engine lesson format with optional branching edges (Brilliant's posting names 'branching paths'), so dynamic and adaptive paths can reorder or insert modules at runtime.
- Run the post-lesson celebration chain (lesson complete -> XP breakdown -> streak increment -> streak-charge award) from a declarative event queue. Make every celebration skippable and add a global 'focus mode' and reduced-motion setting that collapses it to one summary line; long-time users criticize this kind of gamification. Add a sound-effects toggle (default on) and optional haptics on mobile wrappers.
- Home UI: a vertical node trail per course with node types (lesson, practice, level/mastery check, review). Tapping a node opens a modal with title and Start. A resume card and a weekly streak strip go on Home. Add a free-text 'What do you want to learn?' box that compiles a custom path from the local skill graph, a stronger version of Ask Koji routing.
- Local-first gives offline support for free; Brilliant removed offline lessons, so call this out as a differentiator. Persist per-item attempt logs locally to power review-and-reflect screens, personal 'problems I missed' bookmarks (requested by users), and history-based stats in place of Brilliant's social '% who answered correctly'.
- Turn 'Report a problem' into a local content-QA loop: flagged items are quarantined and sent back to the generator/eval pipeline for regeneration, with a disabled-until-selected reason picker as in Brilliant.
- Harden input: use Pointer Events for mouse, touch, and pen together. Never use swipe gestures for problem navigation, since they collide with sliders and drags. Make handles visually obvious with first-use affordance hints. Avoid styling that dark-mode extensions or forced-colors modes break, and test drag interactions at 60fps on low-end mobile.

## Open questions

- Is there an in-lesson progress bar or segment indicator, and does it show item count? No fetched source documented one.
- Exact retry semantics in the main lesson player: can 'Back to problem' re-answer for credit, is there a retry limit, and does a wrong first attempt reduce XP? Retry with first-attempt tracking is documented only for the K-5 and coding players.
- What the 'Review and reflect' screen contains (recap of missed items, self-assessment, key takeaways) and whether accuracy is shown on the Lesson complete screen.
- Whether a standalone (non-Koji) hint button still exists in 2026 lessons for free users after the Koji preview runs out or in courses without Koji; the Learnopoly evidence of hints on most problems may be historical.
- How Koji's speaking at the start of each lesson page is laid out relative to the canvas (overlay bubble vs side panel), and how intermediate interactive questions posed by Koji are rendered.
- Level check format: number of items, pass threshold, retry policy, and what happens on failure.
- How branching paths inside lessons work and how often they are used.
- Leagues unlock conflict: the capture shows a 175 XP unlock gate, while the help center says you join on the first XP of the week. Possibly an A/B test or a since-changed rule.
- Web keyboard shortcuts (e.g., Enter to Check) and haptic patterns on mobile: no source found.
- Research limits this pass: the web search budget ran out before searches on sound settings and keyboard/dark-mode support; reddit.com is blocked for the fetch agent; YouTube pages returned no descriptions or transcripts; archive.org is blocked; the Common Sense Education review has been taken down; uxdesign.cc/Medium returned 403. A follow-up pass could use those sources if access allows.

## Verifier summary

I re-fetched all 12 sources: ScreensDesign full alt-text listing, the brilliant.org remediation help page, /faq/, the K-5 practice guide, the Python-for-teens resource page, the brilliant.org homepage alt text, the interactives help page, the workingnomads and dynamitejobs job mirrors, the Nibble blog and the Learnopoly review. The original Lever postings now return 404. Results: 1 confirmed (LP-07), 1 confirmed with a nuance (LP-11), and 10 corrected. None were refuted. The main problems:
(a) Several ScreensDesign-based findings (LP-02 to LP-06) overstate sequence and uniformity. The gallery is unordered alt text. Its examples were sometimes misattributed: the 8/25/20 kg screens are pre-submit selection screens, not correct banners. Variants exist: 'Review and reflect' appears instead of Continue after a correct answer, 'Finish' appears without Explanation on an incorrect panel, and one explanation screen has only Continue.
(b) Two screens (a feedback banner with Check still present, and Check+Explanation together) suggest retry is possible in lessons. That cuts against a strict idle->checked->next state machine and supports a retry or first-attempt design.
(c) The 2018 Android 3.9.1 'scrolling bug' note could not be found.
(d) LP-13 overgeneralizes 'each interactive'. Also, 'if tiles get messy' is a paraphrase, not a quote.
(e) In LP-14, 'probability' and 'digital circuits' are topics, not interaction types.
(f) LP-15 is a product-architecture claim sourced only from a third-party mirror of a closed 2023 posting, so I downgraded it to observed.
(g) LP-09's retry and first-attempt tracking is documented only for the free K-5 hub, which currently has only K and Grade 1 live.
(h) LP-10's counts are for Thinking in Python only. 'Predict' is a pedagogy statement, not a counted task type.
