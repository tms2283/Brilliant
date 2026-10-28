import { Hono } from "hono";
import type { Db } from "../db/index.js";
import {
  applyAttemptToLearner,
  getAppState,
  getLesson,
  getPathPlan,
  getTopicProposal,
  listTopicProposals,
  saveAttempt,
  saveLessonProgress,
  saveTopicProposal,
  updateTopicProposal,
} from "../db/repo.js";
import { AttemptEventSchema } from "../schemas/attempt.js";
import { ReviseTopicRequestSchema, TopicRequestSchema } from "../schemas/topic.js";
import { TutorRequestSchema } from "../schemas/tutor.js";
import { generatePractice, getGenerator, listGenerators } from "../domain/content/registry.js";
import { generateTutorReply, TutorPolicyError } from "../domain/tutor/tutor.js";
import {
  critiqueGraph,
  curatorStatus,
  planTopicPath,
  proposeGraph,
  UnsupportedTopicError,
} from "../domain/topic/graph.js";
import { CONCEPTS, CONCEPT_EDGES, LESSONS } from "../content/index.js";

const TOPIC_CATALOG = {
  concepts: CONCEPTS,
  edges: CONCEPT_EDGES,
  lessons: LESSONS.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    conceptIds: lesson.conceptIds,
  })),
};

export function createApp(db: Db): Hono {
  const app = new Hono();

  app.get("/api/health", (c) => c.json({ ok: true, name: "noesis" }));

  app.get("/api/state", (c) => c.json(getAppState(db)));

  app.get("/api/lessons/:id", (c) => {
    const lesson = getLesson(db, c.req.param("id"));
    if (!lesson) return c.json({ error: "Lesson not found" }, 404);
    return c.json(lesson);
  });

  app.get("/api/path/:courseId", (c) => {
    const plan = getPathPlan(db, c.req.param("courseId"));
    if (!plan) return c.json({ error: "Course not found" }, 404);
    return c.json(plan);
  });

  app.post("/api/topics/propose", async (c) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const parsed = TopicRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Invalid topic request", issues: parsed.error.issues }, 400);
    }
    try {
      const graph = proposeGraph(parsed.data.topic, TOPIC_CATALOG);
      const critique = critiqueGraph(graph);
      if (!critique.passed) {
        return c.json({ error: "Topic graph rejected", critique }, 422);
      }
      const now = new Date().toISOString();
      const proposal = {
        id: `proposal-${crypto.randomUUID()}`,
        graph,
        critique,
        path: planTopicPath(graph, critique, TOPIC_CATALOG),
        curatorStatus: curatorStatus(critique),
        revision: 1,
        createdAt: now,
        updatedAt: now,
      };
      saveTopicProposal(db, proposal);
      return c.json(proposal, 201);
    } catch (error) {
      if (error instanceof UnsupportedTopicError) {
        return c.json({ error: error.message }, 422);
      }
      throw error;
    }
  });

  app.get("/api/topics", (c) => c.json(listTopicProposals(db)));

  app.get("/api/topics/:id", (c) => {
    const proposal = getTopicProposal(db, c.req.param("id"));
    if (!proposal) return c.json({ error: "Proposal not found" }, 404);
    return c.json(proposal);
  });

  app.put("/api/topics/:id", async (c) => {
    const existing = getTopicProposal(db, c.req.param("id"));
    if (!existing) return c.json({ error: "Proposal not found" }, 404);

    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const parsed = ReviseTopicRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Invalid topic graph", issues: parsed.error.issues }, 400);
    }

    const critique = critiqueGraph(parsed.data.graph);
    const updated = {
      ...existing,
      graph: parsed.data.graph,
      critique,
      path: critique.passed
        ? planTopicPath(parsed.data.graph, critique, TOPIC_CATALOG)
        : {
            id: `topic-path-${parsed.data.graph.id.replace(/^topic-/, "")}`,
            courseId: parsed.data.graph.id,
            goal: "Blocked by topic critics. Fix the graph before starting.",
            nodes: [],
            generatedAt: new Date().toISOString(),
          },
      curatorStatus: curatorStatus(critique),
      revision: existing.revision + 1,
      updatedAt: new Date().toISOString(),
    };
    updateTopicProposal(db, updated);
    return c.json(updated);
  });

  app.get("/api/generators", (c) =>
    c.json(
      listGenerators().map((generator) => ({
        id: generator.id,
        version: generator.version,
        domain: generator.domain,
      })),
    ),
  );

  app.get("/api/practice/:generatorId", (c) => {
    const generatorId = c.req.param("generatorId");
    if (!getGenerator(generatorId)) return c.json({ error: "Generator not found" }, 404);

    const count = Number(c.req.query("count") ?? 12);
    const seed = Number(c.req.query("seed") ?? Math.floor(Date.now() / 1000) % 1_000_000);
    try {
      return c.json(generatePractice(generatorId, count, seed));
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Generation failed" }, 400);
    }
  });

  app.post("/api/tutor/hint", async (c) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const parsed = TutorRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Invalid tutor request", issues: parsed.error.issues }, 400);
    }
    try {
      return c.json(await generateTutorReply(parsed.data));
    } catch (error) {
      if (error instanceof TutorPolicyError) return c.json({ error: error.message }, 403);
      throw error;
    }
  });

  app.post("/api/attempts", async (c) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const parsed = AttemptEventSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Invalid attempt", issues: parsed.error.issues }, 400);
    }
    if (saveAttempt(db, parsed.data)) applyAttemptToLearner(db, parsed.data);
    return c.json({ ok: true, state: getAppState(db) }, 201);
  });

  app.post("/api/lessons/:id/complete", async (c) => {
    const lesson = getLesson(db, c.req.param("id"));
    if (!lesson) return c.json({ error: "Lesson not found" }, 404);

    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const checkResults = (body as { checkResults?: unknown })?.checkResults;
    if (!Array.isArray(checkResults) || !checkResults.every((value) => typeof value === "boolean")) {
      return c.json({ error: "checkResults must be an array of booleans" }, 400);
    }
    saveLessonProgress(db, lesson.id, lesson.version, checkResults);
    return c.json({ ok: true, state: getAppState(db) });
  });

  app.notFound((c) => c.json({ error: "Not found" }, 404));
  app.onError((error, c) => {
    console.error(error);
    return c.json({ error: "Internal error" }, 500);
  });

  return app;
}
