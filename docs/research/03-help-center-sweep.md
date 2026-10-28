# Help Center sweep: product mechanics

- **Dimension:** `help_center_sweep`
- **Findings:** 44 (30 load-bearing)
- **Adversarial verification:** confirmed: 6, corrected: 6

> Epistemic markers: `verified` = official Brilliant source; `observed` = docs, demos, archives,
> reviews; `inferred` = reasoning. Tier: 1 official … 7 third-party.

## Findings

### HC-01: The Brilliant Help Center has nine categories, and none of its articles covers dark mode, language or localization settings, screen-reader support, a Daily Challenge, or offline download.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/>
- **Detail:** Categories: Brilliant Basics (/help/using-brilliant/), Product Features (/help/features/), Courses & Curriculum, Pricing & Plans, ESAs & Public Funding, Standards Alignment (18 framework mappings), Schools & Educators, Account Management, Help & Support. Product Features has 12 articles: Koji, Ask Koji, interactives, Learning Paths, XP, Leagues, streak, Streak Charge, widget, reset progress, parent dashboard, dyscalculia. A search for dark mode or language help pages found nothing official.

### HC-02 ★: A lesson takes 5-10 minutes: about 5 interactive problems followed by a 3-problem Skills Check. A level is about 6 lessons and ends with a 10-15 problem review.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/schools-and-educators/how-brilliant-fits-into-a-math-lesson/>
- **Verification:** **corrected**. Correction: Lessons usually take 5-10 minutes. A typical lesson is a short sequence of interactive problems followed by a Skills Check, and the page gives no general problem count. A level is a group of related lessons capped with a 10-15 problem review. The specific counts come only from the Solving Equations example: about 5 interactive problems plus a 3-problem skill check per lesson, about 6 lessons plus a level review per level, and 13 levels. Teachers can assign a full lesson, a level or a course, or share or project a single problem. (`verified`). Note: Re-fetched. The page introduces the counts with 'For example, in the Solving Equations course...'. It does not say they apply to all courses. The claim turns that example into a general rule for every lesson and level, which matters for the rebuild's content model. The 5-10 minutes, the 10-15 problem review and the assign/share options are general statements and are confirmed.
- **Detail:** Lessons are 'usually 5–10 minutes each'. A level is 'capped with a 10–15 problem review that revisits the core ideas'. Solving Equations example: about 5 interactive problems plus a 3-problem skill check; the course has 13 levels. Teachers can assign or share a whole course, a level, a lesson or a single problem.

### HC-03 ★: Level Reviews have 10-15 problems with no hints and work as a readiness signal, not a formal diagnosis.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/schools-and-educators/is-brilliant-a-core-curriculum-or-a-supplement/>
- **Verification:** **confirmed**. Note: Re-fetched. The page says 'level reviews (10–15 problems, no hints)' and that they 'can give a signal on whether a student is ready to move or identify a learning gap'. It says this does 'not replace formal diagnosis or individualized planning'. Students 'are prompted to try again, rather than getting docked points or other visual reprimands.' It also says Brilliant is 'not a full intervention program on its own.'
- **Detail:** Described as '10–15 problems, no hints'. They signal whether a student is ready to move on or has a gap to revisit. Wrong answers prompt a retry 'rather than getting docked points or other visual reprimands'.

### HC-04 ★: A learner who fails a Skills Check gets new practice problems, chosen from what that learner got wrong. Brilliant says it does not auto-place students the way a formal diagnostic does.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/schools-and-educators/differentiation-guide/>
- **Verification:** **corrected**. Correction: If a learner doesn't ace a lesson's Skills Check, they get another try with new practice problems. Separately, Brilliant's practice system 'uses what a learner has made mistakes on and responds with useful next problems.' The page does not say that the Skills Check retry problems are picked from that learner's specific errors. Asked whether Brilliant automatically changes or chooses the right lesson for each student, the page answers 'Not in the way a formal diagnostic or placement system would.' Teachers still choose starting points, and lessons are self-paced. (`verified`). Note: Re-fetched with exact quotes. Two things were wrong. First, the source says 'doesn't ace', not 'fails'. Second, the claim merges two separate statements: the Skills Check retry and the general practice system. Saying the retry problems are chosen from the learner's mistakes is an inference. The no-auto-placement part is accurate, but note that the course-placement guide does describe a signup diagnostic and acceleration suggestions.
- **Detail:** Practice 'uses what a learner has made mistakes on' to choose the next problems. Each lesson ends with a Skills Check and each level with a Level Review. Brilliant does not 'automatically change or choose the right lesson for each student'; teachers choose starting points. Lessons are self-paced.

