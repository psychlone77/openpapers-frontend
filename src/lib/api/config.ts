/**
 * API configuration for OpenPapers backend service.
 */
export const API_BASE_URL =
  process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
