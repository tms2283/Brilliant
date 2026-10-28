# Direct observation: Brilliant lesson player, practice, and progress

- **Date:** 2026-10-10
- **Account:** the user's own account, logged in by the user. Web, Free plan, 2 keys per day.
- **Evidence tier:** `observed` (Tier 4, direct walkthrough), unless a line is marked `inferred`.
- **Content policy:** Brilliant's lesson text is not reproduced here. This file records mechanics, structure,
  and data shapes only.
- **Observed:**
  - Circuits › *Current Loops* (replay of a completed lesson).
  - Thinking in Python › *Warm Up* practice set (`py-for-loop-list-set1`).
  - Home, Topics, the course page, and You (progress).
- **Not observed:**
  - Koji tutoring dialogue. I did not invoke it, to preserve the user's limited free Koji preview.
  - Level Check format.
  - Placement diagnostic.
  - Math-expression input.
  - Drag, slider, and graph primitives.

---

## A. Web architecture

| Observation | Evidence |
|---|---|
| The app shell is **Next.js + React**: `__NEXT_DATA__`, `__next`, Turbopack chunks, React fiber keys. | DOM inspection |
| Client state is an **Apollo GraphQL** cache, with `POST /graphql`. This confirms the GraphQL backend named in job posts. | `__NEXT_DATA__.props.pageProps.apolloState`, network |
| `window.Elm` is present, so **Elm-compiled interactives are embedded** in the React shell. | JS global |
| Interactives render as **SVG**: 13 `<svg>` elements on the circuit page. Small `<canvas>` elements host Rive animations. | DOM |
| Celebrations are **Rive** files: `/rive/lightning.*.riv` and `/rive/endstates.*.riv`. | Network |
| **MathLive** keypress sounds are served (`/site_media/sounds/mathlive-sounds/*.wav`), so MathLive is used for math input. | Network |
| Bootstrap scripts `color-mode-with-system-script` and `reduced-motion-script` show **dark mode and reduced motion are supported**. | DOM |
| Session flags: `enableSoundEffects`, `motionPreference`, `experiments`, `featureSwitches`. Tutor prefs: `enableSound`, `voiceName`. | GraphQL cache |
| No client-side Python runtime was detected (no pyodide, skulpt, or wasm in resource timing). *Unconfirmed*: the resource-timing buffer may have overflowed. `inferred`: code may be executed server-side or simulated. | `performance` API |

## B. Data model: GraphQL cache shape (field names only)

```text
Course { id, slug, title, description, introText, imageUrl,
         versionName, versionStateName,            # content versioning
         lessonCount, exerciseCount, percentComplete,
         premiumOnly, desktopOnly, retiringOn,     # retiringOn = course-retirement mechanism
         conceptsInclude[], prerequisites[], nextSteps[], prereqAndNextStepNotes,
         learningPathContext { learningPath, nextCourse },
         gameboardV2(includeComingSoonNodes, includeInsertions)
           { levels[], currentNodeKey, personalizedPractice } }

Level  { slug, name, displayNumber, descriptionBullet1, descriptionBullet2,
         contentAccessStatus, insertion, hideNameAndDescription, percentComplete, nodesV2[] }

GameboardLessonNode      { lessonSlug, nodeKey, title, contentUrl, hasOverviewVideo,
                           isMeterLocked, isPremiumLocked,
                           lessonNodeAction  (START | PRACTICE | …),
                           lessonNodeStatus  (COMPLETE | …),
                           lessonVersionName, nextPracticeSlug, gatingLevelCheck }
GameboardLevelReviewNode { practiceSlug, levelReviewNodeAction, levelReviewNodeStatus,
                           contentUrl (/practice/<slug>/), displayAsLesson }
PersonalizedPracticeSet  { availability (PREMIUM_REQUIRED), isCompleted, practiceSetSlug,
                           source (PERSONALIZED), chapterSlug, versionName }
ContentMetering          { quota: 2, quotaRemaining, quotaResetsAt }   # resets at local midnight
LearningPath             { slug, colorScheme { s300 } }
User.activity            { attemptsMade, tries, daysInactive, lastLoginAt, joinedAt,
                           lessonsCompleted, streak }
User flags               { gradeLevel, timezone, hasBeenOnboardedToTutor, aiFeaturesEnabled,
                           isCreator, isClassroomStudent, isClassroomTeacher }
```

