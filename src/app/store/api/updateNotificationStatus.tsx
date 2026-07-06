// services/notificationService.ts
import axios from "axios";
import Cookies from "js-cookie";

export async function updateNotificationStatus(
  notification_ids: number[],
  view_status: string
) {
  const token = Cookies.get("Reelboost_auth_token");

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/update-notification-list`,
      {
        notification_ids: notification_ids, // all IDs in one param
        view_status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    // console.error("Error updating notification status:", err);
    throw err;
  }
}
