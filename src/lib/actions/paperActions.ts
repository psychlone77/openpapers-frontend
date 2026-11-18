import { PaperSchema } from "../types/paperSchema";
import { fetchPaperById, ApiError } from "../api/papers";
import { transformApiPaperToSchema } from "../adapters/paperAdapter";
import { fetchSubjects, fetchSubjectPapers, resolveSubjectId } from "../api/curriculum";

/**
 * Fetch exam paper by UUID identifier
 */
export async function getPaperById(id: string, lang?: string): Promise<PaperSchema | null> {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return null;
  }

  try {
    const apiPaper = await fetchPaperById(id, lang);
    return transformApiPaperToSchema(apiPaper, lang);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      console.warn(`Paper with ID "${id}" was not found on backend (404).`);
      return null;
    }
    console.error(`Error fetching paper "${id}" from backend:`, error);
    return null;
  }
}

/**
 * Fetch paper by subject, year, and type
 */
export default async function getPaper(
  subject: string,
  year: string,
  type: string,
  lang?: string
): Promise<PaperSchema | null> {
  const normSubject = subject.toLowerCase().trim();
  const normYear = year.trim();
  const normType = type.toLowerCase().trim();

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  // If subject param is directly the paper's UUID
  if (uuidRegex.test(subject)) {
    return getPaperById(subject, lang);
  }

  // Resolve subject by ID or name using live subjects from backend
  const subjects = await fetchSubjects();
  const resolvedSubjectId = resolveSubjectId(normSubject, subjects);

  if (resolvedSubjectId && uuidRegex.test(resolvedSubjectId)) {
    const papers = await fetchSubjectPapers(resolvedSubjectId, normYear, subjects);
    const matched = papers.find((p) => {
      const pType = (p.type || "").toLowerCase();
      const pPart = (p.part || "").toLowerCase();
      return (
        pType === normType ||
        pPart.includes(normType) ||
        (normType === "mcq" && pType.includes("mcq"))
      );
    });

    if (matched) {
      return getPaperById(matched.id, lang);
    }
  }

  return null;
}
