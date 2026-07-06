// hooks/useNotifications.ts
"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchNotifications } from "./notification";

export function useNotifications(limit: number = 10) {
  return useInfiniteQuery({
    queryKey: ["notifications", limit],
    //@ts-ignore
    queryFn: ({ pageParam = 1 }) => fetchNotifications({ page: pageParam }),
    getNextPageParam: (lastPage: { Pagination: { current_page: number; total_pages: number } }) => {
      const { current_page, total_pages } = lastPage.Pagination;
      return current_page < total_pages ? current_page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
