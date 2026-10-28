import type { ConceptState } from "../../schemas/learner.js";
import type { PathNode, PathPlan } from "../../schemas/path.js";
import { isDue } from "./model.js";

export interface PathLesson {
  id: string;
  title: string;
  levelOrdinal: number;
  order: number;
  conceptIds: string[];
}

export interface PlannerInput {
  courseId: string;
  courseTitle: string;
  lessons: PathLesson[];
  completedLessonIds: Set<string>;
  states: Map<string, ConceptState>;
  now: Date;
}

export function planPath(input: PlannerInput): PathPlan {
  const lessons = [...input.lessons].sort(
    (a, b) => a.levelOrdinal - b.levelOrdinal || a.order - b.order,
  );
  const firstIncomplete = lessons.findIndex((lesson) => !input.completedLessonIds.has(lesson.id));
  const dueConcepts = [...input.states.values()].filter((state) => isDue(state, input.now));
  const nodes: PathNode[] = [];

  for (const state of dueConcepts) {
    nodes.push({
      id: `review-${state.conceptId}`,
      kind: "review",
      label: `Review ${state.conceptId.split(".").at(-1)?.replaceAll("-", " ")}`,
      conceptId: state.conceptId,
      status: "available",
      reason: "Scheduled review is due",
    });
  }

  lessons.forEach((lesson, index) => {
    const completed = input.completedLessonIds.has(lesson.id);
    const conceptStates = lesson.conceptIds
      .map((conceptId) => input.states.get(conceptId))
      .filter((state): state is ConceptState => state !== undefined);
    const mastered =
      completed &&
      conceptStates.length > 0 &&
      conceptStates.every((state) => state.mastery === "mastered");

    if (!completed && index === firstIncomplete) {
      const weak = conceptStates.find((state) => state.nAttempts >= 2 && state.ema < 0.45);
      if (weak) {
        nodes.push({
          id: `remediation-${weak.conceptId}`,
          kind: "remediation",
          label: `Rebuild ${weak.conceptId.split(".").at(-1)?.replaceAll("-", " ")}`,
          conceptId: weak.conceptId,
          status: "available",
          reason: "Recent accuracy on this idea is low",
        });
      }
    }

    nodes.push({
      id: `lesson-${lesson.id}`,
      kind: "lesson",
      label: lesson.title,
      lessonId: lesson.id,
      status: mastered ? "mastered" : completed ? "completed" : index <= firstIncomplete ? "available" : "locked",
      reason: completed
        ? mastered
          ? "Concepts mastered"
          : "Lesson completed"
        : index === firstIncomplete
          ? "Next in sequence"
          : undefined,
    });

    if (completed) {
      nodes.push({
        id: `practice-${lesson.id}`,
        kind: "practice",
        label: `Practice ${lesson.title.toLowerCase()}`,
        lessonId: lesson.id,
        conceptId: lesson.conceptIds[0],
        status: mastered ? "mastered" : "available",
        reason: mastered ? "Retention practice" : "Strengthen this lesson",
      });
    }
  });

  const pending = lessons.filter((lesson) => !input.completedLessonIds.has(lesson.id)).length;
  const goal =
    pending === 0
      ? `Maintain ${input.courseTitle} mastery`
      : `Complete ${pending} remaining ${input.courseTitle.toLowerCase()} ${pending === 1 ? "lesson" : "lessons"}`;

  return {
    id: `path-${input.courseId}-${input.now.toISOString().slice(0, 10)}`,
    courseId: input.courseId,
    goal,
    nodes,
    generatedAt: input.now.toISOString(),
  };
}
