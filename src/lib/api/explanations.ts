import {
  fetchQuestionExplanationsServerAction,
  submitQuestionExplanationServerAction,
  fetchPendingExplanationsServerAction,
  reviewExplanationServerAction,
} from "../actions/userActions";
import type {
  ExplanationResponse,
  CreateExplanationRequest,
  GetPendingExplanationsOutputBody,
  ReviewExplanationRequest,
} from "../types/api";

/**
 * Publicly lists APPROVED explanations ordered by net votes descending;
 * if the author is logged in (Bearer token provided), their PENDING submission is pinned at the top.
 * GET /api/v1/questions/{id}/explanations
 */
export async function fetchQuestionExplanations(
  questionId: string,
  accessToken?: string | null
): Promise<ExplanationResponse[]> {
  return await fetchQuestionExplanationsServerAction(questionId, accessToken);
}

/**
 * Submits a community explanation into the moderation queue with PENDING status.
 * POST /api/v1/questions/{id}/explanations
 */
export async function submitQuestionExplanation(
  questionId: string,
  payload: CreateExplanationRequest,
  accessToken: string
): Promise<ExplanationResponse> {
  return await submitQuestionExplanationServerAction(questionId, payload, accessToken);
}

/**
 * Moderator and Admin review queue for pending explanations.
 * GET /api/v1/admin/explanations/pending
 */
export async function fetchPendingExplanations(
  accessToken: string,
  page = 1,
  limit = 20
): Promise<GetPendingExplanationsOutputBody> {
  return await fetchPendingExplanationsServerAction(accessToken, page, limit);
}

/**
 * Decision endpoint for ADMIN and MODERATOR to approve or reject explanations;
 * automatically awards reputation points to the author upon approval.
 * POST /api/v1/admin/explanations/{id}/review
 */
export async function reviewExplanation(
  explanationId: string,
  payload: ReviewExplanationRequest,
  accessToken: string
): Promise<ExplanationResponse> {
  return await reviewExplanationServerAction(explanationId, payload, accessToken);
}
