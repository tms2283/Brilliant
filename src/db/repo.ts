import type { Db } from "./index.js";
import type { AttemptEvent } from "../schemas/attempt.js";
import type { Concept, ConceptEdge } from "../schemas/concept.js";
import { ConceptStateSchema, type ConceptState, type LearnerSummary } from "../schemas/learner.js";
import type { LessonDoc } from "../schemas/lesson.js";
import type { CourseSeed } from "../content/index.js";
import { summarizeLearner, updateConceptState } from "../domain/learner/model.js";
import { planPath, type PathLesson } from "../domain/learner/path.js";
import type { PathPlan } from "../schemas/path.js";
import { TopicProposalSchema, type TopicProposal, type TopicProposalSummary } from "../schemas/topic.js";

export interface SeedBundle {
  courses: CourseSeed[];
  lessons: LessonDoc[];
  concepts: Concept[];
  edges: ConceptEdge[];
}

export interface LessonSummary {
  id: string;
  version: string;
  title: string;
  subtitle: string;
  order: number;
  attempts: number;
  completedAt: string | null;
  checkCorrect: number | null;
  checkTotal: number | null;
}

export interface LevelTree {
  id: string;
  title: string;
  ordinal: number;
  lessons: LessonSummary[];
}

export interface CourseTree {
  id: string;
  title: string;
  description: string;
  domain: string;
  status: string;
  levels: LevelTree[];
  totalLessons: number;
  completedLessons: number;
}

export interface LearnerStats {
  attempts: number;
  correct: number;
  accuracy: number;
  completedLessons: number;
  streakDays: number;
  lastAttemptAt: string | null;
}

export interface ConceptSummary {
  id: string;
  domain: string;
  title: string;
  knowledgePoints: string[];
  generatorIds: string[];
}

export interface AppState {
  courses: CourseTree[];
  stats: LearnerStats;
  recentAttempts: AttemptEvent[];
  concepts: ConceptSummary[];
  learner: LearnerSummary;
}

export function seedContent(db: Db, bundle: SeedBundle): void {
  const upsertCourse = db.prepare(
    `INSERT INTO course (id, version, title, domain, description, status)
     VALUES (@id, @version, @title, @domain, @description, @status)
     ON CONFLICT(id, version) DO UPDATE SET
       title = excluded.title,
       domain = excluded.domain,
       description = excluded.description,
       status = excluded.status`,
  );
  const upsertLevel = db.prepare(
    `INSERT INTO level (course_id, course_version, id, title, ordinal)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(course_id, course_version, id) DO UPDATE SET
       title = excluded.title,
       ordinal = excluded.ordinal`,
  );
  const upsertConcept = db.prepare(
    `INSERT INTO concept (id, domain, title, knowledge_points, generator_ids, provenance, confidence)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       domain = excluded.domain,
       title = excluded.title,
       knowledge_points = excluded.knowledge_points,
       generator_ids = excluded.generator_ids,
       provenance = excluded.provenance,
       confidence = excluded.confidence`,
  );
  const upsertEdge = db.prepare(
    `INSERT INTO concept_edge (from_id, to_id, type, weight, provenance, confidence)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(from_id, to_id, type) DO UPDATE SET
       weight = excluded.weight,
       provenance = excluded.provenance,
       confidence = excluded.confidence`,
  );
  const upsertLesson = db.prepare(
    `INSERT INTO lesson (id, version, title, doc, status)
     VALUES (?, ?, ?, ?, 'active')
     ON CONFLICT(id, version) DO UPDATE SET
       title = excluded.title,
       doc = excluded.doc`,
  );
  const clearLessonConcepts = db.prepare(
    "DELETE FROM lesson_concept WHERE lesson_id = ? AND lesson_version = ?",
  );
  const insertLessonConcept = db.prepare(
    `INSERT INTO lesson_concept (lesson_id, lesson_version, concept_id, role)
     VALUES (?, ?, ?, ?)`,
  );

  db.transaction(() => {
    for (const course of bundle.courses) {
      upsertCourse.run({
        id: course.id,
        version: course.version,
        title: course.title,
        domain: course.domain,
        description: course.description,
        status: course.status,
      });
      for (const level of course.levels) {
        upsertLevel.run(course.id, course.version, level.id, level.title, level.ordinal);
      }
    }
    for (const concept of bundle.concepts) {
      upsertConcept.run(
        concept.id,
        concept.domain,
        concept.title,
        JSON.stringify(concept.knowledgePoints),
        JSON.stringify(concept.generatorIds),
        concept.provenance,
        concept.confidence,
      );
    }
    db.prepare("DELETE FROM concept_edge").run();
    for (const edge of bundle.edges) {
      upsertEdge.run(
        edge.from,
        edge.to,
        edge.type,
        edge.weight ?? null,
        edge.provenance,
        edge.confidence,
      );
    }
    for (const lesson of bundle.lessons) {
      upsertLesson.run(lesson.id, lesson.version, lesson.title, JSON.stringify(lesson));
      clearLessonConcepts.run(lesson.id, lesson.version);
      for (const conceptId of lesson.conceptIds) {
        insertLessonConcept.run(lesson.id, lesson.version, conceptId, "teaches");
      }
    }
  })();
}

