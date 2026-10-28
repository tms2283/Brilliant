import { describe, expect, it } from "vitest";
import { CONCEPTS, CONCEPT_EDGES, LESSONS } from "../src/content/index.js";
import {
  critiqueGraph,
  curatorStatus,
  isSupportedTopic,
  planTopicPath,
  proposeGraph,
  UnsupportedTopicError,
  type TopicCatalog,
} from "../src/domain/topic/graph.js";
import type { TopicGraph } from "../src/schemas/topic.js";

const catalog: TopicCatalog = {
  concepts: CONCEPTS,
  edges: CONCEPT_EDGES,
  lessons: LESSONS.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    conceptIds: lesson.conceptIds,
  })),
};

describe("topic graph", () => {
  it("proposes an acyclic circuits graph with a real lesson path", () => {
    const graph = proposeGraph("voltage, current, and resistance", catalog);
    const critique = critiqueGraph(graph);
    expect(graph.domain).toBe("circuits");
    expect(critique.passed).toBe(true);
    expect(critique.findings).toHaveLength(0);
    expect(curatorStatus(critique)).toBe("approved");
    expect(critique.order.indexOf("circuits.ohms-law")).toBeLessThan(critique.order.indexOf("circuits.power"));

    const path = planTopicPath(graph, critique, catalog);
    expect(path.nodes.map((node) => node.lessonId)).toEqual([
      "circuits-01",
      "circuits-04",
      "circuits-02",
      "circuits-03",
    ]);
    expect(path.nodes.every((node) => node.status === "available")).toBe(true);
  });

  it("maps algebra language onto the balance sequence", () => {
    const graph = proposeGraph("help me solve linear equations", catalog);
    const critique = critiqueGraph(graph);
    expect(graph.domain).toBe("balance");
    expect(critique.passed).toBe(true);
    expect(planTopicPath(graph, critique, catalog).nodes.map((node) => node.lessonId)).toEqual([
      "balance-01",
      "balance-02",
      "balance-03",
    ]);
  });

  it("maps mechanics language onto torque and mechanical advantage lessons", () => {
    const graph = proposeGraph("levers, torque, and mechanical advantage", catalog);
    const critique = critiqueGraph(graph);
    expect(graph.domain).toBe("mechanics");
    expect(critique.passed).toBe(true);
    expect(planTopicPath(graph, critique, catalog).nodes.map((node) => node.lessonId)).toEqual([
      "mechanics-01",
      "mechanics-03",
      "mechanics-02",
    ]);
  });

  it("maps optics language onto refraction and lens lessons", () => {
    const graph = proposeGraph("snell's law of refraction and thin lenses", catalog);
    const critique = critiqueGraph(graph);
    expect(graph.domain).toBe("optics");
    expect(critique.passed).toBe(true);
    expect(planTopicPath(graph, critique, catalog).nodes.map((node) => node.lessonId)).toEqual([
      "optics-01",
      "optics-03",
      "optics-02",
    ]);
  });

  it("maps kinetics language onto chemical rate laws and half-life lessons", () => {
    const graph = proposeGraph("reaction rates and chemical kinetics", catalog);
    const critique = critiqueGraph(graph);
    expect(graph.domain).toBe("chemistry");
    expect(critique.passed).toBe(true);
    expect(planTopicPath(graph, critique, catalog).nodes.map((node) => node.lessonId)).toEqual([
      "chemistry-01",
      "chemistry-03",
      "chemistry-02",
    ]);
  });

  it("maps logic language onto boolean gates and composite circuits", () => {
    const graph = proposeGraph("boolean logic and truth tables", catalog);
    const critique = critiqueGraph(graph);
    expect(graph.domain).toBe("logic");
    expect(critique.passed).toBe(true);
    expect(planTopicPath(graph, critique, catalog).nodes.map((node) => node.lessonId)).toEqual([
      "logic-01",
      "logic-02",
    ]);
  });

  it("rejects a cyclic prerequisite graph", () => {
    const graph = proposeGraph("circuits", catalog);
    const cyclic: TopicGraph = {
      ...graph,
      edges: [
        ...graph.edges,
        {
          from: "circuits.power",
          to: "circuits.ohms-law",
          type: "prerequisite",
          provenance: "generated",
          confidence: "low",
        },
      ],
    };
    const critique = critiqueGraph(cyclic);
    expect(critique.passed).toBe(false);
    expect(critique.findings.some((finding) => finding.code === "cycle")).toBe(true);
    expect(curatorStatus(critique)).toBe("rejected");
  });

  it("rejects a graph with no authored lessons", () => {
    const graph = proposeGraph("circuits", catalog);
    const empty: TopicGraph = {
      ...graph,
      nodes: graph.nodes.map((node) => ({ ...node, lessonIds: [] })),
    };
    const critique = critiqueGraph(empty);
    expect(critique.passed).toBe(false);
    expect(critique.findings.some((finding) => finding.code === "no-lessons")).toBe(true);
  });

  it("refuses topics without verified content", () => {
    expect(isSupportedTopic("organic chemistry synthesis")).toBe(false);
    expect(() => proposeGraph("organic chemistry synthesis", catalog)).toThrow(UnsupportedTopicError);
  });
});
