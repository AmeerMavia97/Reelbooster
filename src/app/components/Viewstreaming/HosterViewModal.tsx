"use client";

import { Dialog, IconButton } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { FiUserPlus, FiMessageCircle } from "react-icons/fi";

import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import Image from "next/image";
import { setIsApiCall } from "@/app/store/Slice/uiSlice";
import { updateFollowStatus } from "@/app/store/Slice/SelectedReelDetail";
import useApiPost from "@/app/hooks/postData";
import { setReels } from "@/app/store/Slice/UserReelsSlice";

interface Props {
    open: boolean;
    onLeave: () => void;
}

export default function HosterViewModal({ open, onLeave }: Props) {

    const viewStreaming = useAppSelector((s) => s.viewStreaming.response?.data?.Records?.[0].Live_hosts?.[0].User);



    console.log("viewStreaming###@##" , viewStreaming)



  const reel = useAppSelector((s) => s.selectedReel.reel);


  const {postData} = useApiPost()
 

  const dispatch =  useAppDispatch()



    const handleFollowUnfollow = async (userId: number) => {

    dispatch(setIsApiCall(false));   // API started

    dispatch(updateFollowStatus());

    

    await postData("/follow/follow-unfollow", { user_id: userId });
  dispatch(setIsApiCall(true));   // API started
  };


    return (
        <Dialog
            open={open}
            onClose={onLeave}
            keepMounted
            fullWidth
            PaperProps={{
                sx: {
                    width: {
                        xs: "90%",     // mobile
                        sm: 420,       // small screens
                        md: 600,       // tablets
                        lg: 540,       // desktop
                    },
                    maxWidth: "100%",
                    background: "transparent",
                    boxShadow: "none",
                    borderRadius: "19px",
                },
            }}
            sx={{
                "& .MuiBackdrop-root": {
                    backdropFilter: "blur(20px)",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                },
            }}
        >

            {/* Multicolor Gradient Border (matching the rainbow glow in the image) */}
            <div className="p-[2px] rounded-xl ">

                {/* Inner Glassmorphic Card with starry/space background */}
                <div className="relative rounded-3xl px-6  py-4   bg-main-green  overflow-hidden">

                    {/* Close Button */}
                    <IconButton
                        onClick={onLeave}
                        className="!absolute top-2 right-4 !text-white z-10"
                    >
                        <IoClose size={28} />
                    </IconButton>

                    {/* Header: Profile Title */}
                    <div className="  text-left">
                        <h2 className="text-white text-xl font-semibold">Profile</h2>
                    </div>


                    {/*  Profile Information */}

                    <div className=" w-full  flex  mt-4  z-20  gap-3">
                        {/* Porfile Image */}
                        <div className=" w-28 h-28  border-2 border-[#1A9D77] rounded-full overflow-hidden relative">
                            <Image src={viewStreaming?.data?.Records?.[0].Live_hosts?.[0].User?.profile_pic || "/default-profile.png"} alt="Profile" width={100} height={100} className="rounded-full w-full  h-full object-cover" />
                        </div>

                        {/* Name and Username */}


                        <div className="  flex flex-col justify-center ">
                            <span className="text-white text-xl font-bold">
                                {viewStreaming?.data?.Records?.[0].Live_hosts?.[0].User?.full_name || "Host Name"}
                            </span>
                            <span className="text-white/70 text-[16px]">
                                @{viewStreaming?.data?.Records?.[0].Live_hosts?.[0].User?.user_name || "username"}
                            </span>

                        </div>

                    </div>

                    {/*  fllowing  detail */}


                    <div className="w-full flex justify-between mt-[-0.6rem] items-center gap-4">

                        {/* Followers */}
                        <div className="flex-1 flex items-center border      border-gray-400  cursor-pointer py-2 rounded-lg flex-col">
                            <span className="text-white text-lg font-bold">
                        0
                            </span>
                            <span className="text-white font-medium text-lg">Followers</span>
                        </div>

                        {/* Following */}
                        <div className="flex-1 flex items-center border border-[#1A9D77] py-2 rounded-lg cursor-pointer flex-col">
                            <span className="text-white text-lg font-bold">
                                 0
                            </span>
                            <span className="text-white font-medium text-lg">Following</span>
                        </div>

                        {/* Likes */}
                        <div className="flex-1 cursor-pointer flex items-center border border-[#1A9D77] py-2 rounded-lg flex-col">
                            <span className="text-white text-lg font-bold">
                                0
                            </span>
                            <span className="text-white font-medium text-lg">Likes</span>
                        </div>

                    </div>

                    {/*  Fllow and message btn */}

                    <div className="  w-full  flex justify-between items-center  gap-10 mt-6 ">

                        {/* Follow Button add icon  */}
                        <button className="bg-white cursor-pointer text-black font-medium text-lg py-4 px-4 w-full rounded-xl flex justify-center items-center gap-2"   onClick={() => handleFollowUnfollow(viewStreaming?.user_id)}>
                            <FiUserPlus size={20} />
                        {reel?.isFollowing ? "Following" : "Follow"}
 
                        </button>

                        {/* Message Button  add icon  */}
                        <button className="bg-white cursor-pointer text-black font-medium text-lg py-4 px-4 w-full rounded-xl flex justify-center items-center gap-2">
                            <FiMessageCircle size={20} />
                            Message
                        </button>

                    </div>


                </div>
            </div>

        </Dialog>
    );
}