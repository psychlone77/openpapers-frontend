import { API_BASE_URL } from "./config";
import type {
  ExamSummary,
  SubjectSummary,
  PaperSummary,
  StreamItem,
  SubjectYearsResponse,
} from "../types/api";

export const FALLBACK_EXAMS: ExamSummary[] = [
  {
    id: "sl_al",
    name: "Sri Lankan GCE A/L",
    country: "LK",
    description: "Sri Lankan General Certificate of Education (Advanced Level)",
    paper_count: 70,
    subject_count: 8,
  },
];

export const FALLBACK_SUBJECTS: SubjectSummary[] = [
  {
    id: "01a13b2e-9fe2-7e6a-80f4-35e8d16d5ec2",
    exam_id: "sl_al",
    code: "01",
    name: "Physics",
    streams: ["Physical Science", "Bio Science"],
    paper_count: 11,
  },
  {
    id: "01a13b2e-9fe6-7e13-842a-989749b89d33",
    exam_id: "sl_al",
    code: "10",
    name: "Chemistry",
    streams: ["Physical Science", "Bio Science"],
    paper_count: 11,
  },
  {
    id: "01a13b2e-9fe5-72ac-b1e9-5af3cb842fda",
    exam_id: "sl_al",
    code: "09",
    name: "Biology",
    streams: ["Bio Science"],
    paper_count: 11,
  },
  {
    id: "01a13b2e-9fec-7668-816e-b453e2932cdf",
    exam_id: "sl_al",
    code: "33",
    name: "Accounting",
    streams: ["Commerce", "Arts"],
    paper_count: 10,
  },
  {
    id: "01a13b2e-9fe8-78bd-ac53-e7f0ac65c75e",
    exam_id: "sl_al",
    code: "31",
    name: "Economics",
    streams: ["Commerce", "Arts"],
    paper_count: 11,
  },
  {
    id: "01a13b2e-9fea-77ca-966a-5008840364af",
    exam_id: "sl_al",
    code: "32",
    name: "Business Studies",
    streams: ["Commerce"],
    paper_count: 5,
  },
  {
    id: "01a13b2e-9fed-7e97-b6f1-7011c46ae5c5",
    exam_id: "sl_al",
    code: "34",
    name: "Business Statistics",
    streams: ["Commerce"],
    paper_count: 10,
  },
  {
    id: "01a13b2e-9fef-75a7-9b00-d1a228559946",
    exam_id: "sl_al",
    code: "43",
    name: "History of Sri Lanka",
    streams: ["Arts"],
    paper_count: 1,
  },
];

/**
 * Helper to resolve subject identifier or name to subject UUID
 */
export function resolveSubjectId(subjectIdOrName: string): string {
  if (!subjectIdOrName) return FALLBACK_SUBJECTS[0].id;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(subjectIdOrName)) {
    return subjectIdOrName;
  }
  const clean = subjectIdOrName.trim().toLowerCase();
  const match = FALLBACK_SUBJECTS.find((s) => s.name.toLowerCase() === clean);
  return match ? match.id : FALLBACK_SUBJECTS[0].id;
}

/**
 * Helper to resolve subject name from UUID or string
 */
export function resolveSubjectName(subjectIdOrName: string): string {
  if (!subjectIdOrName) return FALLBACK_SUBJECTS[0].name;
  const match = FALLBACK_SUBJECTS.find(
    (s) =>
      s.id.toLowerCase() === subjectIdOrName.toLowerCase() ||
      s.name.toLowerCase() === subjectIdOrName.toLowerCase()
  );
  return match ? match.name : subjectIdOrName;
}

/**
 * Fetch all available exam boards from backend
 */
export async function fetchExams(): Promise<ExamSummary[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/exams`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return FALLBACK_EXAMS;
    const data = (await res.json()) as ExamSummary[];
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_EXAMS;
  } catch (error) {
    console.warn("fetchExams network error, using fallback data:", error);
    return FALLBACK_EXAMS;
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
    if (!res.ok) return FALLBACK_SUBJECTS;
    const data = (await res.json()) as SubjectSummary[];
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_SUBJECTS;
  } catch (error) {
    console.warn("fetchSubjects network error, using fallback data:", error);
    return FALLBACK_SUBJECTS;
  }
}

/**
 * Fetch available examination years for a given subject
 */
export async function fetchSubjectYears(subjectIdOrName: string): Promise<number[]> {
  const resolvedId = resolveSubjectId(subjectIdOrName);
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/subjects/${encodeURIComponent(resolvedId)}/years`,
      {
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];
    const data = (await res.json()) as SubjectYearsResponse;
    return Array.isArray(data.years) && data.years.length > 0
      ? data.years
      : [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];
  } catch (error) {
    console.warn("fetchSubjectYears network error, using fallback years:", error);
    return [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];
  }
}

/**
 * Fetch exam papers for a subject, optionally filtered by exam year
 */
export async function fetchSubjectPapers(
  subjectIdOrName: string,
  year?: number | string
): Promise<PaperSummary[]> {
  const resolvedId = resolveSubjectId(subjectIdOrName);
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
