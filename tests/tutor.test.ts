import { describe, expect, it } from "vitest";
import {
  canTutor,
  generateTutorReply,
  localTutor,
  TutorPolicyError,
  verifyTutorText,
} from "../src/domain/tutor/tutor.js";
import type { TutorRequest } from "../src/schemas/tutor.js";

const base: TutorRequest = {
  phase: "learn",
  ladderLevel: 1,
  prompt: "A 12 V source is across a 6 Ω resistor. What current flows?",
  hint: "Use I = V / R.",
  explanation: "I = 12 / 6 = 2 A.",
  solutionSteps: ["Identify V = 12 V and R = 6 Ω.", "Divide V by R."],
  conceptIds: ["circuits.ohms-law"],
};

describe("tutor policy and local ladder", () => {
  it("is available only in learning and practice", () => {
    expect(canTutor("learn")).toBe(true);
    expect(canTutor("practice")).toBe(true);
    expect(canTutor("check")).toBe(false);
    expect(canTutor("review")).toBe(false);
  });

  it("asks a pointing question, then gives the principle, then a bottom-out step", () => {
    expect(localTutor({ ...base, ladderLevel: 1 })).toContain("What is the prompt asking");
    expect(localTutor({ ...base, ladderLevel: 2 })).toContain("Principle");
    expect(localTutor({ ...base, ladderLevel: 3 })).toContain("Identify V = 12 V");
  });

  it("rejects an explicitly stated answer", () => {
    expect(verifyTutorText("The answer is 2 A.", base).ok).toBe(false);
    expect(verifyTutorText("Which quantity is fixed?", base).ok).toBe(true);
  });

  it("rejects numbers that are not present in the supplied context", () => {
    expect(verifyTutorText("Try 42 instead.", base).ok).toBe(false);
    expect(verifyTutorText("Use the 12 V source and the 6 Ω resistor.", base).ok).toBe(true);
  });

  it("refuses to generate a hint during a check", async () => {
    await expect(generateTutorReply({ ...base, phase: "check" })).rejects.toBeInstanceOf(
      TutorPolicyError,
    );
  });

  it("returns a verified local reply", async () => {
    const reply = await generateTutorReply(base);
    expect(reply.source).toBe("local");
    expect(reply.verified).toBe(true);
    expect(reply.bottomOut).toBe(false);
    expect(reply.message).not.toContain("2 A");
  });
});
