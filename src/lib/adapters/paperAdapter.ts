import type { Paper, Question as ApiQuestion, Localization } from "../types/api";
import type { PaperSchema, Question, Option, Difficulty } from "../types/paperSchema";

function mapDifficulty(diff?: number | null): Difficulty {
  if (diff === null || diff === undefined) return null;
  if (diff <= 1) return "Easy";
  if (diff === 2) return "Medium";
  if (diff === 3) return "Hard";
  return "Very Hard";
}

function extractImages(images: unknown): string[] {
  if (!images) return [];
  if (Array.isArray(images)) {
    return images
      .map((item) => {
        if (typeof item === "string") return item;
        if (typeof item === "object" && item !== null && "url" in item) {
          return String((item as { url: unknown }).url);
        }
        return "";
      })
      .filter(Boolean);
  }
  if (typeof images === "object" && images !== null) {
    return Object.values(images)
      .filter((v): v is string => typeof v === "string")
      .filter(Boolean);
  }
  return [];
}

/**
 * Extract question content for a specific language localization
 */
export function getLocalizedQuestionContent(
  q: ApiQuestion | Question,
  languageCode: string
): {
  question_text: string;
  question_images: string[];
  options: Option[] | null;
} {
  const localizations =
    ("raw_localizations" in q ? q.raw_localizations : (q as ApiQuestion).localizations) || [];

  const loc: Localization | undefined =
    localizations.find((l) => l.language_code === languageCode) || localizations[0];

  const question_text = loc?.prompt_text || "";
  const question_images = extractImages(loc?.prompt_images);

  const correctKeys = q.correct_answer_keys || [];

  const options: Option[] | null = loc?.options
    ? loc.options.map((opt) => ({
        key: opt.key,
        option_text: opt.text,
        option_image: opt.image_url || "",
        is_correct: correctKeys.includes(opt.key),
      }))
    : null;

  return {
    question_text,
    question_images,
    options,
  };
}

/**
 * Transforms an OpenAPI Paper object from the backend into the UI PaperSchema model
 */
export function transformApiPaperToSchema(
  apiPaper: Paper,
  preferredLanguage?: string
): PaperSchema {
  // Extract all available language codes across editions and questions
  const languagesSet = new Set<string>();
  apiPaper.editions?.forEach((e) => {
    if (e.language_code) languagesSet.add(e.language_code);
  });
  apiPaper.questions?.forEach((q) => {
    q.localizations?.forEach((l) => {
      if (l.language_code) languagesSet.add(l.language_code);
    });
  });

  const available_languages = Array.from(languagesSet);
  const active_language =
    preferredLanguage && available_languages.includes(preferredLanguage)
      ? preferredLanguage
      : available_languages.includes("en")
        ? "en"
        : available_languages[0] || "en";

  const questions: Question[] = (apiPaper.questions || [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((apiQ) => {
      const localized = getLocalizedQuestionContent(apiQ, active_language);

      // Best explanation / answer
      let answer: string | null = null;
      if (apiQ.explanations && apiQ.explanations.length > 0) {
        const verified = apiQ.explanations.find((e) => e.is_verified);
        answer = (verified || apiQ.explanations[0]).content_text;
      } else if (apiQ.correct_answer_keys && apiQ.correct_answer_keys.length > 0) {
        answer = `**Correct Answer:** Option (${apiQ.correct_answer_keys.join(", ")})`;
      }

      // Unit name
      const primaryUnit = apiQ.units?.[0];
      const subject_unit = primaryUnit
        ? active_language === "si" && primaryUnit.name_si
          ? primaryUnit.name_si
          : primaryUnit.name_en || null
        : null;

      return {
        question_number: apiQ.sort_order || parseInt(apiQ.label, 10) || 1,
        question_text: localized.question_text,
        subject_unit,
        options: localized.options,
        answer,
        question_images: localized.question_images,
        marks: apiQ.marks_allocated ?? 1,
        difficulty: mapDifficulty(apiQ.difficulty),
        raw_localizations: apiQ.localizations || undefined,
        explanations: apiQ.explanations || undefined,
        correct_answer_keys: apiQ.correct_answer_keys || undefined,
      };
    });

  const subjectName = apiPaper.subject?.name || "Examination";
  const partText = apiPaper.part ? ` — ${apiPaper.part}` : "";
  const description = `${subjectName} Examination Paper ${apiPaper.year}${partText}. Includes comprehensive questions and verified marking schemes.`;

  return {
    _id: apiPaper.id,
    year: apiPaper.year,
    subject: subjectName,
    type: apiPaper.type,
    part: apiPaper.part,
    subject_code: apiPaper.subject?.code,
    time_limit_minutes: apiPaper.time_limit_minutes,
    description,
    questions,
    available_languages,
    active_language,
  };
}
