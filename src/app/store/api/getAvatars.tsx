// api/avatar.ts
import { GetAvatars } from "@/app/types/getAvatars";
import { useQuery } from "@tanstack/react-query";
import { normalizeMediaUrlsDeep } from "@/app/utils/mediaUrl";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAvatars = async (token: string): Promise<GetAvatars> => {
  const res = await fetch(`${baseURL}/avatar/show-avatars`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch avatars");
  }

  return normalizeMediaUrlsDeep(await res.json());
};


export const useAvatars = (token: string | undefined) => {
  return useQuery<GetAvatars>({
    queryKey: ["avatars", token],
    queryFn: () => fetchAvatars(token as string),
    enabled: !!token, // only run if token is available
  });
};
