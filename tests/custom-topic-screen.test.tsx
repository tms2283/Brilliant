import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONCEPTS, CONCEPT_EDGES, LESSONS } from "../src/content/index.js";
import {
  critiqueGraph,
  curatorStatus,
  planTopicPath,
  proposeGraph,
  type TopicCatalog,
} from "../src/domain/topic/graph.js";
import { CustomTopicScreen } from "../src/ui/CustomTopicScreen.js";
import { proposeTopic, reviseTopicGraph } from "../src/app/api.js";

vi.mock("../src/app/api.js", () => ({
  proposeTopic: vi.fn(),
  reviseTopicGraph: vi.fn(),
  getTopicProposal: vi.fn(),
}));

const catalog: TopicCatalog = {
  concepts: CONCEPTS,
  edges: CONCEPT_EDGES,
  lessons: LESSONS.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    conceptIds: lesson.conceptIds,
  })),
};

describe("custom topic screen", () => {
  beforeEach(() => {
    const graph = proposeGraph("series and parallel circuits", catalog);
    const critique = critiqueGraph(graph);
    vi.mocked(proposeTopic).mockResolvedValue({
      id: "proposal-test",
      graph,
      critique,
      path: planTopicPath(graph, critique, catalog),
      curatorStatus: curatorStatus(critique),
      revision: 1,
      createdAt: "2026-10-20T00:00:00.000Z",
      updatedAt: "2026-10-20T00:00:00.000Z",
    });
    window.location.hash = "";
  });

  afterEach(() => {
    vi.clearAllMocks();
    window.location.hash = "";
  });

  it("proposes an authored path and starts the first lesson", async () => {
    render(<CustomTopicScreen onExit={() => undefined} />);

    fireEvent.click(screen.getByRole("button", { name: "Series and parallel circuits" }));

    expect(await screen.findByText("series and parallel circuits", { selector: "h2" })).toBeInTheDocument();
    expect(screen.getByText("Start first lesson")).toBeInTheDocument();
    expect(screen.getByText("Series and parallel circuits", { selector: "strong" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Start first lesson" }));
    expect(window.location.hash).toBe("#/lesson/circuits-01");
  });

  it("removes a concept and saves a critic-checked revision", async () => {
    const graph = proposeGraph("series and parallel circuits", catalog);
    const trimmed = {
      ...graph,
      nodes: graph.nodes.filter((node) => node.id !== "circuits.power"),
      edges: graph.edges.filter((edge) => edge.from !== "circuits.power" && edge.to !== "circuits.power"),
    };
    const critique = critiqueGraph(trimmed);
    vi.mocked(reviseTopicGraph).mockResolvedValue({
      id: "proposal-test",
      graph: trimmed,
      critique,
      path: planTopicPath(trimmed, critique, catalog),
      curatorStatus: curatorStatus(critique),
      revision: 2,
      createdAt: "2026-10-20T00:00:00.000Z",
      updatedAt: "2026-10-20T00:00:00.000Z",
    });

    render(<CustomTopicScreen onExit={() => undefined} />);
    fireEvent.click(screen.getByRole("button", { name: "Series and parallel circuits" }));
    fireEvent.click(await screen.findByRole("button", { name: "Remove Electrical power" }));

    expect(screen.getByText(/unsaved edits/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Save revision" }));

    expect(await screen.findByText("revision 2", { exact: false })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Remove Electrical power" })).not.toBeInTheDocument();
    expect(vi.mocked(reviseTopicGraph)).toHaveBeenCalledOnce();
  });
});