export function getLesson(db: Db, id: string): LessonDoc | null {
  const row = db
    .prepare("SELECT doc FROM lesson WHERE id = ? ORDER BY rowid DESC LIMIT 1")
    .get(id) as { doc: string } | undefined;
  if (!row) return null;
  return JSON.parse(row.doc) as LessonDoc;
}

export function getCourses(db: Db): CourseTree[] {
  const courseRows = db
    .prepare("SELECT id, version, title, domain, description, status FROM course ORDER BY title")
    .all() as {
    id: string;
    version: string;
    title: string;
    domain: string;
    description: string;
    status: string;
  }[];

  const levelRows = db
    .prepare(
      "SELECT course_id, course_version, id, title, ordinal FROM level ORDER BY ordinal",
    )
    .all() as {
    course_id: string;
    course_version: string;
    id: string;
    title: string;
    ordinal: number;
  }[];

  const lessonRows = db
    .prepare(
      `SELECT l.id, l.version, l.title, l.doc,
              (SELECT COUNT(*) FROM attempt a WHERE a.lesson_id = l.id) AS attempts,
              p.completed_at, p.check_correct, p.check_total
       FROM lesson l
       LEFT JOIN lesson_progress p ON p.lesson_id = l.id AND p.lesson_version = l.version
       ORDER BY l.rowid`,
    )
    .all() as {
    id: string;
    version: string;
    title: string;
    doc: string;
    attempts: number;
    completed_at: string | null;
    check_correct: number | null;
    check_total: number | null;
  }[];

  return courseRows.map((course) => {
    const levels: LevelTree[] = levelRows
      .filter((level) => level.course_id === course.id)
      .map((level) => {
        const lessons: LessonSummary[] = lessonRows
          .filter((lesson) => {
            const doc = JSON.parse(lesson.doc) as LessonDoc;
            return doc.metadata.courseId === course.id && doc.metadata.levelId === level.id;
          })
          .map((lesson) => {
            const doc = JSON.parse(lesson.doc) as LessonDoc;
            return {
              id: lesson.id,
              version: lesson.version,
              title: lesson.title,
              subtitle: doc.subtitle,
              order: doc.metadata.order,
              attempts: lesson.attempts,
              completedAt: lesson.completed_at,
              checkCorrect: lesson.check_correct,
              checkTotal: lesson.check_total,
            };
          })
          .sort((a, b) => a.order - b.order);
        return { id: level.id, title: level.title, ordinal: level.ordinal, lessons };
      });

    const totalLessons = levels.reduce((sum, level) => sum + level.lessons.length, 0);
    const completedLessons = levels.reduce(
      (sum, level) => sum + level.lessons.filter((lesson) => lesson.completedAt !== null).length,
      0,
    );

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      domain: course.domain,
      status: course.status,
      levels,
      totalLessons,
      completedLessons,
    };
  });
}

export function saveAttempt(db: Db, attempt: AttemptEvent): boolean {
  const result = db.prepare(
    `INSERT INTO attempt
     (id, item_id, lesson_id, concept_ids, phase, response, correct, first_attempt, hint_level, revealed, duration_ms, ts)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO NOTHING`,
  ).run(
    attempt.id,
    attempt.itemId,
    attempt.lessonId,
    JSON.stringify(attempt.conceptIds),
    attempt.phase,
    JSON.stringify(attempt.response),
    attempt.correct ? 1 : 0,
    attempt.firstAttempt ? 1 : 0,
    attempt.hintLevel,
    attempt.revealed ? 1 : 0,
    attempt.durationMs,
    attempt.ts,
  );
  return result.changes > 0;
}

