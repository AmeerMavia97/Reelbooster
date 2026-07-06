import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import useApiPost from '@/app/hooks/postData';

interface User {
  user_id: number;
  user_name: string;
  full_name: string;
  profile_pic: string;
  is_follow: boolean;
}

interface SearchResult {
  users: User[];
  totalPages: number;
}

export const useUserSearch = () => {
  const { postData } = useApiPost();
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);

  const fetchUsers = useCallback(
    async (pageNum: number = 1, append = false, search = '') => {
      if (append && pageNum > totalPages) return { success: false };

      if (!append) setIsLoading(true);
      else setIsLoadingNext(true);

      try {
        const res = await postData('/users/find-user-not-following', {
          page: pageNum,
          user_name: search,
        });

        if (res?.status) {
          const records = res.data?.Records || [];
          const pages = res.data?.Pagination?.total_pages || 1;

          setUsers((prev) => (append ? [...prev, ...records] : records));
          setTotalPages(pages);
          return { success: true, page: pageNum };
        } else {
          throw new Error(res.message || 'Failed to load users');
        }
      } catch (err) {
        return { success: false };
      } finally {
        setIsLoading(false);
        setIsLoadingNext(false);
      }
    },
    [postData, totalPages]
  );

  const handleFollowUnfollow = useCallback(
    async (userId: number, isFollowed: boolean) => {
      try {
        const res = await postData('/follow/follow-unfollow', {
          user_id: userId,
        });

        if (res.status) {
          toast.success(res.message);
          setUsers((prev) =>
            prev.map((user) =>
              user.user_id === userId ? { ...user, is_follow: !isFollowed } : user
            )
          );
          return { success: true };
        } else {
          throw new Error(res.message || 'Failed to update follow status');
        }
      } catch (error) {
        // toast.error('Something went wrong');
        return { success: false };
      }
    },
    [postData]
  );

  return {
    users,
    totalPages,
    isLoading,
    isLoadingNext,
    fetchUsers,
    handleFollowUnfollow,
    setUsers,
  };
};