URL scheme:
- Lesson: `/courses/{course}/{level}/{lesson}/#page-N`
- Practice: `/courses/{course}/{level}/practice/{practiceSlug}/`

Structural facts:
- Every lesson node carries `nextPracticeSlug`, so **each lesson has its own practice set**.
- Each level ends in a Level Review practice node.
- The course ends in a personalized practice set (Premium).
- `includeInsertions` and `Level.insertion` mean **the path can have inserted nodes**. `inferred`: personalized
  inserts such as Warm Ups.

Course size examples:
- Circuits: 7 levels, 31 lessons, 394 exercises (about 12.7 per lesson).
- Solving Equations: 13 levels, 68 lessons, 1,159 exercises (about 17 per lesson).

## C. Lesson anatomy (*Current Loops*)

```text
[title page]  illustration · title · one-line hook · Continue
── LEARN PHASE (long progress segment) ─────────────────────────────
p2  problem   one switch                          (simplest case)
p3  problem   two switches, one is a bulb-free short path
p4  concept   text + static diagram — AFTER two problems ("action first, theory later")
p5  problem   same primitive, parallel branch that shorts the bulb
p6  problem   same primitive, switch in parallel with bulb
p7  problem   same primitive, switch that shorts the battery
p8  takeaway  one-sentence principle + animated diagram
── CHECK PHASE (3 dots) ─────────────────────────────────────────────
c1–c3  one-shot problems, fresh configurations of the same primitive
── END CHAIN ────────────────────────────────────────────────────────
Lesson complete (XP) → streak → streak charge earned → league table → upsell → (Free: ad)
```

Design pattern: one manipulative per lesson, configurations escalate in difficulty, and each new configuration
targets one specific misconception (for example, "current takes the bulb-free path").

## D. Screen anatomy

- **Header:**
  - ✕ close
  - Progress bar: a learn segment plus check dots
  - In-session XP counter (sparkle)
  - Streak bolt, which lights the moment the day qualifies
- **Card:**
  - ⚑ report-a-problem flag
  - Prompt
  - Interactive canvas
  - **Start over** reset (learn phase only)
  - Primary CTA: **Check** is disabled until the state changes, then becomes **Continue**. The last item says
    **Finish**.
- **Koji avatar:** bottom-left, learn phase only, with speech bubbles for feedback.

## E. Feedback state machine

```text
LEARN PHASE
idle ──interact──▶ dirty ──Check──▶ ┬─ correct   → green border/glow · simulation plays outcome
                                    │              · Koji: "That's it!" · +15 XP · [Why?] [Continue]
                                    └─ incorrect → AMBER border/glow (never red) · simulation STILL plays
                                                   the consequence · Koji: hint specific to the wrong state
                                                   · [See answer] [Try again]
Try again → keeps the learner's configuration (edit, don't restart). A correct retry still earned the full +15.
Why? → modal "Explanation" (1–2 sentences).

CHECK PHASE (no Koji avatar, no Start over)
correct   → "🎉 Correct!" · dot turns green · +15 XP · [Why?] [Continue]
incorrect → "Incorrect"  · dot stays gray · NO retry, NO hint · [Why?] (primary) [Continue]
            simulation still plays the consequence
```

## F. Interaction primitives observed

1. **Simulated circuit with toggle components.** Switches are clicked open or closed. The simulation is
   *deferred until Check*: the bulb does not light live.
