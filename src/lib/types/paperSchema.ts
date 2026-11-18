import type { Localization, Explanation, SubjectUnit } from "./api";

export interface PaperSchema {
  _id: string;
  year: number;
  subject: string;
  type: PaperType | string;
  description: string;
  questions: Question[];
  part?: string;
  subject_code?: string;
  time_limit_minutes?: number | null;
  available_languages?: string[];
  active_language?: string;
}

export interface Question {
  id?: string;
  question_number: number;
  question_text: string;
  subject_unit: string | null;
  options: Option[] | null;
  answer: string | null;
  question_images: string[];
  marks: number;
  difficulty: Difficulty;
  raw_localizations?: Localization[];
  raw_units?: SubjectUnit[];
  explanations?: Explanation[];
  correct_answer_keys?: string[];
}

export type Difficulty = "Easy" | "Medium" | "Hard" | "Very Hard" | null;

export interface Option {
  key?: string;
  option_text: string;
  option_image: string;
  is_correct: boolean;
}

export type PaperType = "MCQ" | "Essay" | "Structured";
