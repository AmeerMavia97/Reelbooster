/**
 * Groups an array of notifications by date into categories: Today, Yesterday, and Other dates.
 *
 * - "Today": notifications created on the current day.
 * - "Yesterday": notifications created on the previous day.
 * - "Other": notifications created before yesterday, grouped by formatted date string ("dd MMMM, yyyy").
 *
 * @param {(NotificationRecord & { created_at: string })[]} notifications - Array of notifications to group. 
 *        Each notification must have a `created_at` string (ISO date).
 *
 * @returns {{
 *   Today: (NotificationRecord & { created_at: string })[],
 *   Yesterday: (NotificationRecord & { created_at: string })[],
 *   Other: Record<string, (NotificationRecord & { created_at: string })[]>
 * }} An object with grouped notifications by date.
 *
 * @example
 * const grouped = groupNotificationByDate([
 *   { id: 1, message: "New comment", created_at: "2025-09-10T10:00:00Z" },
 *   { id: 2, message: "New like", created_at: "2025-09-09T12:00:00Z" },
 *   { id: 3, message: "Friend request", created_at: "2025-08-30T09:00:00Z" },
 * ]);
 * */


import { format, isToday, isYesterday, parseISO } from "date-fns";
import { Record as NotificationRecord } from "@/app/types/NotificationListRes";

export function groupNotificationByDate(notifications: (NotificationRecord & { created_at: string })[]) {
  const grouped: {
    Today: typeof notifications;
    Yesterday: typeof notifications;
    Other: Record<string, typeof notifications>;
  } = { Today: [], Yesterday: [], Other: {} };

  notifications.forEach((notification) => {
    const date = parseISO(notification.created_at);

    if (isToday(date)) {
      grouped.Today.push(notification);
    } else if (isYesterday(date)) {
      grouped.Yesterday.push(notification);
    } else {
      const formattedDate = format(date, "dd MMMM, yyyy");
      if (!grouped.Other[formattedDate]) grouped.Other[formattedDate] = [];
      grouped.Other[formattedDate].push(notification);
    }
  });

  return grouped;
}
