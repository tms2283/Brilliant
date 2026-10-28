import {
  TutorRequestSchema,
  type TutorReply,
  type TutorRequest,
} from "../../schemas/tutor.js";

export class TutorPolicyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TutorPolicyError";
  }
}

export function canTutor(phase: TutorRequest["phase"]): boolean {
  return phase === "learn" || phase === "practice";
}

function conceptLabel(conceptId: string): string {
  const tail = conceptId.split(".").at(-1) ?? conceptId;
  return tail.replaceAll("-", " ");
}

export function localTutor(request: TutorRequest): string {
  if (request.ladderLevel === 1) {
    const concept = request.conceptIds[0] ? conceptLabel(request.conceptIds[0]) : "the idea";
    return `Focus on ${concept}. What is the prompt asking you to find, and which quantities are already given?`;
  }
  if (request.ladderLevel === 2) {
    return `Principle: ${request.hint}`;
  }
  const step = request.solutionSteps[0];
  if (step) return `Bottom-out hint. Next step: ${step}`;
  if (request.explanation) return `Bottom-out hint. ${request.explanation}`;
  return `Bottom-out hint. ${request.hint}`;
}

export function verifyTutorText(text: string, request: TutorRequest): { ok: boolean; reason?: string } {
  if (/\b(answer|solution|result)\s*(is|=|:)/i.test(text)) {
    return { ok: false, reason: "The draft explicitly states an answer." };
  }

  const allowedSource = [
    request.prompt,
    request.hint,
    ...(request.ladderLevel === 3
      ? [...request.solutionSteps, request.explanation ?? ""]
      : []),
  ].join(" ");
  const allowedNumbers = new Set(allowedSource.match(/-?\d+(?:\.\d+)?/g) ?? []);
  const unknown = (text.match(/-?\d+(?:\.\d+)?/g) ?? []).filter(
    (token) => !allowedNumbers.has(token),
  );
  if (unknown.length > 0) {
    return { ok: false, reason: `Unverified number(s): ${unknown.join(", ")}` };
  }
  return { ok: true };
}

function draftPrompt(request: TutorRequest): string {
  const context = [
    `Learner phase: ${request.phase}`,
    `Hint ladder level: ${request.ladderLevel} of 3`,
    `Problem: ${request.prompt}`,
    `Authored hint: ${request.hint}`,
    request.solutionSteps.length > 0 && request.ladderLevel === 3
      ? `Verified solution steps: ${request.solutionSteps.join(" | ")}`
      : "",
    request.misconception ? `Known misconception: ${request.misconception}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `You are a concise Socratic STEM tutor. Do not state the final answer. Do not do the arithmetic for the learner. Ask one useful question and give at most one principle. Use only numbers that appear in the context. Keep it under 60 words.\n\n${context}`;
}

async function anthropicDraft(request: TutorRequest): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL;
  if (!key || !model) throw new Error("Anthropic tutor is not configured");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 220,
      temperature: 0.2,
      messages: [{ role: "user", content: draftPrompt(request) }],
    }),
  });
  if (!response.ok) throw new Error(`Anthropic returned ${response.status}`);
  const payload = (await response.json()) as {
    content?: { type: string; text?: string }[];
  };
  const text = payload.content?.find((entry) => entry.type === "text")?.text;
  if (!text) throw new Error("Anthropic returned no text");
  return text.trim();
}

async function ollamaDraft(request: TutorRequest): Promise<string> {
  const base = process.env.OLLAMA_URL ?? "http://127.0.0.1:11434";
  const model = process.env.OLLAMA_MODEL ?? "llama3.2";
  const response = await fetch(`${base}/api/generate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model,
      prompt: draftPrompt(request),
      stream: false,
      options: { temperature: 0.2 },
    }),
  });
  if (!response.ok) throw new Error(`Ollama returned ${response.status}`);
  const payload = (await response.json()) as { response?: string };
  if (!payload.response) throw new Error("Ollama returned no text");
  return payload.response.trim();
}

export async function generateTutorReply(request: TutorRequest): Promise<TutorReply> {
  const parsed = TutorRequestSchema.parse(request);
  if (!canTutor(parsed.phase)) {
    throw new TutorPolicyError("The tutor is silent during checks and reviews.");
  }

  const provider = process.env.TUTOR_PROVIDER ?? "local";
  if (provider !== "local") {
    try {
      const text =
        provider === "anthropic" ? await anthropicDraft(parsed) : await ollamaDraft(parsed);
      const verified = verifyTutorText(text, parsed);
      if (verified.ok) {
        return {
          message: text,
          ladderLevel: parsed.ladderLevel,
          source: provider === "anthropic" ? "anthropic" : "ollama",
          verified: true,
          bottomOut: parsed.ladderLevel === 3,
        };
      }
    } catch {
      // Fall through to the deterministic tutor.
    }
  }

  return {
    message: localTutor(parsed),
    ladderLevel: parsed.ladderLevel,
    source: provider === "local" ? "local" : "local-fallback",
    verified: true,
    bottomOut: parsed.ladderLevel === 3,
  };
}
