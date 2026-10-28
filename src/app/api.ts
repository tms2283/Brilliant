import type { AppState } from "../db/repo.js";
import type { AttemptEvent } from "../schemas/attempt.js";
import type { LessonDoc } from "../schemas/lesson.js";
import type { Item } from "../schemas/item.js";
import type { PathPlan } from "../schemas/path.js";
import type { TutorReply, TutorRequest } from "../schemas/tutor.js";
import type { TopicGraph, TopicProposal, TopicProposalSummary } from "../schemas/topic.js";

export type { AppState, CourseTree, LevelTree, LessonSummary, LearnerStats, ConceptSummary } from "../db/repo.js";

export interface PracticeResponse {
  generatorId: string;
  generatorVersion: string;
  items: Item[];
}

const PENDING_KEY = "noesis.pendingAttempts";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`${response.status} ${response.statusText}${detail ? `: ${detail}` : ""}`);
  }
  return (await response.json()) as T;
}

function readPending(): AttemptEvent[] {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as AttemptEvent[]) : [];
  } catch {
    return [];
  }
}

function writePending(attempts: AttemptEvent[]): void {
  try {
    if (attempts.length === 0) localStorage.removeItem(PENDING_KEY);
    else localStorage.setItem(PENDING_KEY, JSON.stringify(attempts));
  } catch {
    // Storage can be unavailable; the in-memory session still works.
  }
}

export async function flushPendingAttempts(): Promise<void> {
  const pending = readPending();
  if (pending.length === 0) return;
  const remaining: AttemptEvent[] = [];
  for (const attempt of pending) {
    try {
      await request("/api/attempts", { method: "POST", body: JSON.stringify(attempt) });
    } catch {
      remaining.push(attempt);
    }
  }
  writePending(remaining);
}

export async function postAttempt(attempt: AttemptEvent): Promise<AppState | null> {
  try {
    const result = await request<{ ok: true; state: AppState }>("/api/attempts", {
      method: "POST",
      body: JSON.stringify(attempt),
    });
    return result.state;
  } catch {
    writePending([...readPending(), attempt]);
    return null;
  }
}

export function getState(): Promise<AppState> {
  return request<AppState>("/api/state");
}

export function getLesson(id: string): Promise<LessonDoc> {
  return request<LessonDoc>(`/api/lessons/${encodeURIComponent(id)}`);
}

export function getPathPlan(courseId: string): Promise<PathPlan> {
  return request<PathPlan>(`/api/path/${encodeURIComponent(courseId)}`);
}

export function getTutorHint(hintRequest: TutorRequest): Promise<TutorReply> {
  return request<TutorReply>("/api/tutor/hint", {
    method: "POST",
    body: JSON.stringify(hintRequest),
  });
}

export function proposeTopic(topic: string): Promise<TopicProposal> {
  return request<TopicProposal>("/api/topics/propose", {
    method: "POST",
    body: JSON.stringify({ topic }),
  });
}

export function listTopics(): Promise<TopicProposalSummary[]> {
  return request<TopicProposalSummary[]>("/api/topics");
}

export function getTopicProposal(id: string): Promise<TopicProposal> {
  return request<TopicProposal>(`/api/topics/${encodeURIComponent(id)}`);
}

export function reviseTopicGraph(id: string, graph: TopicGraph): Promise<TopicProposal> {
  return request<TopicProposal>(`/api/topics/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify({ graph }),
  });
}

export function getPractice(generatorId: string, count = 12, seed?: number): Promise<PracticeResponse> {
  const params = new URLSearchParams({ count: String(count) });
  if (seed !== undefined) params.set("seed", String(seed));
  return request<PracticeResponse>(
    `/api/practice/${encodeURIComponent(generatorId)}?${params.toString()}`,
  );
}

export function completeLesson(id: string, checkResults: boolean[]): Promise<AppState> {
  return request<{ ok: true; state: AppState }>(
    `/api/lessons/${encodeURIComponent(id)}/complete`,
    { method: "POST", body: JSON.stringify({ checkResults }) },
  ).then((result) => result.state);
}

export function pendingAttemptCount(): number {
  return readPending().length;
}
