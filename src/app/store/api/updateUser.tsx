// services/userService.ts
import { UpdateUserRes } from "@/app/types/ResTypes";
import { useQuery } from "@tanstack/react-query";
import { normalizeMediaUrlsDeep } from "@/app/utils/mediaUrl";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchUserProfileDetails = async (token: string): Promise<UpdateUserRes> => {
  const res = await fetch(`${baseURL}/users/updateUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user profile details");
  }

  return normalizeMediaUrlsDeep(await res.json());
};
export const useUserProfile = (token: string) => {
  return useQuery<UpdateUserRes, Error>({
    queryKey: ["userProfile", token],
    queryFn: () => fetchUserProfileDetails(token),
    enabled: !!token, // 🔒 Only fetch if token exists
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
  });
};
