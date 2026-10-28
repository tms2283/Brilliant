import { useEffect, useRef, useState } from "react";
import { getPractice, getTutorHint, postAttempt, type AppState, type PracticeResponse } from "../app/api.js";
import { evaluatePrimitive, type Verdict } from "../domain/evaluate.js";
import type { Item } from "../schemas/item.js";
import type { PrimitiveResponse } from "../schemas/primitive.js";
import { PrimitiveView } from "../ui/primitives/PrimitiveView.js";
import { defaultResponse, formatAnswer, isAnswered } from "../ui/primitives/defaults.js";

interface Props {
  generatorId: string;
  count?: number;
  onExit: () => void;
  onState: (state: AppState) => void;
}

export function PracticeScreen({ generatorId, count = 12, onExit, onState }: Props) {
  const [practice, setPractice] = useState<PracticeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState<PrimitiveResponse>("");
  const [result, setResult] = useState<Verdict | null>(null);
  const [hint, setHint] = useState(0);
  const [hintText, setHintText] = useState<string | null>(null);
  const [hintSource, setHintSource] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [seed, setSeed] = useState<number | undefined>(undefined);
  const started = useRef(Date.now());

  useEffect(() => {
    let active = true;
    setPractice(null);
    setError(null);
    setIndex(0);
    setCorrect(0);
    setFinished(false);
    setResult(null);
    setHint(0);
    setHintText(null);
    setHintSource(null);
    getPractice(generatorId, count, seed)
      .then((data) => {
        if (!active) return;
        setPractice(data);
        setResponse(defaultResponse(data.items[0]!.primitive));
        started.current = Date.now();
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Could not load practice");
      });
    return () => {
      active = false;
    };
  }, [generatorId, count, seed]);

  if (error) {
    return (
      <div className="state-panel">
        <p className="eyebrow">Practice unavailable</p>
        <h1>{error}</h1>
        <button type="button" className="button primary" onClick={onExit}>
          Back to path
        </button>
      </div>
    );
  }

  if (!practice) {
    return (
      <div className="state-panel">
        <p className="eyebrow">Generating</p>
        <h1>Checking every item before it reaches you…</h1>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="lesson-shell">
        <div className="complete-card">
          <p className="eyebrow">Practice complete</p>
          <h1>{correct}/{practice.items.length} correct</h1>
          <p className="complete-body">
            Generated items are drawn from the same model as the lesson, then checked independently before
            display. Review the explanations, not just the score.
          </p>
          <div className="button-row">
            <button type="button" className="button primary" onClick={onExit}>
              Back to path
            </button>
            <button
              type="button"
              className="button ghost"
              onClick={() => {
                setSeed(Math.floor(Math.random() * 1_000_000));
              }}
            >
              New set
            </button>
          </div>
        </div>
      </div>
    );
  }

  const item: Item = practice.items[index]!;
  const primitive = item.primitive;
  const submitted = result !== null;
  const phaseLabel = `Practice ${index + 1} of ${practice.items.length}`;

  const submit = () => {
    const verdict = evaluatePrimitive(primitive, response);
    setResult(verdict);
    if (verdict.correct) setCorrect((value) => value + 1);
    void postAttempt({
      id: crypto.randomUUID(),
      itemId: item.id,
      lessonId: `practice:${generatorId}`,
      conceptIds: primitive.conceptIds,
      phase: "practice",
      response,
      correct: verdict.correct,
      firstAttempt: true,
      hintLevel: hint > 0 ? 1 : 0,
      revealed: false,
      durationMs: Math.max(0, Date.now() - started.current),
      ts: new Date().toISOString(),
    }).then((state) => {
      if (state) onState(state);
    });
  };

  const next = () => {
    if (index + 1 >= practice.items.length) {
      setFinished(true);
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setResponse(defaultResponse(practice.items[nextIndex]!.primitive));
    setResult(null);
    setHint(0);
    setHintText(null);
    setHintSource(null);
    started.current = Date.now();
  };

  async function askForHint() {
    if (submitted || hintLoading || hint >= 3) return;
    const ladderLevel = hint + 1;
    setHint(ladderLevel);
    setHintLoading(true);
    try {
      const reply = await getTutorHint({
        phase: "practice",
        ladderLevel,
        prompt: primitive.prompt,
        hint: primitive.hint,
        explanation: primitive.explanation,
        solutionSteps: item.solutionSteps,
        conceptIds: primitive.conceptIds,
      });
      setHintText(reply.message);
      setHintSource(reply.source);
    } catch {
      setHintText(primitive.hint);
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
          <p className="eyebrow">Practice</p>
          <p className="lesson-step">{phaseLabel}</p>
        </div>
        <div className="practice-meter" aria-hidden="true">
          {practice.items.map((entry, entryIndex) => (
            <span
              key={entry.id}
              className={`progress-pip${entryIndex < index ? " is-done" : ""}${
                entryIndex === index ? " is-current" : ""
              }`}
            />
          ))}
        </div>
      </header>

      <main className="lesson-main">
        <section className="prompt-card" aria-labelledby="practice-prompt">
          <p className="eyebrow">Fresh item</p>
          <h1 id="practice-prompt">{primitive.prompt}</h1>

          <PrimitiveView
            key={item.id}
            primitive={primitive}
            value={response}
            onChange={setResponse}
            disabled={submitted}
            showResult={submitted}
            correct={result?.correct ?? false}
          />

          {hint > 0 && !submitted ? (
            <div className="hint-box">
              <span className="hint-label">
                {hint >= 3 ? "Bottom-out hint" : `Hint ${hint}`}
                {hintSource ? ` · ${hintSource}` : ""}
              </span>
              <p>{hintLoading ? "Finding the smallest useful question…" : hintText ?? primitive.hint}</p>
              {hint >= 3 ? (
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
                  onClick={submit}
                >
                  Submit answer
                </button>
                <button
                  type="button"
                  className="button ghost"
                  disabled={hintLoading || hint >= 3}
                  onClick={() => void askForHint()}
                >
                  {hintLoading ? "Thinking…" : hint === 0 ? "Give me a hint" : hint >= 3 ? "No more hints" : "Another hint"}
                </button>
              </>
            ) : (
              <button type="button" className="button primary" onClick={next}>
                {index + 1 >= practice.items.length ? "See summary" : "Next item"}
              </button>
            )}
          </div>
        </section>

        <aside className="feedback-column" aria-live="polite">
          {result ? (
            <div className={`feedback-card ${result.correct ? "is-correct" : "is-wrong"}`}>
              <p className="feedback-kicker">{result.correct ? "Correct" : "Not quite"}</p>
              <p className="feedback-title">
                {result.correct ? "The model agrees." : "Compare your move with the model."}
              </p>
              <p className="feedback-body">{primitive.explanation}</p>
              {!result.correct ? (
                <p className="answer-line">
                  <span>Answer</span> {formatAnswer(primitive)}
                </p>
              ) : null}
              <p className="feedback-note">
                {primitive.conceptIds.join(" · ")} · difficulty {item.difficultyD.toFixed(2)}
              </p>
            </div>
          ) : (
            <div className="feedback-card is-idle">
              <p className="feedback-kicker">Score {correct}</p>
              <p className="feedback-title">No hints in the verdict.</p>
              <p className="feedback-body">
                Every generated item is solved independently before it is shown. If the checks fail, the item
                never reaches this screen.
              </p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