### HC-05 ★: Skills Check scores count every response, retries included, so a score can be higher than the number of questions. The teacher Progress view shows per-student, per-lesson Skills Check scores grouped by level.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/schools-and-educators/assignment-and-progress-reporting-guide/>
- **Verification:** **confirmed**. Note: Re-fetched. The page says 'The score counts every response, including retries, so a student who missed a problem and tried again might show 4/5.' Selecting a course shows 'every lesson in it, grouped by level' with a per-student Skills Check score for each lesson, for example 3/3. The default view shows Lessons completed per student with one column per course. Date filters are all time (default), last 7 days, last 30 days or a custom range; there are also course and 'Assigned lessons only' filters. Data is current as of page load. The page says it 'is not a formal gradebook' and that a score 'is not a grade.' Completion status appears separately, in the Assignments tab under 'Show progress'.
- **Detail:** 'The score counts every response, including retries'. The Progress tab shows lessons completed per student, one column per course. Filters: date range (all time, last 7 or 30 days, custom), course, and 'Assigned lessons only'. Data is only as current as the last page load, and Brilliant is 'not a formal gradebook'.

### HC-06 ★: Brilliant tracks lesson performance and suggests moving ahead when a learner is breezing through. A learner who jumps ahead must first pass the level check that gates the later material.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/courses-and-curriculum/course-placement-guide/>
- **Verification:** **confirmed**. Note: Re-fetched. The page says Brilliant 'keeps learning from the learner's work in the product' and, for work that is consistently easy, 'will suggest accelerating ahead and uses level checks to confirm readiness.' It says 'The level check will confirm whether the learner is ready' before later material unlocks, and 'Jumping ahead with a level check requires a Brilliant Premium or Brilliant for Educators account.' The diagnostic recommends a start 'based on readiness, not age or school grade alone', and 'Outside help can make the starting recommendation less useful.' The three zones match, and the too-difficult zone also says to contact support. No pass threshold or format is given.
- **Detail:** Brilliant 'will suggest accelerating ahead and uses level checks to confirm readiness'. Jump-ahead requires a Premium or Educator account. The signup diagnostic places by 'readiness, not age or school grade alone', and parents are told to let the child take it without help. Fit is described in three zones: too easy (jump ahead and take the level check), productive challenge (stay), too difficult (go back to prerequisites). No pass threshold or format is given.

### HC-07: Free keys refresh at midnight local time, and practice sets use keys just as lessons do. A user petition says warm-ups also cost a key.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/pricing-and-plans/what-s-the-difference-between-free-and-premium/>
- **Detail:** '2 keys per day', each unlocking one lesson or practice set. Premium can 'Jump directly to any lesson in any course'. A March 2026 change.org petition complains that warm-ups use keys, so learners can effectively start only one topic a day, and asks for extra keys on course completion.

### HC-08 ★: You can reset progress per lesson (Redo/Review, then Reset lesson) or per level on web ('Reset progress to here', which wipes that level and every later one and cannot be undone). There is no whole-course reset.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/features/can-i-reset-course-progress/>
- **Verification:** **confirmed**. Note: Re-fetched. Lesson reset: Redo icon or Review button, then 'Reset lesson', then confirm. Level reset: 'On web, you can also reset progress on a level-by-level basis.' 'Reset progress to here' 'erases your progress in that level and every level after it' and 'can't be undone.' The page says 'Brilliant does not offer a feature to reset an entire course at once.' XP and streaks are not mentioned. Which platforms support lesson reset is not stated.
- **Detail:** Brilliant 'does not offer a feature to reset an entire course at once'. Level reset is web only. The article does not say whether resets affect XP or streaks.

### HC-09 ★: Most problems are interactive rather than multiple choice. Input uses a structured math keyboard with fraction and square-root templates, and each problem has a 'Start over' reset.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/features/how-do-i-use-interactives-on-brilliant/>
- **Verification:** **corrected**. Correction: The page says most problems are interactive rather than multiple choice: learners type, drag and manipulate elements. The math keyboard's □/□ key creates a fraction and √ adds a square root with an empty box. ► moves forward into a denominator or back out of a fraction or root, and ◄ moves back. ⌫ removes the last entry. With several answer boxes, you tap one to select it, and the active box has a blue outline. A correct answer turns the box green with a checkmark. In Negative Numbers you drag the pill-shaped handle at the bottom of the tile stack down to add negative tiles and back up to remove them; the page says you don't tap tiles to add them. A 'Start over' button below the problem resets it. (`verified`). Note: Re-fetched. Everything checks out except 'tapping does nothing', which overstates the source's 'You don't tap the tiles to add them.' Dragging back up to remove tiles was missing from the claim.
- **Detail:** Fraction (□/□) and √ keys insert templates; you press ► to step out of one, arrow keys move the cursor, and delete removes the last entry. When there are several answer boxes, you tap one to select it and it gets a blue outline. A correct answer turns the box green with a checkmark. The Negative Numbers course uses tiles: drag a pill handle down to add negative tiles; tapping does nothing. 'Start over' clears the problem.

