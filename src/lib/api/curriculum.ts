import { API_BASE_URL } from "./config";
import type {
  ExamSummary,
  SubjectSummary,
  PaperSummary,
  StreamItem,
  SubjectYearsResponse,
} from "../types/api";

/**
 * Helper to resolve subject identifier or name to subject UUID
 */
export function resolveSubjectId(subjectIdOrName: string, subjects?: SubjectSummary[]): string {
  if (!subjectIdOrName) return subjects?.[0]?.id || "";
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(subjectIdOrName)) {
    return subjectIdOrName;
  }
  if (subjects && subjects.length > 0) {
    const clean = subjectIdOrName.trim().toLowerCase();
    const match = subjects.find((s) => s.name.toLowerCase() === clean);
    if (match) return match.id;
  }
  return subjectIdOrName;
}

/**
 * Helper to resolve subject name from UUID or string
 */
export function resolveSubjectName(subjectIdOrName: string, subjects?: SubjectSummary[]): string {
  if (!subjectIdOrName) return subjects?.[0]?.name || "";
  if (subjects && subjects.length > 0) {
    const clean = subjectIdOrName.trim().toLowerCase();
    const match = subjects.find(
      (s) => s.id.toLowerCase() === clean || s.name.toLowerCase() === clean
    );
    if (match) return match.name;
  }
  return subjectIdOrName;
}

/**
 * Fetch all available exam boards from backend
 */
export async function fetchExams(): Promise<ExamSummary[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/exams`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as ExamSummary[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("fetchExams network error:", error);
    return [];
  }
}

/**
 * Fetch curriculum subjects, optionally filtered by stream
 */
export async function fetchSubjects(stream?: string): Promise<SubjectSummary[]> {
  try {
    const query = stream ? `?stream=${encodeURIComponent(stream)}` : "";
    const res = await fetch(`${API_BASE_URL}/api/v1/subjects${query}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as SubjectSummary[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("fetchSubjects network error:", error);
    return [];
  }
}

/**
 * Fetch available examination years for a given subject
 */
export async function fetchSubjectYears(
  subjectIdOrName: string,
  subjects?: SubjectSummary[]
): Promise<number[]> {
  const resolvedId = resolveSubjectId(subjectIdOrName, subjects);
  if (!resolvedId) return [];
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/subjects/${encodeURIComponent(resolvedId)}/years`,
      {
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as SubjectYearsResponse;
    return Array.isArray(data.years) ? data.years : [];
  } catch (error) {
    console.warn("fetchSubjectYears network error:", error);
    return [];
  }
}

/**
 * Fetch exam papers for a subject, optionally filtered by exam year
 */
export async function fetchSubjectPapers(
  subjectIdOrName: string,
  year?: number | string,
  subjects?: SubjectSummary[]
): Promise<PaperSummary[]> {
  const resolvedId = resolveSubjectId(subjectIdOrName, subjects);
  if (!resolvedId) return [];
  const query =
    year && year !== "all" && year !== "All Years" ? `?year=${encodeURIComponent(year)}` : "";
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/subjects/${encodeURIComponent(resolvedId)}/papers${query}`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return [];
    return (await res.json()) as PaperSummary[];
  } catch (error) {
    console.warn("fetchSubjectPapers network error:", error);
    return [];
  }
}

/**
 * Fetch study streams
 */
export async function fetchStreams(): Promise<StreamItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/streams`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return (await res.json()) as StreamItem[];
  } catch (error) {
    console.warn("fetchStreams network error:", error);
    return [];
  }
}

/**
 * Fetch recently published papers
 */
export async function fetchRecentPapers(): Promise<PaperSummary[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/papers/recent`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return (await res.json()) as PaperSummary[];
  } catch (error) {
    console.warn("fetchRecentPapers network error:", error);
    return [];
  }
}
