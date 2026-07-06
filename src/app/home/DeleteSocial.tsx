"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { hideModal } from "../store/Slice/ModalsSlice";
import { DeleteSocialRes } from "../types/ResTypes";
import useApiPost from "../hooks/postData";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { SocialRecord } from "../types/Reels";
import CustomDialog from "../components/CustomDialog";

interface DeleteSocialProps {
  setReels: React.Dispatch<React.SetStateAction<SocialRecord[]>>;
}

function DeleteSocial({ setReels }: DeleteSocialProps) {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.modals.DeleteSocial);
  const socialId = useAppSelector((state) => state.comment.activeReelId);
  const { postData, loading } = useApiPost();

  const handleDeleteSocial = async () => {
    try {
      const response: DeleteSocialRes = await postData(
        "/social/delete-social",
        {
          social_id: socialId,
        }
      );

      if (response.status) {
        toast.success(response.message);

        // ✅ Immediately remove from Home reels
        setReels((prev) => prev.filter((reel) => reel.social_id !== socialId));
      } else {
        toast.error(response.message)
      }

      dispatch(hideModal("DeleteSocial"));
    } catch (error) {
      toast.error("Failed to delete reel");
    }
  };

  return (
    // <Dialog
    //   open={open}
    //   onClose={() => dispatch(hideModal("DeleteSocial"))}
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
      <CustomDialog open={open} onClose={() => dispatch(hideModal("DeleteSocial"))} title="Delete Reel" width="420px" >
      {/* Title */}
      <div className=" space-y-4 p-4">
        {/* <div className="place-items-center mb-4">
          <p className=" font-semibold text-base text-center font-gilroy_semibold text-dark">
            Delete Reel
          </p>
        </div> */}
        <p className="text-dark text-center text-sm max-w-xs mx-auto">
          Are you sure you want to delete Reel ?
        </p>
        <div className="flex gap-6 justify-center mt-8">
          <button
            className="px-10 py-2 rounded-xl text-sm border cursor-pointer border-main-green "
            onClick={() => dispatch(hideModal("DeleteSocial"))}
          >
            {" "}
            Cancel
          </button>
          <button
            className="px-12 py-2 text-primary cursor-pointer font-medium text-sm rounded-xl bg-main-green"
            onClick={handleDeleteSocial}
          >
            {loading ? <ClipLoader color="#FFFFFF" size={10} /> : "Delete"}
          </button>
        </div>
      </div>
    </CustomDialog>
  );
}

export default DeleteSocial;
