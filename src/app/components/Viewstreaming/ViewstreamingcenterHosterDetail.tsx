"use client";

import CustomDialog from "@/app/components/CustomDialog";
import useApiPost from "@/app/hooks/postData";
import { setFollowersCount, setFollowingCount } from "@/app/store/Slice/FollowFollowingCount";
import { hideModal } from "@/app/store/Slice/ModalsSlice";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import { DialogContent, IconButton } from "@mui/material";
import Image from "next/image";
import { FiUserPlus, FiMessageCircle } from "react-icons/fi";
import ViewstreamingcenterHosterDetailSocial from "./ViewstreamingcenterHosterDetailSocial";
import { useEffect, useState } from "react";
import { setIsApiCall } from "@/app/store/Slice/uiSlice";
function ViewstreamingcenterHosterDetail() {

    const { postData, loading } = useApiPost();



    const open = useAppSelector(
        (state) => state.modals.ViewstreamingcenterHosterDetail
    );
    const dispatch = useAppDispatch();

    const [likecount, setLikecount] = useState()


    console.log("likecount", likecount)



    const user = useAppSelector((state) => state.viewStream.records[0]?.User);


    console.log("RRRR", user?.user_id)


    const ISApiCall = useAppSelector((state) => state.ui.isApiCall)




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
        } catch (err) { }
    };

    useEffect(() => {
        if (ISApiCall) {
            fetchFollowCounts(user?.user_id, "following");
            fetchFollowCounts(user?.user_id, "follower");
        }
    }, [ISApiCall])


    useEffect(() => {
        if (!user?.user_id) return;

        fetchFollowCounts(user.user_id, "following");
        fetchFollowCounts(user.user_id, "follower");
    }, [user?.user_id]);






    const followersCount = useAppSelector(
        (state) => state.followFollowingSlice.followersCount
    );

    console.log("followersCount", followersCount)

    const followingCount = useAppSelector(
        (state) => state.followFollowingSlice.followingCount
    );



    useEffect(() => {
        const fetchLikeCount = async () => {
            try {
                const res = await postData("/like/users-like-count", {
                    user_id: user?.user_id,
                });
                setLikecount(res?.data?.counts)
                console.log("resDDDDDDDD", res?.data?.counts);
            } catch (error) {
                console.error("Error fetching like count:", error);
            }
        };

        if (user?.user_id) {
            fetchLikeCount();
        }
    }, [user?.user_id]);



    const reels = useAppSelector((s) => s.userReels.reels);


    console.log("reelsreelsreels", reels[0]?.isFollowing)


    const handleFollowUnfollow = async (userId: number) => {

        dispatch(setIsApiCall(false));   // API started

        await postData("/follow/follow-unfollow", { user_id: userId });
        dispatch(setIsApiCall(true));   // API started
    };



    return (
        <CustomDialog
            open={open}
            onClose={() =>
                dispatch(hideModal("ViewstreamingcenterHosterDetail"))
            }
            title="Profile"
            fullWidth
            maxWidth="sm"
            width="600px"

        >
            <DialogContent sx={{ p: 0 }}>
                <div className="flex flex-col h-[80vh] bg-white">


                    {/* USER INFO */}
                    <div className="px-4 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* AVATAR */}
                            <div className="w-24 h-24 rounded-full overflow-hidden border">
                                <Image
                                    src={user?.profile_pic || "/avatar.png"}
                                    alt="profile"
                                    width={84}
                                    height={84}
                                    className="object-cover w-full h-full"
                                />
                            </div>

                            {/* NAME */}
                            <div>
                                <div className="flex items-center gap-1">
                                    <h3 className="font-semibold text-gray-900">
                                        {user?.full_name || "Demo User"}
                                    </h3>


                                </div>

                                <p className="text-sm text-gray-500">
                                    @{user?.user_name || "demouser"}
                                </p>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-2">

                            {/* Follow Button add icon  */}
                            <button className="  bg-main-green cursor-pointer    text-white font-medium text-lg py-3 px-4 w-full rounded-md flex justify-center items-center gap-2" onClick={() => handleFollowUnfollow(user?.user_id)}>
                                <FiUserPlus size={20} />
                                {reels[0]?.isFollowing ? "Following" : "Follow"}

                            </button>

                            {/* Message Button  add icon  */}
                            <button className="cursor-pointer bg-main-green  text-white font-medium text-lg py-4 px-4 w-full rounded-md flex justify-center items-center gap-2">
                                <FiMessageCircle size={20} />

                            </button>
                        </div>
                    </div>

                    {/*  follow detain  */}

                    <div className="flex mx-auto w-[80%] justify-around gap-8">
                        <div className="flex flex-col items-center">
                            <p className="text-black font-bold text-lg">{followersCount}</p>
                            <p className="text-black/90 font-normal text-lg">Followers</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <p className="text-black font-bold text-lg">{followingCount}</p>
                            <p className="text-black/90 font-normal text-lg">Following</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <p className="text-black font-bold text-lg">{likecount}</p>
                            <p className="text-black/90 font-normal text-lg">Likes</p>
                        </div>
                    </div>
                    <ViewstreamingcenterHosterDetailSocial />
                </div>
            </DialogContent>
        </CustomDialog>
    );
}

export default ViewstreamingcenterHosterDetail;

