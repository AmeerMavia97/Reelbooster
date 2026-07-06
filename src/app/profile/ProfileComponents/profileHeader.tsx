"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import { hideModal, showModal } from "@/app/store/Slice/ModalsSlice";
import useApiPost from "@/app/hooks/postData";
import { FindUserRes, UserRecord } from "@/app/types/ResTypes";
import { setUserData } from "@/app/store/Slice/UserDataSlice";
import RoundedShimmer from "@/app/components/Shimmer/RoundedShimmer";
import {
  setFollowersCount,
  setFollowingCount,
} from "@/app/store/Slice/FollowFollowingCount";
import Image from "next/image";
import { updateFollowStatus } from "@/app/store/Slice/SelectedReelDetail";
import { toast } from "react-toastify";
import { clearMessageList } from "@/app/store/Slice/MessageListSlice";
import { resetPagination } from "@/app/store/Slice/MessageOptionsSlice";
import { updateCurrentConversation } from "@/app/store/Slice/CurrentConversationSlice";
import { socketInstance } from "@/app/socket/socket";
import { useRouter } from "next/navigation";
import SelectOption from "./ReportBlockUser/SelectOption";
import { useUserProfile } from "@/app/store/api/updateUser";
import { useTransactionConfQuery } from "@/app/store/api/getTransactionConf";
import { setChatId } from "@/app/store/Slice/setChatIdMessageLoading";

interface ProfileHeaderProps {
  userId?: string;
  isMyProfile?: boolean;
}

