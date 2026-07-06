/**
 * Returns a human-readable "time ago" string for a given date.
 * 
 * Converts a date string into a relative time format such as:
 * seconds (s), minutes (m), hours (h), or days (d) ago.
 * 
 * @param {string} dateString - The ISO date string or timestamp to format.
 * @returns {string} A relative time string. Examples: "5 s", "10 m", "3 h", "2 d".
 *                   Returns "" if dateString is empty, or "Just now" if the date is invalid.
 * 
 * @example
 * formatTimeAgo("2025-09-10T14:00:00Z"); // "5 h"
 * formatTimeAgo(""); // ""
 * formatTimeAgo("invalid-date"); // "Just now"
 */

export function formatTimeAgo(dateString: string): string {
  if (!dateString) return "";

  const past = new Date(dateString);
  if (isNaN(past.getTime())) return "Just now"; // Invalid date

  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - past.getTime()) / 1000));

  if (diffInSeconds < 60) {
    return `${diffInSeconds} s`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} m`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} d`;
}
