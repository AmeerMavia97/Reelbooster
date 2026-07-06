"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import { hideModal } from "@/app/store/Slice/ModalsSlice";
import { setTotalSocials, setReels } from "@/app/store/Slice/ViewAudioSlice";
import useApiPost from "@/app/hooks/postData";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CustomDialog from "@/app/components/CustomDialog";

function ViewAudio() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.modals.ViewAudio);
  const MusicImage = useAppSelector((state) => state.music.musicImage);
  const MusicName = useAppSelector((state) => state.music.musicName);
  const MusicId = useAppSelector((state) => state.music.musicId);
  const total_socials = useAppSelector((state) => state.music.total_socials);

  const { postData } = useApiPost();
  const router = useRouter();

  useEffect(() => {
    let called = false;

    const fetchTotalAndReels = async () => {
      if (!MusicId || called) return;
      called = true;
      try {
        const payload = { social_type: "reel", page: 1, music_id: MusicId };
        const response = await postData("/social/get-social", payload);
        if (response?.status) {
          dispatch(setTotalSocials(response.data.Pagination.total_records));
          dispatch(setReels(response.data.Records));
          // Save pagination info to slice if needed
        }
      } catch (err) {
      }
    };

    if (open) fetchTotalAndReels();
  }, [MusicId, open, dispatch]);

  return (
    // <Dialog
    //   open={open}
    //   onClose={() => dispatch(hideModal("ViewAudio"))}
    //   fullWidth
    //   PaperProps={{
    //     sx: {
    //       p: 0,
    //       overflow: "visible",
    //       borderRadius: 3,
    //       maxHeight: "90vh",
    //       width: "420px",
    //       maxWidth: "100%",
    //     },
    //   }}
    //   BackdropProps={{
    //     sx: {
    //       background: "#000000BD",
    //     },
    //   }}
    // >
    <CustomDialog
      open={open}
      onClose={() => dispatch(hideModal("ViewAudio"))}
      title="View Audio"
      width="420px"
    >
      <div className="flex flex-col items-center w-full text-center pb-6">
        {/* <div className="w-full rounded-t-lg bg-main-green py-3">
          <h2 className="text- font-medium">View Audio</h2>
        </div> */}

        <div className="relative w-24 h-24 rounded-full mt-6 border-4 border-white shadow-md overflow-hidden">
          <Image
            src={MusicImage || ""}
            alt="Audio Thumbnail"
            fill
            className="object-cover"
          />
        </div>

        <div className="mt-3">
          <p className="text-gray text-sm">Original Audio</p>
          <h3 className="text-lg font-medium text-dark">{MusicName}</h3>
        </div>

        <div
          className="mt-3 cursor-pointer"
          onClick={() => {
            router.push("/music");
            dispatch(hideModal("ViewAudio"));
          }}
        >
          <span className="px-4 py-1 rounded-md text-dark background-opacityGradient text-sm font-medium">
            {total_socials} Reels
          </span>
        </div>
      </div>
    </CustomDialog>
  );
}

export default ViewAudio;