### HC-10 ★: A wrong answer is never penalized. The learner retries, can ask for hints, and sees an explanation when wrong.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/schools-and-educators/how-brilliant-works-in-real-classrooms/>
- **Verification:** **corrected**. Correction: Official help pages say wrong answers prompt a retry 'rather than getting docked points or other visual reprimands' (is-brilliant-a-core-curriculum-or-a-supplement page). Lessons are 'scaffolded with built-in hints' and offer 'feedback, hints, and explanations' (how-brilliant-fits-into-a-math-lesson page). The cited classroom page supports only a teacher testimonial ('It gives explanations when a student gets something wrong') and Brilliant's own narration of a 'low-pressure retry structure.' 'Never penalized' and 'hints always available' are overstated: Level Reviews have no hints, and Skills Check scores count wrong attempts, so a retry can show 4/5. (`verified`). Note: The cited URL does not support most of the claim. It mentions nothing about penalties or hints, and nothing about an explanation preview from Solving Equations; it names that course only as a teacher's favorite. The 'explanation when wrong' quote is a teacher's opinion published on an official page, not a product specification. Other official pages support a no-docking retry model, but HC-03 and HC-05 contradict the absolute wording.
- **Detail:** A teacher case study: 'It gives explanations when a student gets something wrong', with a low-pressure retry structure. Another page shows a preview of answer explanations from a Solving Equations lesson.

### HC-11: Notifications come in four toggleable categories: daily practice reminders, league reminders, course recommendations, and streak alerts. Email and push are controlled separately.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/account-management/how-can-i-adjust-my-notification-preferences/>
- **Detail:** Email can be set on web and mobile; push exists only in the mobile app, with separate toggles. A 'Don't send me anything' option opts out per channel, though transactional mail is still sent. No setting for reminder time and no default states are documented.

### HC-12: The home-screen widget is iOS-only. It shows streak status and, if you have not practiced that day, prompts that grow more urgent as the day goes on.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/features/does-brilliant-have-a-widget/>
- **Detail:** 'The widget is currently only available on iOS.' Tapping it opens the app. Sizes are chosen when adding it. It does not show problems or progress.

### HC-13 ★: Brilliant does not work offline. Lessons need an internet connection and cannot be downloaded; progress syncs automatically across devices.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/using-brilliant/can-i-download-brilliant-lessons-or-use-them-offline/>
- **Verification:** **corrected**. Correction: The page says lessons 'aren't available for download or offline use at this time' and 'currently require an internet connection to access.' It says Brilliant works on 'any device with an internet connection—web or mobile', and 'progress syncs automatically between devices.' (`verified`). Note: Re-fetched. The no-offline and sync claims are confirmed; the page frames the no-offline policy as current ('at this time', 'currently'). The page does not name native iOS and Android apps or 'any web browser', only 'web or mobile', so that part of the detail goes beyond this source.
- **Detail:** Lessons 'aren't available for download or offline use'. The platforms are native iOS and Android apps plus any web browser.

### HC-14: Besides Streak Charges, eligible long streaks may get a free automatic save. With no protection, the streak resets to 0. The current streak is shown on the home page.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/features/what-is-a-streak/>
- **Detail:** 'Eligible long streaks may also receive a free automatic save'; the eligibility criteria are not given. The article mentions no streak repair, milestones, or longest-streak record.

### HC-15: You are placed into a weekly league group when you first earn XP that week, not at the weekly reset. Weekly XP is shown in the Leagues section of the home page.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/features/what-is-xp/>
- **Detail:** 'You join a new league group when you first earn XP that week'. XP 'corresponds to the time and effort required'; no point values, bonuses, or caps are published. The leagues article gives no tie-break, opt-out, or friends leaderboard.

### HC-16: Brilliant offers no certificates, credits, or transcripts. The profile shows completed courses, streaks, XP, and completed lessons.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/courses-and-curriculum/does-brilliant-offer-certificates/>
- **Detail:** 'Brilliant does not currently offer completion certificates, course credits'. Brilliant is accredited by ACS WASC but does not grant degrees. The homeschool page says families must build their own portfolio.

