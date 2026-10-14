export interface PaperSchema {
  _id: string;
  year: number;
  subject: string;
  type: PaperType;
  description: string;
  questions: Question[];
}

export interface Question {
  question_number: number;
  question_text: string;
  subject_unit: string | null;
  options: Option[] | null;
  answer: string | null;
  question_images: string[];
  marks: number;
  difficulty: Difficulty;
}

export type Difficulty = "Easy" | "Medium" | "Hard" | "Very Hard" | null;

export interface Option {
  option_text: string;
  option_image: string;
  is_correct: boolean;
}

export type PaperType = "MCQ" | "Essay" | "Structured";
