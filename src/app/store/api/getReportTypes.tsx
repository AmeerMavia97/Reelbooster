// store/api/useReportTypes.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { ReportType } from "@/app/types/ResTypes"; // The API response interface

export const useReportTypes = () => {
  return useQuery<ReportType, Error>({
    queryKey: ["report-types"],
    queryFn: async () => {
      const token = Cookies.get("Reelboost_auth_token");
      if (!token) throw new Error("Auth token not found");

      const { data } = await axios.post<ReportType>(
        `${process.env.NEXT_PUBLIC_API_URL}/report/report-types`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    },
    staleTime: Infinity, // cache forever until manually invalidated
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });
};