function ProfileHeader({ userId, isMyProfile = false }: ProfileHeaderProps) {
  const dispatch = useAppDispatch();
  const { postData, loading } = useApiPost();

  const [user, setUser] = useState<UserRecord | null>(null);
  const token = Cookies.get("Reelboost_auth_token");
  const { data } = useUserProfile(token ?? "");

  const followersCount = useAppSelector(
    (state) => state.followFollowingSlice.followersCount
  );
  const followingCount = useAppSelector(
    (state) => state.followFollowingSlice.followingCount
  );

  const fallbackUserId = Cookies.get("Reelboost_user_id");
  const finalUserId = userId || fallbackUserId;
  const optionsOpen = useAppSelector((state) => state.modals.Options);

  const handleOptionsToggle = () => {
    if (optionsOpen) {
      dispatch(hideModal("Options"));
    } else {
      dispatch(showModal("Options"));
    }
  };

  const userData = useAppSelector((state) => state.userData.user);

  useEffect(() => {
    if (finalUserId) {
      if (isMyProfile && userData) {
        setUser(userData); // Use Redux for my own profile
      } else {
        fetchUser(finalUserId); // Fetch from API for other users
      }
      fetchFollowCounts(finalUserId!, "following"); // Initial fetch for following
      fetchFollowCounts(finalUserId!, "follower"); // Initial fetch for followers
    }
  }, [finalUserId, isMyProfile, userData]);

  const fetchUser = async (user_id: string) => {
    try {
      const res: FindUserRes = await postData("/users/find-user", {
        user_id,
        page: 1,
      });

      if (res?.status && res.data?.Records?.length > 0) {
        setUser(res.data.Records[0]);
        if (isMyProfile) {
          dispatch(setUserData(res.data.Records[0]));
        }
      }
    } catch (err) {}
  };

  // follow unfollow user =============
  const handleFollowUnfollow = async (userId: number) => {
    dispatch(updateFollowStatus());

    const res = await postData("/follow/follow-unfollow", { user_id: userId });

    if (res.status) {
      toast.success(res.message);

      // Update UI immediately
      setUser((prevUser) => {
        if (!prevUser) return prevUser; // do nothing if null
        return {
          ...prevUser,
          is_follow: !prevUser.is_follow,
        };
      });

      // Update followers count manually
      dispatch(
        setFollowersCount(
          user?.is_follow ? followersCount - 1 : followersCount + 1
        )
      );
    } else {
      toast.error(res.message || "Failed to update follow status");
      dispatch(updateFollowStatus()); // Revert if needed
    }
  };

  // handle Message user =========================
  const chatList = useAppSelector((state) => state.chatList);
  const router = useRouter();
  const handleMessage = async (user: any) => {
    const existingChat = Array.isArray(chatList)
      ? chatList.find((chat) => chat.PeerUserData.user_id === user.user_id)
      : null;

    if (existingChat && existingChat.Records.length > 0) {
      const record = existingChat.Records[0];
      dispatch(
        updateCurrentConversation({
          ...record,
          PeerUserData: existingChat.PeerUserData,
          isNewConversation: false, // explicitly false
        })
      );
      dispatch(setChatId(record.chat_id));
    } else {
      // truly new conversation
      dispatch(
        updateCurrentConversation({
          chat_id: undefined,
          PeerUserData: user,
          Messages: [],
          isNewConversation: true,
        })
      );
      dispatch(clearMessageList());
      dispatch(resetPagination());
    }

    router.push("/message");
  };

  const fetchFollowCounts = async (user_id: string, type: string) => {
    try {
      const res = await postData("/follow/follow-following-list", {
        page: 1,
        type,
        user_id,
      });

      if (res?.status) {
        if (type === "following") {
          dispatch(setFollowingCount(res.data?.Pagination?.total_records || 0));
        } else if (type === "follower") {
          dispatch(setFollowersCount(res.data?.Pagination?.total_records || 0));
        }
      }
    } catch (err) {}
  };

  // to fetch the 1 coin value to calculate balance ==================
  const { data: confData } = useTransactionConfQuery();
  const [dollarValue, setDollarValue] = useState(0);

  useEffect(() => {
    if (confData?.data?.Records?.length && data?.data?.available_coins) {
      // usually only 1 config record, but picking first
      const coinValuePer1Currency = parseFloat(
        confData.data.Records[0].coin_value_per_1_currency
      );

      // Convert coins to dollars
      const calculatedDollar = (
        Number(data.data.available_coins) / coinValuePer1Currency
      ).toFixed(2);

      setDollarValue(Number(calculatedDollar));
    }
  }, [confData, data]);

  return (
    <div className="sm:flex sm:justify-between sm:items-center">
      {/* user details ================================================================================= */}
      <div className="flex flex-col sm:flex-row gap-4 sm:pt-10 pt-4 items-center">
        {/* Profile pic */}
        {loading ? (
          <div className="sm:w-36 sm:h-36 w-24 h-24 rounded-full">
            <RoundedShimmer />
          </div>
        ) : (
          <div className="relative w-24 h-24 sm:w-40 sm:h-40 rounded-full overflow-hidden">
            <Image
              src={user?.profile_pic || ""}
              alt="Profile Picture"
              fill
              className="object-cover rounded-full"
              sizes="(max-width: 640px) 96px, 160px"
            />
          </div>
        )}

        {/* Details */}
        <div className="flex flex-col gap-2 items-center sm:items-start text-center sm:text-left">
          <div className="flex flex-col gap-0 place-items-center sm:place-items-start">
            <p className="text-dark font-semibold text-base">
              {user?.full_name
                ? user.full_name.charAt(0).toUpperCase() +
                  user.full_name.slice(1)
                : ""}
            </p>

            {user?.user_name != "" && (
              <p className="text-dark font-medium background-opacityGradient text-xs p-1 w-fit rounded-xl">
                <span className="font-semibold">@</span>
                {user?.user_name}
              </p>
            )}
          </div>

          {user?.bio !== "" && (
            <p className="text-dark font-normal text-sm md:max-w-md">
              {user?.bio}
            </p>
          )}

          {/* Followers / Following */}
          <div className="flex gap-6">
            <div className="flex gap-1.5 items-center">
              <p className="text-dark font-semibold text-sm">
                {followingCount}
              </p>
              <p
                className="font-normal sm:text-sm text-xs text-gray hover:underline cursor-pointer"
                onClick={() => {
                  if (finalUserId) {
                    fetchFollowCounts(finalUserId, "following");
                  }
                  dispatch(
                    showModal(
                      isMyProfile ? "MyFollowing" : "OtherUserFollowing"
                    )
                  );
                }}
              >
                Following
              </p>
            </div>

            <div className="flex gap-1.5 items-center">
              <p className="text-dark font-semibold text-sm">
                {followersCount}
              </p>
              <p
                className="font-normal sm:text-sm text-xs text-gray hover:underline cursor-pointer"
                onClick={() => {
                  fetchFollowCounts(finalUserId!, "follower");
                  dispatch(
                    showModal(
                      isMyProfile ? "MyFollowers" : "OtherUserFollowers"
                    )
                  );
                }}
              >
                Followers
              </p>
            </div>
          </div>

          {/* Buttons */}
          {!isMyProfile && (
            <div className="flex gap-4 mt-2">
              <button
                className={`cursor-pointer w-28 py-1.5 rounded-xl text-[12px] font-medium ${
                  user?.is_follow
                    ? "border border-main-green text-main-green"
                    : "bg-main-green text-primary"
                }`}
                onClick={() => handleFollowUnfollow(user?.user_id || 0)}
              >
                {user?.is_follow ? "Following" : "Follow"}
              </button>
              <button
                className="cursor-pointer text-main-green w-28 py-1.5 rounded-xl border border-main-green text-[12px] font-medium"
                onClick={() => handleMessage(user)}
              >
                Message
              </button>
            </div>
          )}

          {isMyProfile && (
            <button
              className="cursor-pointer text-main-green sm:px-8 px-10 sm:py-1.5 py-1.5 rounded-xl border border-main-green text-[12px] font-medium mt-2"
              onClick={() => dispatch(showModal("EditProfile"))}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* report and block user ================================================================ */}

      {!isMyProfile ? (
        <div className="relative">
          <div
            className="cursor-pointer absolute -top-72 right-2 sm:right-auto sm:top-auto sm:relative"
            onClick={handleOptionsToggle}
          >
            <Image src="/profile/dots.png" alt="dots" width={30} height={10} />
          </div>

          {optionsOpen && (
            <div className="absolute sm:top-full sm:right-0 -top-64 right-0 z-50">
              <SelectOption />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="relaive flex flex-col">
            <div
              className="cursor-pointer absolute top-20 right-2 sm:right-64"
              onClick={handleOptionsToggle}
            >
              <Image
                src="/SidebarIcons/setting.png"
                alt="dots"
                width={20}
                height={5}
                onClick={() => router.push("/setting")}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProfileHeader;
