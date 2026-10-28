import type { Domain } from "../../schemas/common.js";
import type { Concept, ConceptEdge } from "../../schemas/concept.js";
import type { PathNode, PathPlan } from "../../schemas/path.js";
import type { TopicCritique, TopicGraph, TopicNode } from "../../schemas/topic.js";

export interface TopicCatalog {
  concepts: Concept[];
  edges: ConceptEdge[];
  lessons: { id: string; title: string; conceptIds: string[] }[];
}

export class UnsupportedTopicError extends Error {
  constructor(topic: string) {
    super(
      `No authored content supports “${topic}” yet. Try circuits, algebra, mechanics, torque, optics, refraction, or chemical kinetics.`,
    );
    this.name = "UnsupportedTopicError";
  }
}

const CIRCUITS_TERMS = [
  "circuit",
  "voltage",
  "current",
  "resistance",
  "resistor",
  "ohm",
  "power",
  "series",
  "parallel",
  "electrical",
  "electronics",
];
const BALANCE_TERMS = ["algebra", "equation", "balance", "linear", "variable", "solve for x"];
const MECHANICS_TERMS = [
  "mechanics",
  "torque",
  "lever",
  "pivot",
  "fulcrum",
  "mechanical advantage",
  "effort",
  "load",
  "machine",
  "statics",
];
const OPTICS_TERMS = [
  "optics",
  "light",
  "refraction",
  "reflection",
  "snell",
  "lens",
  "focal",
  "image",
  "refractive",
  "ray",
];
const CHEMISTRY_TERMS = [
  "chemical kinetics",
  "reaction rate",
  "rate law",
  "half-life",
  "concentration",
  "collision",
  "decay",
  "first-order",
  "second-order",
  "kinetics",
];
const LOGIC_TERMS = [
  "logic",
  "boolean",
  "gate",
  "truth table",
  "and gate",
  "or gate",
  "not gate",
  "xor",
  "nand",
  "nor",
  "de morgan",
  "binary logic",
  "digital circuit",
];

function score(topic: string, terms: string[]): number {
  const lower = topic.toLowerCase();
  return terms.reduce((total, term) => (lower.includes(term) ? total + 1 : total), 0);
}

function slug(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "topic"
  );
}

export function isSupportedTopic(topic: string): boolean {
  return (
    score(topic, CIRCUITS_TERMS) > 0 ||
    score(topic, BALANCE_TERMS) > 0 ||
    score(topic, MECHANICS_TERMS) > 0 ||
    score(topic, OPTICS_TERMS) > 0 ||
    score(topic, CHEMISTRY_TERMS) > 0 ||
    score(topic, LOGIC_TERMS) > 0
  );
}

export function proposeGraph(topic: string, catalog: TopicCatalog): TopicGraph {
  const scores: [Domain, number][] = [
    ["circuits", score(topic, CIRCUITS_TERMS)],
    ["balance", score(topic, BALANCE_TERMS)],
    ["mechanics", score(topic, MECHANICS_TERMS)],
    ["optics", score(topic, OPTICS_TERMS)],
    ["chemistry", score(topic, CHEMISTRY_TERMS)],
    ["logic", score(topic, LOGIC_TERMS)],
  ];

  scores.sort((a, b) => b[1] - a[1]);
  const [bestDomain, bestScore] = scores[0]!;
  const domain = bestScore > 0 ? bestDomain : "custom";
  if (domain === "custom") throw new UnsupportedTopicError(topic);

  const concepts = catalog.concepts.filter((concept) => concept.domain === domain);
  if (concepts.length === 0) throw new UnsupportedTopicError(topic);
  const conceptIds = new Set(concepts.map((concept) => concept.id));
  const nodes: TopicNode[] = concepts.map((concept) => ({
    id: concept.id,
    title: concept.title,
    knowledgePoints: concept.knowledgePoints,
    generatorIds: concept.generatorIds,
    lessonIds: catalog.lessons
      .filter((lesson) => lesson.conceptIds.includes(concept.id))
      .map((lesson) => lesson.id),
  }));

  const edges = catalog.edges.filter((edge) => conceptIds.has(edge.from) && conceptIds.has(edge.to));

  return {
    id: `topic-${slug(topic)}`,
    topic,
    domain,
    nodes,
    edges,
    provenance: "authored",
    confidence: "high",
  };
}

