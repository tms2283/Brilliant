import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import lessonJson from "../src/content/lessons/circuits-01.json";
import { LessonScreen } from "../src/ui/LessonScreen.js";
import { validateLesson } from "../src/schemas/lesson.js";

const lesson = validateLesson(lessonJson);

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline in test")));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("lesson screen", () => {
  it("walks a toggle item through to the next item", () => {
    render(<LessonScreen lesson={lesson} onExit={() => undefined} onState={() => undefined} />);

    expect(screen.getByText(lesson.learn[0]!.prompt)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Switch 1: open/ }));
    fireEvent.click(screen.getByRole("button", { name: /Switch 2: open/ }));
    fireEvent.click(screen.getByRole("button", { name: "Check" }));

    expect(screen.getByText("Correct")).toBeInTheDocument();
    expect(screen.getByText(lesson.learn[0]!.explanation)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByText(lesson.learn[1]!.prompt)).toBeInTheDocument();
  });

  it("offers a hint and reveals reasoning after a wrong answer", async () => {
    render(<LessonScreen lesson={lesson} onExit={() => undefined} onState={() => undefined} />);

    fireEvent.click(screen.getByRole("button", { name: /Switch 1: open/ }));
    fireEvent.click(screen.getByRole("button", { name: "Give me a hint" }));
    expect(await screen.findByText(lesson.learn[0]!.hint)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Check" }));
    expect(screen.getByText("Not quite")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Show me the reasoning" }));
    expect(screen.getByText("The reasoning")).toBeInTheDocument();
    expect(screen.getByText(/Switch 1, Switch 2/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByText(lesson.learn[1]!.prompt)).toBeInTheDocument();
  });
});
