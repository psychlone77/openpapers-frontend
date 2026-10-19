import { API_BASE_URL } from "../api/config";

/**
 * Resolves an image source URL.
 * Routes `/images/...` or relative image paths to the backend (http://localhost:8080).
 */
export function resolveImageSrc(src?: string | null): string {
  if (!src) return "";

  // If already absolute URL or data URI
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }

  // If path starts with /images or images/
  if (src.startsWith("/images/")) {
    return `${API_BASE_URL}${src}`;
  }
  if (src.startsWith("images/")) {
    return `${API_BASE_URL}/${src}`;
  }

  // If path starts with leading slash (e.g. /images)
  if (src.startsWith("/")) {
    return `${API_BASE_URL}${src}`;
  }

  // Fallback for base64 strings
  return `data:image/jpeg;base64,${src}`;
}