### HC-17 ★: Koji works in nearly all math and coding courses but not all courses. It can be muted on each platform. It stays on topic behind safety filters, and staff get live alerts about problem conversations.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/features/how-does-koji-work/>
- **Verification:** **confirmed**. Note: Re-fetched. Coverage is 'most courses – nearly all of our math and coding courses', and is expanding. To mute on desktop, click the sound icon at the top left; on mobile it is at the top right and needs the chat open to be visible; there is also a setting in account preferences. Muting stops the speech bubbles but keeps the small correct/incorrect feedback messages. 'Koji always stays on topic' and advanced safety filters are on. Brilliant receives live alerts about problematic conversations. Third-party processors have zero data retention, and the data is not used for model training. The page says Koji is 'exceedingly unlikely to make a math mistake', at a rate similar to its human content errors. Free users get 'a limited preview of Koji', size unstated.
- **Detail:** Mute: sound icon at top-left on desktop; on mobile, top-right and visible only while chat is open; also an account toggle. Muting hides speech bubbles except the small correct/incorrect feedback. Third-party processors have zero data retention and no training on the data. Brilliant says Koji is 'exceedingly unlikely to make a math mistake'. Free users get a limited preview of unstated size.

### HC-18 ★: 'Ask Koji' on the web Home tab takes a plain-language math question, finds the topic, and sends the learner to the matching lesson or practice. Koji then stays available inside that lesson.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/features/ask-koji-a-math-question-and-find-the-right-lesson/>
- **Verification:** **confirmed**. Note: Re-fetched. The page says 'This is available to all web users in the Home tab.' Input is plain language, for example 'I need help with quadratic equations', and 'The learner does not need to know the course or lesson name.' Koji 'routes the learner to relevant instruction or practice' and Brilliant 'recommends relevant instruction or practice'. Koji stays available during the work, highlighting information and asking guiding questions. Scope is 'Brilliant's math curriculum.' The only description of matching is that Koji 'interprets the question'. Mobile is not mentioned.
- **Detail:** Example prompt: 'I need help with quadratic equations.' The request does not need a course or lesson name. The matching method is not described. Only web users are mentioned, and coverage is limited to the math curriculum.

### HC-19 ★: The dyscalculia article is Brilliant's de facto accessibility statement. It relies on Koji reading problems and explanations aloud, drawing graphics and hints over the interactive, and re-explaining on request.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/features/is-brilliant-good-for-learners-with-dyscalculia/>
- **Verification:** **corrected**. Correction: The dyscalculia help page lists Koji features that support learners: it 'can narrate problems and explanations aloud', walk through reasoning step by step in chat, 'overlay additional graphics and hints directly on the interactive', and re-explain or break things down on request. It says the visual and interactive approach, combined with Koji's audio explanations, reduces the reading load for dyslexic learners. It mentions no text-size, pacing, timer or screen-reader settings. No dedicated Brilliant accessibility statement was found, so calling this page the 'de facto accessibility statement' is an inference. (`inferred`). Note: The feature quotes are confirmed as official (verified). Two problems: (1) the detail credits the reduced reading load to the overlays, but the page credits the visual/interactive approach plus Koji's audio together. (2) 'De facto accessibility statement' is the researcher's own reading. brilliant.org/accessibility returns 404, and site searches turned up no Brilliant accessibility help article. Searches are not proof that none exists, but the page's role should still be marked as inferred.
- **Detail:** Koji can 'Overlay additional graphics and hints directly on the interactive.' The page says this 'reduces the reading load' for dyslexic learners. It describes no settings for text size, pacing, timers, or screen readers.

### HC-20 ★: The App Store listing declares no accessibility features and lists English as the only app language.

- **Status:** `observed` · Tier 4 · <https://apps.apple.com/app/brilliant-learn-by-doing/id913335252>
- **Detail:** The developer 'has not yet indicated which accessibility features this app supports.' Age rating is 4+ with Age Assurance controls. Version notes from 9.18.0 to 10.5.1 are all generic bug-fix text. A web search found no VoiceOver or screen-reader documentation.

### HC-21 ★: Coding content follows a published Coding Skills Framework: 14 Big Ideas, 79 coded learning objectives, and 302 skills, split into two halves.

- **Status:** `verified` · Tier 1 · <https://brilliant.org/coding-skills/>
- **Detail:** Foundations of Computer Science: 7 Big Ideas, 42 objectives, 196 skills (Control Flow & Logic, Functions & Modularity, Inductive Thinking, Problem-Solving Principles, Analyzing Efficiency, Data Structures & Interfaces, Algorithm Design). Coding with AI: 7 Big Ideas, 37 objectives, 106 skills (Specification & Design, Designing Workflows, Verification, Security, Abstraction, Taste, Developing Incrementally). Objectives have codes, e.g. CFL-1 'Store and combine values with variables and expressions', with skill statements and examples beneath.

### HC-22 ★: Brilliant audits its coding coverage per skill, rating each Covered, Partial, or Gap and computing coverage as (Covered + 0.5 × Partial) ÷ total.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/courses-and-curriculum/how-brilliants-coding-coverage-was-audited/>
- **Detail:** September 2026 results: overall 55% (150 Covered, 32 Partial, 120 Gap). Foundations 76%; Coding with AI 16% (Security 0%, Taste 4%). Benchmarks: MIT 6.0001 88%, CS50x 50%. Named gaps: dynamic programming, divide-and-conquer, trees, hash tables, stacks/queues/heaps, version control. Each judgment links to live lessons; it is not stated whether people or AI did the mapping.

