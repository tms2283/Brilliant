import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { closeDatabase, openDatabase, type Db } from "../src/db/index.js";
import { seedContent } from "../src/db/repo.js";
import { CONCEPTS, CONCEPT_EDGES, COURSES, LESSONS } from "../src/content/index.js";
import { createApp } from "../src/server/app.js";

let db: Db;
let app: ReturnType<typeof createApp>;

beforeEach(() => {
  db = openDatabase(":memory:");
  seedContent(db, { courses: COURSES, lessons: LESSONS, concepts: CONCEPTS, edges: CONCEPT_EDGES });
  app = createApp(db);
});

afterEach(() => closeDatabase(db));

function attemptBody(overrides: Record<string, unknown> = {}) {
  return {
    id: crypto.randomUUID(),
    itemId: "c1-toggle",
    lessonId: "circuits-01",
    conceptIds: ["circuits.series"],
    phase: "learn",
    response: ["s1", "s2"],
    correct: true,
    firstAttempt: true,
    hintLevel: 0,
    revealed: false,
    durationMs: 1200,
    ts: new Date().toISOString(),
    ...overrides,
  };
}

describe("local API", () => {
  it("serves seeded courses and lessons", async () => {
    const stateResponse = await app.request("/api/state");
    expect(stateResponse.status).toBe(200);
    const state = (await stateResponse.json()) as {
      courses: { id: string; totalLessons: number; levels: { lessons: unknown[] }[] }[];
    };
    const circuits = state.courses.find((course) => course.id === "circuits");
    expect(circuits?.totalLessons).toBe(4);
    expect(circuits?.levels[0]?.lessons).toHaveLength(3);
    expect(circuits?.levels[1]?.lessons).toHaveLength(1);

    const lessonResponse = await app.request("/api/lessons/circuits-01");
    expect(lessonResponse.status).toBe(200);
    const lesson = (await lessonResponse.json()) as { id: string; check: unknown[] };
    expect(lesson.id).toBe("circuits-01");
    expect(lesson.check.length).toBeGreaterThan(0);
  });

  it("rejects malformed attempts", async () => {
    const response = await app.request("/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "x" }),
    });
    expect(response.status).toBe(400);
  });

  it("stores an attempt once even when replayed", async () => {
    const body = attemptBody();
    const first = await app.request("/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    expect(first.status).toBe(201);

    const replay = await app.request("/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    expect(replay.status).toBe(201);

    const state = (await (await app.request("/api/state")).json()) as {
      stats: { attempts: number };
      learner: { concepts: { conceptId: string; nAttempts: number }[] };
    };
    expect(state.stats.attempts).toBe(1);
    expect(state.learner.concepts.find((concept) => concept.conceptId === "circuits.series")?.nAttempts).toBe(1);
  });

  it("serves a course path that unlocks the next lesson after completion", async () => {
    const first = (await (await app.request("/api/path/circuits")).json()) as {
      goal: string;
      nodes: { kind: string; lessonId?: string; status: string }[];
    };
    expect(first.goal).toContain("remaining");
    expect(first.nodes.find((node) => node.lessonId === "circuits-01")?.status).toBe("available");
    expect(first.nodes.find((node) => node.lessonId === "circuits-02")?.status).toBe("locked");

    await app.request("/api/lessons/circuits-01/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkResults: [true, true] }),
    });
    const next = (await (await app.request("/api/path/circuits")).json()) as {
      nodes: { kind: string; lessonId?: string; status: string }[];
    };
    expect(next.nodes.find((node) => node.lessonId === "circuits-01")?.status).toBe("completed");
    expect(next.nodes.find((node) => node.lessonId === "circuits-02")?.status).toBe("available");
    expect(next.nodes.some((node) => node.kind === "practice" && node.lessonId === "circuits-01")).toBe(true);
  });

  it("records lesson completion", async () => {
    const response = await app.request("/api/lessons/circuits-01/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkResults: [true, false] }),
    });
    expect(response.status).toBe(200);
    const state = (await response.json()) as {
      state: { courses: { id: string; completedLessons: number }[] };
    };
    expect(state.state.courses.find((course) => course.id === "circuits")?.completedLessons).toBe(1);
  });

  it("proposes a custom topic path from authored content", async () => {
    const response = await app.request("/api/topics/propose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: "series and parallel circuits" }),
    });
    expect(response.status).toBe(201);
    const proposal = (await response.json()) as {
      id: string;
      graph: {
        id: string;
        topic: string;
        domain: string;
        nodes: { id: string; title: string; knowledgePoints: string[]; generatorIds: string[]; lessonIds: string[] }[];
        edges: { from: string; to: string; type: string; provenance: string; confidence: string }[];
        provenance: string;
        confidence: string;
      };
      critique: { passed: boolean };
      curatorStatus: string;
      path: { nodes: { lessonId?: string }[] };
      revision: number;
    };
    expect(proposal.critique.passed).toBe(true);
    expect(proposal.curatorStatus).toBe("approved");
    expect(proposal.path.nodes.map((node) => node.lessonId)).toEqual([
      "circuits-01",
      "circuits-04",
      "circuits-02",
      "circuits-03",
    ]);

    const queue = (await (await app.request("/api/topics")).json()) as { id: string; topic: string }[];
    expect(queue.some((item) => item.id === proposal.id && item.topic === proposal.graph.topic)).toBe(true);

    const cyclic = {
      ...proposal.graph,
      edges: [
        ...proposal.graph.edges,
        {
          from: "circuits.power",
          to: "circuits.ohms-law",
          type: "prerequisite",
          provenance: "user",
          confidence: "low",
        },
      ],
    };
    const revise = await app.request(`/api/topics/${proposal.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ graph: cyclic }),
    });
    expect(revise.status).toBe(200);
    const revised = (await revise.json()) as {
      curatorStatus: string;
      revision: number;
      path: { nodes: unknown[] };
    };
    expect(revised.curatorStatus).toBe("rejected");
    expect(revised.revision).toBe(2);
    expect(revised.path.nodes).toHaveLength(0);

    const stored = (await (await app.request(`/api/topics/${proposal.id}`)).json()) as {
      curatorStatus: string;
      revision: number;
    };
    expect(stored.curatorStatus).toBe("rejected");
    expect(stored.revision).toBe(2);

    const unsupported = await app.request("/api/topics/propose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: "organic chemistry synthesis" }),
    });
    expect(unsupported.status).toBe(422);
  });

  it("serves a checked practice set", async () => {    const response = await app.request("/api/practice/balance.linear-two-step?count=12&seed=5");
    expect(response.status).toBe(200);
    const payload = (await response.json()) as {
      items: { evalReport: { passed: boolean }; status: string }[];
    };
    expect(payload.items).toHaveLength(12);
    expect(payload.items.every((item) => item.evalReport.passed && item.status === "accepted")).toBe(true);
  });

  it("rejects unknown generators and invalid counts", async () => {
    expect((await app.request("/api/practice/nope")).status).toBe(404);
    expect((await app.request("/api/practice/circuits.series-parallel?count=0")).status).toBe(400);
  });

  it("serves a verified hint in learning and blocks it in checks", async () => {
    const body = {
      phase: "learn",
      ladderLevel: 1,
      prompt: "A 12 V source is across a 6 ohm resistor. What current flows?",
      hint: "Use I = V / R.",
      solutionSteps: ["Identify V and R."],
      conceptIds: ["circuits.ohms-law"],
    };
    const learn = await app.request("/api/tutor/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    expect(learn.status).toBe(200);
    const reply = (await learn.json()) as { verified: boolean; message: string };
    expect(reply.verified).toBe(true);
    expect(reply.message.length).toBeGreaterThan(0);

    const check = await app.request("/api/tutor/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, phase: "check" }),
    });
    expect(check.status).toBe(403);
  });
});
