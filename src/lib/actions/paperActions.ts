import { PaperSchema } from "../types/paperSchema";
import { paper } from "../constants/testPaper";
import { bioPaper } from "../constants/testBioPaper";
import { fetchPaperById, ApiError } from "../api/papers";
import { transformApiPaperToSchema } from "../adapters/paperAdapter";

const KNOWN_BACKEND_PAPERS: Record<string, string> = {
  accounting_2015_mcq: "01a13b6d-fc07-7f07-ae85-2f3d16819425",
};

/**
 * Fetch exam paper by UUID identifier
 */
export async function getPaperById(id: string, lang?: string): Promise<PaperSchema | null> {
  // Check static mock IDs first for demo/testing
  if (id === "paper1") return paper;
  if (id === "bioPaper1") return bioPaper;

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

  // If subject is directly a UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(subject)) {
    return getPaperById(subject, lang);
  }

  // Check known mapped backend papers
  const key = `${normSubject}_${normYear}_${normType}`;
  if (KNOWN_BACKEND_PAPERS[key]) {
    const backendResult = await getPaperById(KNOWN_BACKEND_PAPERS[key], lang);
    if (backendResult) return backendResult;
  }

  // Check mock papers
  if (normSubject.includes("bio")) {
    return bioPaper;
  }

  return paper;
}