### HC-23 ★: The 10 code-writing courses hold 274 lessons, 618 practice sets, and 3,282 problems, broken down by problem type.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/courses-and-curriculum/what-brilliant-covers-for-college-level-coding-and-early-software-careers/>
- **Detail:** By type: 2,081 run-and-edit code problems; 161 'What's the output?'; 689 diagnose/repair (361 repair, 328 diagnose; 649 of them in practice sets); 561 algorithm design/revision; 329 data structures. The 10 courses are a 6-course Python track plus 4 Foundations courses; 17 CS-related courses were audited in total. A Coding-with-AI course is planned.

### HC-24 ★: The Python practice page says practice sets are generated from the learner's progress and that the platform tracks which concepts the learner has mastered.

- **Status:** `verified` · Tier 1 · <https://brilliant.org/topics/python/practice/>
- **Detail:** Feedback is described as instant and 'custom, intelligent'. Learners 'start at your level' and ramp up. The page's catalog sidebar lists Science as only Scientific Thinking, Circuits, Digital Circuits, and Quantum Computing. No problem counts or editor details are given.

### HC-25 ★: The K-5 Math Practice library is free and needs no account. It is organized by grade and topic as quizzes; only Kindergarten and Grade 1 are live.

- **Status:** `verified` · Tier 1 · <https://brilliant.org/practice/>
- **Detail:** Kindergarten has 30 quizzes and Grade 1 has 42; Grades 2-5 are 'Coming soon'. Live topics: Counting 11, Comparing 6, Addition 32, Subtraction 9, Multiples 1, Time 13; Multiplication, Fractions, Decimals and others are coming. URL pattern is /practice/<grade>/<topic>/<skill>/, e.g. /practice/grade-1/time/analog-time-on-the-hour/. Representations include fingers, five and ten frames, ten strips, dice, dots, base-ten blocks, and clocks.

### HC-26 ★: K-5 practice offers two session lengths, Quick check (5 questions) or Practice (15). It allows a retry after an error, records both first-attempt and final accuracy, and stores progress only on the device.

- **Status:** `verified` · Tier 1 · <https://brilliant.org/practice/guides/free-math-practice-without-an-account/>
- **Detail:** Difficulty ramps within a session and adjusts to the chosen length. 'Progress is stored only on the device unless the learner resets it.' Printable worksheets work without an account. Each skill guide lists prerequisites, representations, standards, common misconceptions, and a recommended next quiz.

### HC-27 ★: Each K-5 skill has its own rule-based generator. A fresh set is generated every time practice opens or restarts, and every problem must pass validity rules before it is shown.

- **Status:** `verified` · Tier 1 · <https://brilliant.org/practice/guides/trust-and-methodology/>
- **Detail:** Generators choose values and visual layouts from rules written for each learning objective. Answer choices are checked against a deterministic solution, and diagrams must match the stored answers. Difficulty is defined by observable features: number range, number of steps, visual support, and expected strategies. Each skill stays within its published range. The curriculum team reviews for correctness, developmental fit, clarity, progression, and likely misconceptions.

### HC-28 ★: The Common Core map works at lesson level from grade 3 through high school, can be searched by standard code or skill, and lists only the standards Brilliant fully or partly covers.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/standards-alignment/common-core-math-coverage/>
- **Detail:** Each row gives the standard code, a description, the course, and the lesson(s). Examples: 7.EE.4.a maps to Linear Equations, 'Solving two-step equations'; 8.G.7 maps to Coordinate Geometry, 'Finding side lengths with the Pythagorean theorem'. Uncovered standards are not flagged. Coverage by grade band appears elsewhere (e.g. 91-100% for grades 6-8).

### HC-29 ★: Standards pages are generated from an internal skill-level map: each Brilliant 'skill' links to a lesson and is tagged to an external standard or testing point. The pages are regenerated against the live catalog with a pull date.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/standards-alignment/digital-sat-math-coverage/>
- **Detail:** Eighteen frameworks are mapped: Common Core, Digital SAT, PSAT, ACT, NY Regents, AP Precalculus, NC Math 1-3, GCSE, A Level, IB AA SL and HL, GRE, GMAT, TEKS, GED, and TSIA2. On the SAT page, skills that only build toward a testing point are excluded. Example: ALG.4 maps to 'Solving systems by graphing' at /courses/linear-systems/solving-by-graphing/ls-level2-1/. The curriculum team 'maps skills to standards skill by skill against the live course catalog' (pulled Sept 30, 2026 for Algebra 1).

