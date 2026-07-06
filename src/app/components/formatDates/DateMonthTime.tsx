/**
 * Converts an ISO timestamp or date string into a human-readable format.
 *
 * Example output: "10 Sep, 2025 4:05 PM"
 *
 * @param {string} timestamp - The ISO timestamp or date string to format.
 * @returns {string} A formatted date and time string in the format: "DD Mon, YYYY hh:mm AM/PM".
 *
 * @example
 * const formatted = formatDateTime("2025-09-10T16:05:00Z");
 * console.log(formatted); // "10 Sep, 2025 4:05 PM"
 */

function formatDateTime(timestamp: string): string {
  const date = new Date(timestamp);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" }); // "May"
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM

  return `${day} ${month}, ${year} ${hours}:${minutes} ${ampm}`;
}
export default formatDateTime;