2. **Read-only syntax-highlighted code + horizontal MC tiles** ("How many times does line N run?").
3. **Code + vertical text-option MC** for bug diagnosis, with the mutated line highlighted.
4. **Structured code editor:**
   - An editable **slot** plus a **token palette** (⌫, ←, →, and context tokens). There is no free typing.
   - A collapsible **OUTPUT** console that runs the program on Check, with a **▶ execution pointer**.
5. `inferred` from network traffic: **MathLive** math-expression input elsewhere in the product.

The Warm Up's 3 items are three cognitive operations on **one program scenario**: predict, then diagnose a
mutation, then fix. This shows how a single "variation" context can generate a whole practice set.

## G. Scoring, XP, and measurement

| Fact | Status |
|---|---|
| 15 XP per correct problem in the learn phase, check phase, and practice | observed |
| Lesson: 7 correct = 105, displayed total = 125, so about **+20 completion bonus** | inferred from numbers |
| Practice 3/3 = 45, displayed total = 55 ("Perfect!"), so about **+10 bonus** | inferred from numbers |
| Replaying a completed lesson on a later day awards XP again and **costs a key** | observed |
| Profile shows a lesson score in thirds (33/66/100%), which is check-phase accuracy | observed |
| The best score is kept: the replay scored 2/3 but the lesson still shows 100% | inferred |
| "Assessment accuracy" = 83.3% = 5/6 (check 2/3 + practice 3/3), so **learn-phase attempts are excluded** | observed (arithmetic) |
| "Problems solved" today = 10 = correct items only | observed (arithmetic) |

## H. Retention and personalization

- After a lesson is completed, its node popover offers **[Practice]** (the lesson's own practice set) and
  **[Redo]**.
- **Level Review** practice set at the end of each level.
- **Personalized Practice** at the end of the course (Premium).
- **Warm Up:**
  - Home recommends a practice set from the *previous* level before the next new lesson
    (`from=lihp_recommendation`).
  - This is retrieval before new learning.
- **Skill tags per lesson** (for example, "Completing a circuit" and "Controlling bulbs with switches"):
  - The profile lists "Most recent skills" and "All skills covered" per course.
  - So a lesson-to-skill mapping exists.

## I. Motivation layer

- **Streak:**
  - Lit mid-lesson on the 3rd correct problem of the day, with a toast ("Nice work today!").
  - Week strip on Home.
  - Streak charges shown as batteries.
  - End-chain screens: "You sparked a new streak!" and "You earned a Streak Charge!"
- **League:**
  - Shown after the lesson.
  - **Top 10 promote, bottom 5 demote** (ranks 26–30). Ties share a rank.
  - The group fills over the week ("More players on their way…"), with a countdown ("1 day left").
  - Home shows the last week's outcome.
- **Celebrations:**
  - Rive animations.
  - Koji appears in end states (a flip on lesson complete, a dumbbell after practice).
  - A gold node pad links the reward to the path.
- **You page:**
  - A natural-language **weekly summary** card.
  - Activities completed.
  - Assessment accuracy with a week-over-week delta.
  - A Problems solved bar chart.
  - Ranges: All time, Week, Month, Year.
  - Per-course lesson list with scores.
  - Skills lists.
  - "Show lesson history".

## J. Home and Topics

- **Home:**
  - Streak card (week strip and charges).
  - League status card.
  - Current-course card: level, progress bar, the next 2 nodes (**Warm Up**, then the next lesson), and **Start**.
  - Course carousel.
  - **Koji ask box** ("What do you need help with?") with mic, attach, and suggestion chips.
- **Topics:**
  - Starred "Your topics" with per-course progress bars and checkmarks for complete courses.
  - Search box ("What do you want to learn?") with **Ask**.

## K. Monetization (dropped in the local rebuild)

- **2 keys per day.** Replays and Warm Ups each consume a key. The quota resets at local midnight.
- **Upsells:**
  - After a lesson: "personalized practice only on Premium".
  - An interstitial animated ad on Free.
  - An out-of-keys wall offering "Wait until tomorrow" or "Keep learning now".
