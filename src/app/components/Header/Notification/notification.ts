// services/notifications.ts
import axios from "axios";
import Cookies from "js-cookie";
import { NotificationData } from "@/app/types/NotificationListRes";
import { normalizeMediaUrlsDeep } from "@/app/utils/mediaUrl";

interface FetchNotificationsParams {
  pageParam?: number;
}

export const fetchNotifications = async ({
  pageParam = 1,
}: FetchNotificationsParams): Promise<NotificationData> => {
  const token = Cookies.get("Reelboost_auth_token");

  const { data } = await axios.post<{ status: boolean; data: NotificationData }>(
    `${process.env.NEXT_PUBLIC_API_URL}/users/get-notification-list`,
    { page: pageParam }, // ✅ send page in body
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!data.status) {
    throw new Error("Failed to fetch notifications");
  }

  return normalizeMediaUrlsDeep(data.data);
};