### HC-30 ★: Courses ship with levels announced before they are written. Derivatives has 4 of 11 levels written and Limits has 4 of 12.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/courses-and-curriculum/does-brilliant-cover-calculus/>
- **Detail:** Calculus has 42 lessons, Derivatives 23, Limits 27. Coverage is 'deep on the concepts and thin on technique'. There is 'no free-response practice, no scoring rubrics, and no timed full-length sections', and no multivariable calculus, linear algebra, or differential equations course. Prerequisite lesson counts: Trigonometric Functions 70, Equations and Curves 61, Polynomials 52, Exponential Functions 42, Vectors 39, Polar Coordinate Plane 35, Logarithms 29.

### HC-31 ★: Brilliant calls itself 'a reasoning-and-practice layer, not an arithmetic-fluency drill', and lists procedural gaps that learners should fill elsewhere.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/courses-and-curriculum/what-brilliant-covers-for-sixth-grade-math/>
- **Detail:** Sixth-grade gaps: standard algorithms (multi-digit long division, decimal operations, fraction division), GCF/LCM, unit conversion, volume with fractional edges, and statistical vocabulary. Sixth-grade content is spread across about 10 topic courses, each with a 'Start here' lesson link. Real-World Algebra is a 12-lesson on-ramp. Brilliant does not offer a complete K-3 arithmetic sequence.

### HC-32 ★: The official subjects page lists Science & Technology as classical mechanics/physics, neural networks/ML, LLMs, digital circuits/computing, and crypto/blockchain only. It does not mention chemistry or biology.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/courses-and-curriculum/what-subjects-does-brilliant-teach/>
- **Detail:** Math is called the 'deepest and most comprehensive subject area'. Coding covers Python, Thinking in Code, algorithms/data structures, AI, and memory/architecture. The Educators course page has science as physics, scientific reasoning, circuits, and modern technology, with no grade bands.

### HC-33 ★: Retired courses go to an 'Archived' section on the desktop web Courses page, and courses may be merged, split, or renamed. The help center does not say what happens to a learner's progress.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/help-and-support/why-is-my-course-missing/>
- **Detail:** Courses that no longer meet Brilliant's 'threshold for content or best practices' may be retired. Content changes add lessons, add practice, or improve explanations and visuals. The articles name no specific retired courses.

### HC-34 ★: A paying user reported in April 2025 that courses had disappeared over the past year, including the chemistry course 'Chemical reactions'. Brilliant's reply did not address the removal.

- **Status:** `observed` · Tier 6 · <https://apps.apple.com/app/brilliant-learn-by-doing/id913335252>
- **Detail:** Reviewer jamanjeval (04/07/2025) started 'Chemical reactions', paused it, and found it gone. The developer reply (04/09/2025) only acknowledged the need for 'consistent course availability'. This supports the user's report that the catalog has narrowed.

### HC-35 ★: Brilliant's wiki is no longer maintained but survives as a read-only archive. Its topic list shows the old breadth: Chemistry, Biology, Electricity and Magnetism, Mechanics, and Quantitative Finance alongside the math and CS topics.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/help-and-support/does-brilliant-still-have-a-wiki/>
- **Detail:** 'Brilliant's wiki is no longer maintained.' Approximate page counts (my tallies from the archive list): Algebra ~195, Geometry ~175, Discrete Math ~150, Computer Science ~145, Mechanics ~135 (kinematics, waves, quantum), Calculus ~130, Number Theory ~85, Quantitative Finance ~70, Chemistry ~55, Basic Math ~45, Electricity & Magnetism ~40, Biology 8. Example pages: /wiki/capacitors/, /wiki/mole/.

### HC-36 ★: Brilliant used to have Daily Problems: two questions a day across subjects, each with a hint-style 'insight' lesson and community explanations that users voted on.

- **Status:** `observed` · Tier 7 · <https://www.cultofmac.com/?p=604148>
- **Detail:** From a February 2019 review: questions were mostly multiple choice, with no penalty for wrong answers. After answering, users could read peer explanations ranked by votes. Premium unlocked the archive of past daily questions. Difficulty ranged from easy to hours of thought.

### HC-37: Android release notes from 2019 mention daily challenges with 'show explanations', interactive solvables added to quizzes, and an offline mode.

- **Status:** `observed` · Tier 4 · <https://www.apkmirror.com/apk/brilliant-org/brilliant/brilliant-4-7-3-release/>
- **Detail:** 4.7.2 'Fixed a bug with show explanations in daily challenges.' 4.7.0 added interactive solvables to some quizzes, rebuilt quiz screens, 'Improved offline mode detection', and improved community UI (4.7.3 released Oct 31, 2019). Earlier notes list 'Support for Daily Problems' (4.1.0).

### HC-38: Daily Problems appears to be discontinued: brilliant.org/daily-problems/ now returns only the generic homepage title.

