"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAppDispatch } from "@/app/utils/hooks";
import { showModal } from "@/app/store/Slice/ModalsSlice";
import { setUserId } from "@/app/store/Slice/UserIdHashtagIdSlice";
import { useRouter } from "next/navigation";
import RoundedShimmer from "../Shimmer/RoundedShimmer";
import Image from "next/image";
import { normalizeMediaUrl, normalizeMediaUrlsDeep } from "@/app/utils/mediaUrl";

interface User {
  user_id: number;
  user_name: string;
  full_name: string;
  profile_pic: string;
}

function SuggestedAccounts() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const token = Cookies.get("Reelboost_auth_token");

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const apiUrl = token
          ? `${process.env.NEXT_PUBLIC_API_URL}/users/find-user-not-following`
          : `${process.env.NEXT_PUBLIC_API_URL}/users/find-user-no-auth`;

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: token ? JSON.stringify({ page: 1 }) : undefined,
        });

        const result = normalizeMediaUrlsDeep(await response.json());

        // Filter out users with empty or whitespace-only username
        const filteredUsers = (result?.data?.Records || [])
          .filter((user: { user_name: string; }) => user.user_name && user.user_name.trim() !== "")
          .slice(0, 4);

        setUsers(filteredUsers);
      } catch (error) {
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleUser = (userId: number) => {
    dispatch(setUserId(userId));
    const loggedInUserId = Cookies.get("Reelboost_user_id");

    if (userId.toString() === loggedInUserId) {
      router.push("/profile");
    } else {
      router.push(`/profile/${userId}`);
    }
  };

  return (
    <>
      <div className="px-10 border-t">
        <h2 className=" text-base text-gray pt-4 pb-5">Suggested Accounts</h2>

        {isLoading ? (
          <div className="animate-pulse pr-10">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex gap-2 items-center mb-4">
                <div className="w-10 h-10">
                  <RoundedShimmer />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="w-[100px] h-[8px] bg-gray-300 rounded" />
                  <div className="w-[60px] h-[6px] bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.user_id}
              className="flex gap-3 items-center mb-4 cursor-pointer"
              onClick={() => {
                if (!token) {
                  dispatch(showModal("Signin"));
                } else {
                  handleUser(user.user_id);
                }
              }}
            >
              <div className="rounded-full w-[40px] h-[40px] overflow-hidden">
                <Image
                  src={normalizeMediaUrl(user.profile_pic)}
                  alt={user.user_name}
                  className="w-full h-full object-cover rounded-full"
                  width={60}
                  height={60}
                />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xs text-dark font-medium truncate max-w-[100px]">
                  {user.user_name}
                </h3>
                <p className="text-[10px] font-normal text-gray max-w-[80px] truncate">
                  {user.full_name}
                </p>
              </div>
            </div>
          ))
        )}

        <button
          className="cursor-pointer text-sm hover:underline text-main-green"
          onClick={() => {
            if (!token) {
              dispatch(showModal("Signin"));
            } else {
              dispatch(showModal("SearchAccounts"));
            }
          }}
        >
          See all
        </button>
      </div>
    </>
  );
}

export default SuggestedAccounts;
