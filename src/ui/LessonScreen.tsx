import { useMachine } from "@xstate/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { completeLesson, getTutorHint, postAttempt, type AppState } from "../app/api.js";
import { currentPrimitive, playerMachine } from "../domain/player.js";
import type { LessonDoc } from "../schemas/lesson.js";
import type { PrimitiveResponse } from "../schemas/primitive.js";
import { PrimitiveView } from "../ui/primitives/PrimitiveView.js";
import { defaultResponse, formatAnswer, isAnswered } from "../ui/primitives/defaults.js";

interface Props {
  lesson: LessonDoc;
  onExit: () => void;
  onState: (state: AppState) => void;
  onPractice?: (generatorId: string, count: number) => void;
}

export function LessonScreen({ lesson, onExit, onState, onPractice }: Props) {
  const [response, setResponse] = useState<PrimitiveResponse>(() => defaultResponse(lesson.learn[0]!));
  const [hintText, setHintText] = useState<string | null>(null);
  const [hintSource, setHintSource] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const completed = useRef(false);

  const onAttempt = useMemo(
    () => (attempt: Parameters<typeof postAttempt>[0]) => {
      void postAttempt(attempt).then((state) => {
        if (state) onState(state);
      });
    },
    [onState],
  );

  const [snapshot, send] = useMachine(playerMachine, {
    input: { lesson, onAttempt },
  });

  const primitive = currentPrimitive(snapshot.context);
  const stateValue = String(snapshot.value);
  const submitted = ["learnCorrect", "learnWrong", "learnRevealed", "checkCorrect", "checkWrong"].includes(
    stateValue,
  );
  const verdict = snapshot.context.verdict;
  const revealed = snapshot.context.revealed;
  const isComplete = stateValue === "complete";
  const phase = snapshot.context.phase;

  useEffect(() => {
    if (snapshot.context.response === null) {
      setResponse(defaultResponse(primitive));
    }
  }, [snapshot.context.response, primitive]);

  useEffect(() => {
    setHintText(null);
    setHintSource(null);
    setHintLoading(false);
  }, [primitive.id]);

  useEffect(() => {
    if (!isComplete || completed.current) return;
    completed.current = true;
    void completeLesson(lesson.id, snapshot.context.checkResults).then(onState).catch(() => undefined);
  }, [isComplete, lesson.id, onState, snapshot.context.checkResults]);

  if (isComplete) {
    const correct = snapshot.context.checkResults.filter(Boolean).length;
    const total = snapshot.context.checkResults.length;
    return (
      <div className="lesson-shell">
        <div className="complete-card">
          <p className="eyebrow">Lesson complete</p>
          <h1>{lesson.takeaway.title}</h1>
          <p className="complete-body">{lesson.takeaway.body}</p>
          <div className="complete-score">
            <span className="score-number">
              {correct}/{total}
            </span>
            <span className="score-label">checks correct</span>
          </div>
          <div className="button-row">
            {lesson.practice && onPractice ? (
              <button
                type="button"
                className="button primary"
                onClick={() => onPractice(lesson.practice!.generatorId, lesson.practice!.count)}
              >
                Practice {lesson.practice.count} items
              </button>
            ) : null}
            <button type="button" className="button ghost" onClick={onExit}>
              Back to path
            </button>
            <button type="button" className="button ghost" onClick={() => send({ type: "RESTART" })}>
              Run it again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canRetry = !revealed && snapshot.context.tries < 2;
  const showAnswer = revealed || (phase === "check" && submitted && verdict?.correct === false);
  const hint = primitive.hint;
  const hintLevel = snapshot.context.hintLevel;
  const canUseTutor = phase === "learn";

  async function askForHint() {
    if (!canUseTutor || submitted || hintLoading || hintLevel >= 3) return;
    const ladderLevel = Math.min(3, hintLevel + 1);
    send({ type: "HINT" });
    setHintLoading(true);
    try {
      const reply = await getTutorHint({
        phase,
        ladderLevel,
        prompt: primitive.prompt,
        hint: primitive.hint,
        explanation: primitive.explanation,
        solutionSteps: [],
        conceptIds: primitive.conceptIds,
      });
      setHintText(reply.message);
      setHintSource(reply.source);
    } catch {
      setHintText(hint);
      setHintSource("local");
    } finally {
      setHintLoading(false);
    }
  }

  return (
    <div className="lesson-shell">
      <header className="lesson-header">
        <button type="button" className="back-button" onClick={onExit}>
          ← Path
        </button>
        <div className="lesson-title-block">
          <p className="eyebrow">{lesson.title}</p>
          <p className="lesson-step">
            {phase === "learn"
              ? `Learn ${snapshot.context.learnIndex + 1} of ${lesson.learn.length}`
              : `Check ${snapshot.context.checkIndex + 1} of ${lesson.check.length}`}
          </p>
        </div>
        <div className="progress-rail" aria-hidden="true">
          {lesson.learn.map((item, index) => (
            <span
              key={item.id}
              className={`progress-pip${phase === "check" || index < snapshot.context.learnIndex ? " is-done" : ""}${
                phase === "learn" && index === snapshot.context.learnIndex ? " is-current" : ""
              }`}
            />
          ))}
          <span className="progress-divider" />
          {lesson.check.map((item, index) => (
            <span
              key={item.id}
              className={`progress-pip check${phase === "check" && index < snapshot.context.checkIndex ? " is-done" : ""}${
                phase === "check" && index === snapshot.context.checkIndex ? " is-current" : ""
              }`}
            />
          ))}
        </div>
      </header>

      <main className="lesson-main">
        <section className="prompt-card" aria-labelledby="prompt-text">
          <p className="eyebrow">{phase === "learn" ? "Work it out" : "Check"}</p>
          <h1 id="prompt-text">{primitive.prompt}</h1>

          <PrimitiveView
            key={`${primitive.id}:${snapshot.context.tries}`}
            primitive={primitive}
            value={response}
            onChange={setResponse}
            disabled={submitted}
            showResult={submitted && (verdict !== null || revealed)}
            correct={verdict?.correct ?? false}
          />

          {hintLevel > 0 && !submitted ? (
            <div className="hint-box">
              <span className="hint-label">
                {hintLevel >= 3 ? "Bottom-out hint" : `Hint ${hintLevel}`}
                {hintSource ? ` · ${hintSource}` : ""}
              </span>
              <p>{hintLoading ? "Finding the smallest useful question…" : hintText ?? hint}</p>
              {hintLevel >= 3 ? (
                <span className="hint-caution">Using the bottom-out hint weakens this item’s mastery evidence.</span>
              ) : null}
            </div>
          ) : null}

          <div className="lesson-actions">
            {!submitted ? (
              <>
                <button
                  type="button"
                  className="button primary"
                  disabled={!isAnswered(primitive, response)}
                  onClick={() => send({ type: "SUBMIT", response })}
                >
                  {phase === "learn" ? "Check" : "Submit answer"}
                </button>
                {canUseTutor ? (
                  <button
                    type="button"
                    className="button ghost"
                    disabled={hintLoading || hintLevel >= 3}
                    onClick={() => void askForHint()}
                  >
                    {hintLoading ? "Thinking…" : hintLevel === 0 ? "Give me a hint" : hintLevel >= 3 ? "No more hints" : "Another hint"}
                  </button>
                ) : null}
              </>
            ) : null}

            {stateValue === "learnCorrect" || stateValue === "checkCorrect" ? (
              <button type="button" className="button primary" onClick={() => send({ type: "CONTINUE" })}>
                Continue
              </button>
            ) : null}

            {stateValue === "learnWrong" ? (
              <div className="button-row">
                {canRetry ? (
                  <button type="button" className="button primary" onClick={() => send({ type: "RETRY" })}>
                    Try again
                  </button>
                ) : null}
                {!revealed ? (
                  <button type="button" className="button ghost" onClick={() => send({ type: "REVEAL" })}>
                    Show me the reasoning
                  </button>
                ) : null}
                {!canRetry || revealed ? (
                  <button type="button" className="button ghost" onClick={() => send({ type: "CONTINUE" })}>
                    Continue
                  </button>
                ) : null}
              </div>
            ) : null}

            {stateValue === "learnRevealed" ? (
              <button type="button" className="button primary" onClick={() => send({ type: "CONTINUE" })}>
                Continue
              </button>
            ) : null}

            {stateValue === "checkWrong" ? (
              <button type="button" className="button primary" onClick={() => send({ type: "CONTINUE" })}>
                Continue
              </button>
            ) : null}
          </div>
        </section>

        <aside className="feedback-column" aria-live="polite">
          {submitted ? (
            <div
              className={`feedback-card ${
                verdict?.correct ? "is-correct" : revealed ? "is-revealed" : "is-wrong"
              }`}
            >
              <p className="feedback-kicker">
                {verdict?.correct ? "Correct" : revealed ? "The reasoning" : "Not quite"}
              </p>
              <p className="feedback-title">
                {verdict?.correct
                  ? "That is the consequence."
                  : revealed
                    ? "Follow the chain."
                    : "Use the mismatch as information."}
              </p>
              <p className="feedback-body">{primitive.explanation}</p>
              {!verdict?.correct && verdict?.misconception ? (
                <p className="misconception">{verdict.misconception}</p>
              ) : null}
              {showAnswer ? (
                <p className="answer-line">
                  <span>Answer</span> {formatAnswer(primitive)}
                </p>
              ) : null}
              {phase === "check" && verdict?.correct === false ? (
                <p className="feedback-note">This check is finished. The next one will use the idea again.</p>
              ) : null}
            </div>
          ) : (
            <div className="feedback-card is-idle">
              <p className="feedback-kicker">No score yet</p>
              <p className="feedback-title">Commit to an answer.</p>
              <p className="feedback-body">
                Predict first. The app will show you what the model actually does, then name the idea that
                explains it.
              </p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