- **Status:** `inferred` · Tier 1 · <https://brilliant.org/daily-problems/>
- **Detail:** The fetch returned only 'Your Personal Tutor for Math and Coding' with no problem content, and llms.txt and the help center never mention a daily challenge. The removal date is unknown. This is inferred from the redirect and the absence of documentation.

### HC-39 ★: Content errors are reported per question: a flag icon next to Continue after answering in a lesson, a 'Report problem' button when leaving practice, and shake-to-report on mobile with an automatic screenshot.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/help-and-support/how-can-i-report-bugs-issues-i-m-encountering-on-brilliant/>
- **Detail:** The mobile shake report captures a screenshot and technical details. Koji can point learners to the right reporting tool. Feature requests go by email only.

### HC-40: Teachers can assign a course, level, or lesson to a whole class or to individual students, with an optional due date, a required/optional flag, and a note. Assigning never locks a student out of the rest of the catalog.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/schools-and-educators/assignment-and-progress-reporting-guide/>
- **Detail:** The Lessons tab searches by keyword, topic, or standard and filters by grade. Assignments can be shared by copied link or 'Share to Google Classroom', and students see them in an Assignments tab. Status values are Completed, In progress, and Not started. 'There is currently no setting that locks a student out of the rest of the catalog.'

### HC-41: Educator accounts allow unlimited classes, set each student's starting point, and roster through Google Classroom sync, invite links, or ClassLink/OneRoster single sign-on.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/schools-and-educators/what-is-brilliant-for-educators/>
- **Detail:** Students get Premium with no daily limits and no ads. ClassLink requires a OneRoster roster, student email as the identity key, and LaunchPad SSO. Data privacy agreements are signed at district or state level. Content is grouped by grade band, and lessons can be searched by Common Core code.

### HC-42: A parent links a learner by converting the learner's account to a supervised child account; history stays with the child. Dashboard accuracy comes only from skill and level checks, not from all practice.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/features/parent-progress-dashboards-on-brilliant/>
- **Detail:** In Family Management, select 'Make this a child account'. Learners under 18 are supervised immediately; learners 18 or older must accept. Child accounts need only a name, age, and username, no email. Under-13 accounts need guardian consent. Supervised learners never see pricing or checkout. The dashboard is at brilliant.org/you. A Family Plan has 6 seats.

### HC-43: Brilliant suggests about 20 focused minutes a day, says most kids are ready around age 10, and suggests a parent read lesson text aloud for younger readers.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/using-brilliant/how-can-parents-support-their-childs-learning/>
- **Detail:** 'Short and consistent beats long and occasional.' Children of 7 or 8 with solid arithmetic can do well. The homeschool page suggests three or four focused sessions a week.

### HC-44: Each Learning Path carries a level, either a grade range or a tier (Foundational, Intermediate, Advanced), and includes 'regular practice checkpoints'. Free users can start any course but must take its lessons in order.

- **Status:** `verified` · Tier 2 · <https://brilliant.org/help/features/what-are-learning-paths/>
- **Detail:** Premium users can take courses 'in any order you'd like'. Paths are not personalized; each just has a recommended course order. The page describes no way to switch paths or display progress.

## Implications for the rebuild