export function topologicalOrder(graph: TopicGraph): string[] {
  const ids = new Set(graph.nodes.map((node) => node.id));
  const incoming = new Map<string, Set<string>>(graph.nodes.map((node) => [node.id, new Set()]));
  const outgoing = new Map<string, Set<string>>(graph.nodes.map((node) => [node.id, new Set()]));
  for (const edge of graph.edges) {
    if (edge.type !== "prerequisite" || !ids.has(edge.from) || !ids.has(edge.to)) continue;
    incoming.get(edge.to)!.add(edge.from);
    outgoing.get(edge.from)!.add(edge.to);
  }

  const ready = [...ids].filter((id) => incoming.get(id)!.size === 0).sort();
  const order: string[] = [];
  while (ready.length > 0) {
    const id = ready.shift()!;
    order.push(id);
    for (const next of [...outgoing.get(id)!].sort()) {
      incoming.get(next)!.delete(id);
      if (incoming.get(next)!.size === 0) ready.push(next);
    }
    ready.sort();
  }
  return order;
}

export function critiqueGraph(graph: TopicGraph): TopicCritique {
  const findings: TopicCritique["findings"] = [];
  const ids = new Set<string>();
  for (const node of graph.nodes) {
    if (ids.has(node.id)) {
      findings.push({ code: "duplicate-node", severity: "error", message: `Duplicate node ${node.id}.` });
    }
    ids.add(node.id);
    if (node.lessonIds.length === 0) {
      findings.push({
        code: "missing-lesson",
        severity: "warning",
        message: `${node.title} has no authored lesson.`,
      });
    }
    if (node.generatorIds.length === 0) {
      findings.push({
        code: "missing-generator",
        severity: "warning",
        message: `${node.title} has no verified generator.`,
      });
    }
    if (node.knowledgePoints.length < 2) {
      findings.push({
        code: "shallow-node",
        severity: "warning",
        message: `${node.title} needs at least two knowledge points.`,
      });
    }
  }

  for (const edge of graph.edges) {
    if (!ids.has(edge.from) || !ids.has(edge.to)) {
      findings.push({
        code: "dangling-edge",
        severity: "error",
        message: `Edge ${edge.from} → ${edge.to} references a missing node.`,
      });
    }
  }

  const order = topologicalOrder(graph);
  if (order.length !== graph.nodes.length) {
    findings.push({
      code: "cycle",
      severity: "error",
      message: "The prerequisite graph contains a cycle.",
    });
  }
  const lessonIds = new Set(graph.nodes.flatMap((node) => node.lessonIds));
  if (lessonIds.size === 0) {
    findings.push({
      code: "no-lessons",
      severity: "error",
      message: "No authored lessons cover this topic.",
    });
  }

  return {
    passed: !findings.some((finding) => finding.severity === "error"),
    findings,
    order,
  };
}

export function planTopicPath(graph: TopicGraph, critique: TopicCritique, catalog: TopicCatalog): PathPlan {
  const lessonIds: string[] = [];
  for (const nodeId of critique.order) {
    const node = graph.nodes.find((entry) => entry.id === nodeId);
    for (const lessonId of node?.lessonIds ?? []) {
      if (!lessonIds.includes(lessonId)) lessonIds.push(lessonId);
    }
  }

  const nodes: PathNode[] = lessonIds.map((lessonId) => {
    const lesson = catalog.lessons.find((entry) => entry.id === lessonId);
    return {
      id: `topic-lesson-${lessonId}`,
      kind: "lesson",
      label: lesson?.title ?? lessonId,
      lessonId,
      status: "available",
      reason: "Custom topic sequence",
    };
  });

  return {
    id: `topic-path-${graph.id.replace(/^topic-/, "")}`,
    courseId: graph.id,
    goal: `Learn ${graph.topic} through ${lessonIds.length} authored ${lessonIds.length === 1 ? "lesson" : "lessons"}.`,
    nodes,
    generatedAt: new Date().toISOString(),
  };
}

export function curatorStatus(critique: TopicCritique): "approved" | "needs-review" | "rejected" {
  if (!critique.passed) return "rejected";
  return critique.findings.some((finding) => finding.severity === "warning") ? "needs-review" : "approved";
}