export function saveLessonProgress(
  db: Db,
  lessonId: string,
  lessonVersion: string,
  checkResults: boolean[],
): void {
  db.prepare(
    `INSERT INTO lesson_progress (lesson_id, lesson_version, completed_at, check_correct, check_total)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(lesson_id, lesson_version) DO UPDATE SET
       completed_at = excluded.completed_at,
       check_correct = excluded.check_correct,
       check_total = excluded.check_total`,
  ).run(
    lessonId,
    lessonVersion,
    new Date().toISOString(),
    checkResults.filter(Boolean).length,
    checkResults.length,
  );
}

export function getStats(db: Db): LearnerStats {
  const totals = db
    .prepare(
      `SELECT COUNT(*) AS attempts,
              COALESCE(SUM(correct), 0) AS correct,
              MAX(ts) AS last_attempt_at
       FROM attempt`,
    )
    .get() as { attempts: number; correct: number; last_attempt_at: string | null };

  const completed = db
    .prepare("SELECT COUNT(*) AS count FROM lesson_progress")
    .get() as { count: number };

  const days = db
    .prepare("SELECT DISTINCT substr(ts, 1, 10) AS day FROM attempt ORDER BY day DESC")
    .all() as { day: string }[];

  return {
    attempts: totals.attempts,
    correct: totals.correct,
    accuracy: totals.attempts === 0 ? 0 : totals.correct / totals.attempts,
    completedLessons: completed.count,
    streakDays: countStreak(days.map((row) => row.day)),
    lastAttemptAt: totals.last_attempt_at,
  };
}