- Build assessment in three tiers with the same names: Skills Check (about 3 items, end of each lesson), Level Review (10-15 items, no hints, end of each level), and Level Check (gate for jumping ahead). Store every attempt, not just the final answer, so first-attempt and eventual accuracy can both be reported (HC-05, HC-26).
- When a Skills Check fails, build the next practice set from that learner's own error log. Add spaced review and interleaving on top, which Brilliant's help center describes only loosely.
- Use the skill as the atomic unit of the content model. Each skill gets a code, a statement, an example, prerequisites, representations, common misconceptions, a difficulty envelope, and tags to external standards (Common Core, NGSS, AP, and so on). Lessons and practice sets reference skills, which lets the app generate standards coverage pages and run Covered/Partial/Gap audits automatically (HC-21, HC-22, HC-29).
- Use Brilliant's coverage formula, (Covered + 0.5 × Partial) ÷ total per Big Idea, as a built-in breadth dashboard. Point it at restored STEM frameworks (chemistry, biology, electricity and magnetism, mechanics) so the user can see which skills are missing and request generated lessons for them.
- Copy the K-5 generator contract for every practice skill: a rule-based generator per skill, a fresh set on every open, validity rules before display, answers checked against a deterministic solver, and difficulty defined by observable features within a published range (HC-27). This matches the established LLM-config-plus-evals pipeline but makes the deterministic path the default.
- The K-5 library already stores progress only on the device, so a local-first design has precedent. Go further: full offline lessons with no sync dependency, since Brilliant requires a connection (HC-13).
- Give each problem a structured math input with fraction and root templates, multiple fields with an active-field outline, green-check feedback, a 'Start over' reset, and a retry loop with no penalty plus an explanation when wrong (HC-09, HC-10).
- Allow progress resets per lesson and per level ('reset from here'), plus a whole-course reset, which Brilliant lacks. Keep resets reversible through snapshots, since local storage makes that cheap.
- Treat science breadth as a first-class goal. Brilliant's current Science & Technology list leaves out chemistry and biology. The wiki archive topic list (Mechanics, Electricity and Magnetism, Chemistry, Biology, Quantitative Finance) can serve as a starting map of topic areas, but use topic names only, never the wiki's content.
- Never delete content. Version courses and archive retired ones with the learner's progress kept, avoiding Brilliant's 'Archived'/'missing course' problem (HC-33, HC-34). Allow skeleton courses with announced levels, where unwritten levels can be filled by on-demand generation (HC-30).
- Bring back a Daily Problem: one or two cross-subject problems a day with a hint-style insight and a saved archive. Since the app has a single user, replace the community explanation voting with alternative explanations from the tutor (HC-36).
- Make 'Ask the tutor' a natural-language router over the skill graph that returns a starting lesson or practice set, and extend it beyond math to every subject (HC-18). The same router can serve custom learning-path requests.
- Add a per-problem 'flag' that records the generator seed and config, so bad generated items go into a local quarantine and regression set (HC-39).
- Accessibility is undocumented at Brilliant (HC-19, HC-20). Plan for it from the start: tutor narration, screen-reader labels on interactives, keyboard alternatives to dragging, adjustable text size, dark mode, and colorblind-safe feedback beyond green alone.
- Add the fluency drills Brilliant says it lacks: timed or untimed arithmetic, long division, GCF/LCM, unit conversion, and free-response calculus technique (HC-30, HC-31).
- Notifications in a single-user app: local reminders in daily-practice and streak categories, with a user-set reminder time (Brilliant documents none). Leagues and league reminders can be dropped or replaced with competing against your own past weeks.

## Open questions

- What format and pass threshold do Level Checks use, and do they reuse Level Review items? The help center says only that they 'gate' later material.
- The free vs Premium page says Premium can 'jump directly to any lesson', but the placement guide says jumping ahead requires passing a level check. Which rule applies, and in what context?
- Brilliant uses three names: Skills Check (end of lesson), Level Review (end of level), and level check (gate). Are 'level check' and 'Level Review' the same object?
- How are spaced or interleaved review sets scheduled? The help center has no article on practice or review sets beyond 'uses what a learner has made mistakes on'.
- How big is the free Koji preview, and do lesson or level resets remove XP or streak credit? Neither is documented.
- When was Daily Problems removed, and which science courses (e.g. Chemical Reactions, other physics, chemistry and biology courses) are in the 'Archived' section? Seeing that list requires a logged-in desktop session.
- Are dark mode, localization, or screen-reader support available in the apps? None is documented, and the App Store lists English only with no declared accessibility features.
- Do the K-5 printable worksheets include answer keys and randomized items, and will Grades 2-5 use the same generator contract?
- How does Ask Koji map a free-text question to a lesson (embeddings over the skill map, or LLM classification), and does it work on mobile or outside math?

## Verifier summary

I re-fetched all 11 cited Brilliant help-center URLs; every one loaded. 6 claims are confirmed: HC-03, HC-05, HC-06, HC-08, HC-17 and HC-18. 5 are corrected and none refuted.

The corrections that matter for the rebuild:
- **HC-02:** the per-lesson and per-level counts (about 5 problems plus a 3-problem skill check, about 6 lessons per level) come only from the Solving Equations example. They are not a general rule; only the 5-10 minutes and the 10-15 problem level review are general.
- **HC-04:** the source says 'doesn't ace', not 'fails'. It does not say Skills Check retry problems are picked from the learner's own mistakes; that comes from a separate statement about the general practice system.
- **HC-10:** the cited classroom page supports only a teacher testimonial and Brilliant's 'low-pressure retry structure' wording. 'Never penalized' and 'hints always available' are overstated: Level Reviews have no hints, and Skills Check scores count wrong attempts (e.g. 4/5). Better sources for the no-docking retry model are the core-curriculum and fits-into-a-math-lesson pages.
- **HC-19:** 'de facto accessibility statement' is the researcher's inference, since brilliant.org/accessibility returns 404 and no accessibility help page turned up. The page credits the reduced reading load to the visual approach plus Koji's audio, not to the overlays.

Minor corrections:
- **HC-09:** 'tapping does nothing' overstates the source's 'You don't tap the tiles to add them.'
- **HC-13:** the page says only 'web or mobile', not native iOS/Android apps, and frames no-offline as current ('at this time').

All source tiers are correct (tier 2, official help center).
