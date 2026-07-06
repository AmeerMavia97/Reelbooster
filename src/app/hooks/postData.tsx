"use client";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { normalizeMediaUrlsDeep } from "../utils/mediaUrl";

const useApiPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<unknown>(null);
  const router = useRouter();

  const postData = async (
    url: string,
    bodyData: unknown,
    contentType = "application/json"
  ) => {
    const token = Cookies.get("Reelboost_auth_token");

    try {
      setLoading(true);
      setError(null);

      const headers = {
        "Content-Type": contentType,
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const response = await axios.post(
        "https://api.yeteneksat.com/api" + url,
        bodyData,
        { headers }
      );

      console.log(response.status);
      console.log(response.headers["content-type"]);
      console.log(response.data);

      // ✅ Check for JSON response
      const contentTypeResponse = String(
        response.headers["content-type"] || ""
      );
      if (!contentTypeResponse.includes("application/json")) {
        // Redirect silently
        router.replace("/not-found");
        return;
      }

      const normalizedData = normalizeMediaUrlsDeep(response.data);

      setData(normalizedData);
      return normalizedData;
    } catch (err: any) {
      const contentTypeError = err?.response?.headers?.["content-type"] || "";
      console.log("STATUS", err?.response?.status);
      console.log("HEADERS", err?.response?.headers);
      console.log("DATA", err?.response?.data);
      // ✅ Redirect if not JSON
      if (!contentTypeError.includes("application/json")) {
        router.replace("/not-found");
        return;
      }

      // ✅ Redirect on Unauthorized (401)
      if (err?.response?.status === 401) {
        Cookies.remove("Reelboost_auth_token");
        router.replace("/");
        return;
      }

      // ✅ Other error handling
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("An unknown error occurred."));
      }

      // Re-throw if you want calling components to handle it
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, postData };
};

export default useApiPost;