function countStreak(days: string[]): number {
  if (days.length === 0) return 0;
  const unique = [...new Set(days)];
  let streak = 0;
  const cursor = new Date();
  for (const day of unique) {
    const expected = cursor.toISOString().slice(0, 10);
    if (day !== expected) break;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

export function getRecentAttempts(db: Db, limit = 20): AttemptEvent[] {
  const rows = db
    .prepare(
      `SELECT id, item_id, lesson_id, concept_ids, phase, response, correct, first_attempt,
              hint_level, revealed, duration_ms, ts
       FROM attempt ORDER BY ts DESC LIMIT ?`,
    )
    .all(limit) as {
    id: string;
    item_id: string;
    lesson_id: string;
    concept_ids: string;
    phase: string;
    response: string;
    correct: number;
    first_attempt: number;
    hint_level: number;
    revealed: number;
    duration_ms: number;
    ts: string;
  }[];

  return rows.map((row) => ({
    id: row.id,
    itemId: row.item_id,
    lessonId: row.lesson_id,
    conceptIds: JSON.parse(row.concept_ids) as string[],
    phase: row.phase as AttemptEvent["phase"],
    response: JSON.parse(row.response) as AttemptEvent["response"],
    correct: row.correct === 1,
    firstAttempt: row.first_attempt === 1,
    hintLevel: row.hint_level,
    revealed: row.revealed === 1,
    durationMs: row.duration_ms,
    ts: row.ts,
  }));
}

export function getConceptStates(db: Db): ConceptState[] {
  const rows = db
    .prepare(
      `SELECT concept_id, theta, n_attempts, ema, mastery, fsrs_card, last_seen
       FROM concept_state ORDER BY concept_id`,
    )
    .all() as {
    concept_id: string;
    theta: number;
    n_attempts: number;
    ema: number;
    mastery: string;
    fsrs_card: string | null;
    last_seen: string | null;
  }[];

  return rows.map((row) =>
    ConceptStateSchema.parse({
      conceptId: row.concept_id,
      theta: row.theta,
      nAttempts: row.n_attempts,
      ema: row.ema,
      mastery: row.mastery,
      fsrsCard: row.fsrs_card ? (JSON.parse(row.fsrs_card) as Record<string, unknown>) : null,
      lastSeen: row.last_seen,
    }),
  );
}

export function applyAttemptToLearner(db: Db, attempt: AttemptEvent): void {
  const upsert = db.prepare(
    `INSERT INTO concept_state
       (concept_id, theta, n_attempts, ema, mastery, fsrs_card, last_seen)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(concept_id) DO UPDATE SET
       theta = excluded.theta,
       n_attempts = excluded.n_attempts,
       ema = excluded.ema,
       mastery = excluded.mastery,
       fsrs_card = excluded.fsrs_card,
       last_seen = excluded.last_seen`,
  );
  const states = new Map(getConceptStates(db).map((state) => [state.conceptId, state]));
  const knownConcepts = new Set(
    (db.prepare("SELECT id FROM concept").all() as { id: string }[]).map((row) => row.id),
  );

  for (const conceptId of new Set(attempt.conceptIds)) {
    if (!knownConcepts.has(conceptId)) continue;
    const next = updateConceptState(states.get(conceptId) ?? null, {
      conceptId,
      correct: attempt.correct,
      firstAttempt: attempt.firstAttempt,
      ts: attempt.ts,
    });
    upsert.run(
      next.conceptId,
      next.theta,
      next.nAttempts,
      next.ema,
      next.mastery,
      next.fsrsCard ? JSON.stringify(next.fsrsCard) : null,
      next.lastSeen,
    );
  }
}

export function getConcepts(db: Db): ConceptSummary[] {
  const rows = db
    .prepare(
      "SELECT id, domain, title, knowledge_points, generator_ids FROM concept ORDER BY title",
    )
    .all() as {
    id: string;
    domain: string;
    title: string;
    knowledge_points: string;
    generator_ids: string;
  }[];

  return rows.map((row) => ({
    id: row.id,
    domain: row.domain,
    title: row.title,
    knowledgePoints: JSON.parse(row.knowledge_points) as string[],
    generatorIds: JSON.parse(row.generator_ids) as string[],
  }));
}

export function getPathPlan(db: Db, courseId: string, now = new Date()): PathPlan | null {
  const course = getCourses(db).find((entry) => entry.id === courseId);
  if (!course) return null;

  const lessons: PathLesson[] = [];
  const completedLessonIds = new Set<string>();
  for (const level of course.levels) {
    for (const lesson of level.lessons) {
      const doc = getLesson(db, lesson.id);
      if (!doc) continue;
      lessons.push({
        id: lesson.id,
        title: lesson.title,
        levelOrdinal: level.ordinal,
        order: lesson.order,
        conceptIds: doc.conceptIds,
      });
      if (lesson.completedAt) completedLessonIds.add(lesson.id);
    }
  }

  return planPath({
    courseId,
    courseTitle: course.title,
    lessons,
    completedLessonIds,
    states: new Map(getConceptStates(db).map((state) => [state.conceptId, state])),
    now,
  });
}

export function getAppState(db: Db): AppState {
  return {
    courses: getCourses(db),
    stats: getStats(db),
    recentAttempts: getRecentAttempts(db),
    concepts: getConcepts(db),
    learner: summarizeLearner(getConceptStates(db)),
  };
}

export function saveTopicProposal(db: Db, proposal: TopicProposal): void {
  db.prepare(
    `INSERT INTO topic_proposal
       (id, topic, graph, critique, path, curator_status, revision, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    proposal.id,
    proposal.graph.topic,
    JSON.stringify(proposal.graph),
    JSON.stringify(proposal.critique),
    JSON.stringify(proposal.path),
    proposal.curatorStatus,
    proposal.revision,
    proposal.createdAt,
    proposal.updatedAt,
  );
}

export function updateTopicProposal(db: Db, proposal: TopicProposal): boolean {
  const result = db
    .prepare(
      `UPDATE topic_proposal
       SET graph = ?, critique = ?, path = ?, curator_status = ?, revision = ?, updated_at = ?
       WHERE id = ?`,
    )
    .run(
      JSON.stringify(proposal.graph),
      JSON.stringify(proposal.critique),
      JSON.stringify(proposal.path),
      proposal.curatorStatus,
      proposal.revision,
      proposal.updatedAt,
      proposal.id,
    );
  return result.changes > 0;
}

export function getTopicProposal(db: Db, id: string): TopicProposal | null {
  const row = db.prepare("SELECT * FROM topic_proposal WHERE id = ?").get(id) as
    | {
        id: string;
        graph: string;
        critique: string;
        path: string;
        curator_status: string;
        revision: number;
        created_at: string;
        updated_at: string;
      }
    | undefined;
  if (!row) return null;
  return TopicProposalSchema.parse({
    id: row.id,
    graph: JSON.parse(row.graph),
    critique: JSON.parse(row.critique),
    path: JSON.parse(row.path),
    curatorStatus: row.curator_status,
    revision: row.revision,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export function listTopicProposals(db: Db, limit = 50): TopicProposalSummary[] {
  const rows = db
    .prepare(
      `SELECT id, topic, curator_status, revision, updated_at
       FROM topic_proposal ORDER BY updated_at DESC LIMIT ?`,
    )
    .all(limit) as {
    id: string;
    topic: string;
    curator_status: TopicProposalSummary["curatorStatus"];
    revision: number;
    updated_at: string;
  }[];
  return rows.map((row) => ({
    id: row.id,
    topic: row.topic,
    curatorStatus: row.curator_status,
    revision: row.revision,
    updatedAt: row.updated_at,
  }));
}
