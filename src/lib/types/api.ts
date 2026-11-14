/**
 * OpenAPI 3.1.0 TypeScript definitions for OpenPapers API
 * Generated and aligned with http://localhost:8080/openapi.json
 */

export interface ErrorDetail {
  location?: string;
  message?: string;
  value?: unknown;
}

export interface ErrorModel {
  $schema?: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  type?: string;
  errors?: ErrorDetail[] | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  reputation: number;
  bio?: string;
  institution?: string;
  location?: string;
  created_at: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  reputation: number;
  bio?: string;
  institution?: string;
  location?: string;
}

export interface RegisterRequest {
  $schema?: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  $schema?: string;
  identifier: string;
  password: string;
}

export interface LoginResponse {
  $schema?: string;
  access_token: string;
  refresh_token: string;
  user: UserResponse;
}

export interface RefreshRequest {
  $schema?: string;
  refresh_token: string;
}

export interface RefreshResponse {
  $schema?: string;
  access_token: string;
  refresh_token: string;
  user: UserResponse;
}

export interface TokenClaims {
  user_id: string;
  role: string;
  token_type: string;
  expires_at: string;
  issued_at: string;
  issuer: string;
}

export interface VerifyTokenResponse {
  $schema?: string;
  valid: boolean;
  claims: TokenClaims;
  user: UserResponse;
}

export interface UserStats {
  approved_explanations: number;
  pending_explanations: number;
  total_votes_received: number;
}

export interface UserProfileResponse {
  $schema?: string;
  id: string;
  username: string;
  email: string;
  role: string;
  reputation: number;
  bio?: string;
  institution?: string;
  location?: string;
  created_at: string;
  stats: UserStats;
}

export interface PublicUserProfileResponse {
  $schema?: string;
  id: string;
  username: string;
  role: string;
  reputation: number;
  bio?: string;
  institution?: string;
  location?: string;
  created_at: string;
  stats: UserStats;
}

export interface UpdateProfileRequest {
  $schema?: string;
  username?: string;
  bio?: string;
  institution?: string;
  location?: string;
  current_password?: string;
  new_password?: string;
}

export interface AuthorSummary {
  id: string;
  username: string;
  reputation: number;
  role: string;
}

export type ExplanationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ExplanationResponse {
  $schema?: string;
  id: string;
  question_id: string;
  language_code: string;
  content_text: string;
  content_images?: unknown;
  upvotes: number;
  downvotes: number;
  is_verified: boolean;
  status: ExplanationStatus | string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  author: AuthorSummary;
}

export interface CreateExplanationRequest {
  $schema?: string;
  language_code: "en" | "si" | "ta";
  content_text: string;
  content_images?: unknown;
}

export interface GetPendingExplanationsOutputBody {
  $schema?: string;
  items: ExplanationResponse[] | null;
  total: number;
  page: number;
  limit: number;
}

export interface ReviewExplanationRequest {
  $schema?: string;
  decision: "APPROVE" | "REJECT";
  reason?: string;
}

export interface SubjectUnit {
  id: string;
  subject_id: string;
  unit_number: number;
  name_en?: string;
  name_si?: string;
  name_ta?: string;
}

export interface Subject {
  id: string;
  exam_id: string;
  name: string;
  streams: string[];
  code?: string;
  units?: SubjectUnit[] | null;
}

export interface LocalizationOption {
  key: string;
  text: string;
  image_url?: string | null;
}

export interface Localization {
  id: string;
  question_id: string;
  language_code: string;
  is_review_needed: boolean;
  prompt_text?: string;
  prompt_images?: unknown;
  options?: LocalizationOption[] | null;
}

export interface ExplanationVote {
  user_id: string;
  explanation_id: string;
  vote_type: number;
  created_at: string;
  user?: User;
}

export interface ExplanationRevision {
  id: string;
  explanation_id: string;
  author_id: string;
  content_text: string;
  status: string;
  created_at: string;
  reviewed_at?: string;
  reviewed_by_id?: string;
  reviewed_by?: User;
  author?: User;
  content_images?: unknown;
}

export interface Explanation {
  id: string;
  question_id: string;
  author_id: string;
  language_code: string;
  content_text: string;
  upvotes: number;
  downvotes: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  author?: User;
  content_images?: unknown;
  revisions?: ExplanationRevision[] | null;
  votes?: ExplanationVote[] | null;
}

export interface Question {
  id: string;
  paper_id: string;
  label: string;
  sort_order: number;
  type: string;
  created_at: string;
  difficulty?: number | null;
  marks_allocated?: number | null;
  parent_question_id?: string | null;
  correct_answer_keys?: string[] | null;
  units?: SubjectUnit[] | null;
  localizations?: Localization[] | null;
  explanations?: Explanation[] | null;
  sub_questions?: Question[] | null;
}

export interface SubmissionComment {
  id: string;
  submission_id: string;
  author_id: string;
  content: string;
  resolved: boolean;
  created_at: string;
  updated_at: string;
  highlight_text?: string;
  line_number?: number;
  resolved_at?: string;
  resolved_by_id?: string;
  author?: User;
  resolved_by?: User;
}

export interface PaperSubmission {
  id: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
  paper_edition_id?: string;
  submitter_id?: string;
  submitter?: User;
  pdf_url?: string;
  curation_markdown?: string;
  bounding_boxes?: unknown;
  images_dict?: unknown;
  raw_mineru_output?: unknown;
  metadata?: unknown;
  comments?: SubmissionComment[] | null;
}

export interface PaperEdition {
  id: string;
  paper_id: string;
  language_code: string;
  created_at: string;
  updated_at: string;
  pdf_url?: string;
  curation_markdown?: string;
  bounding_boxes?: unknown;
  images_dict?: unknown;
  submissions?: PaperSubmission[] | null;
}

export interface Paper {
  $schema?: string;
  id: string;
  subject_id: string;
  year: number;
  part: string;
  type: string;
  time_limit_minutes?: number | null;
  created_at: string;
  updated_at: string;
  subject?: Subject | null;
  editions?: PaperEdition[] | null;
  questions?: Question[] | null;
}

export interface HealthResponse {
  status: string;
  [key: string]: string;
}

export interface ExamSummary {
  id: string;
  name: string;
  country: string;
  description: string;
  paper_count: number;
  subject_count: number;
}

export interface SubjectSummary {
  id: string;
  exam_id: string;
  code?: string;
  name: string;
  streams: string[];
  paper_count: number;
}

export interface PaperEditionSummary {
  id: string;
  language_code: string;
}

export interface PaperSummary {
  id: string;
  subject_id: string;
  subject_name?: string;
  year: number;
  part: string;
  type: string;
  time_limit_minutes?: number | null;
  question_count?: number;
  created_at?: string;
  updated_at?: string;
  subject?: Subject | SubjectSummary | null;
  editions?: PaperEditionSummary[] | PaperEdition[] | null;
}

export interface StreamItem {
  name: string;
  subject_count: number;
}

export interface SubjectYearsResponse {
  subject_id?: string;
  subject_name?: string;
  years: number[];
}
