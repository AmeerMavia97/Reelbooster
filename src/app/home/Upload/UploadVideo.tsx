"use client";
import CustomDialog from "@/app/components/CustomDialog";
import { setSelectedVideo, setVideoUrl } from "@/app/store/Slice/MediaSlice";
import { hideModal, showModal } from "@/app/store/Slice/ModalsSlice";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import { DialogContent } from "@mui/material";
import Image from "next/image";
import { useRef } from "react";

function UploadVideo() {
  const open = useAppSelector((state) => state.modals.UploadVideo);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const selectedVideoUrl = URL.createObjectURL(file);
      dispatch(setVideoUrl(selectedVideoUrl));
      dispatch(setSelectedVideo(file)); // store single file
      dispatch(showModal("TrimVideo"));
      dispatch(hideModal("UploadVideo"));
    }
  };

  return (
    // <Dialog
    //       open={open}
    //       onClose={() => {
    //         dispatch(hideModal("UploadVideo"));

    //       }}
    //       fullWidth
    //       maxWidth="sm"
    //       PaperProps={{
    //         sx: {
    //           p: 0,
    //           borderRadius: "16px",
    //           minHeight: "700px",
    //           width: "500px",
    //           maxWidth: "100%",
    //           display: "flex",
    //           flexDirection: "column",
    //         },
    //       }}
    //     >
    <CustomDialog
      open={open}
      onClose={() => dispatch(hideModal("UploadVideo"))}
      title="Upload Video"
      fullWidth={true}
      maxWidth="sm"
      width="500px"
    >
      <DialogContent sx={{ p: 0 }}>
        <div className="flex flex-col h-full bg-primary">
          {/* Content */}
          <div
            className="flex-1 flex items-center justify-center cursor-pointer py-4 sm:py-10 px-6"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-main-green rounded-lg sm:h-[550px] h-[400px] w-full gap-2 px-6 py-6">
              <Image
                src="/signup/gallery.png"
                alt="Upload photo"
                width={35}
                height={35}
              />
              <div className="text-xs text-icon text-center">
                Ekleyeceğiniz videoyu seçin.
                <br />
                <span className="text-gray text-[10px]">(.mp4 formatı)</span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </div>
            </div>
          </div>

          {/* Footer with Next Button */}
          <div className="px-4 pb-4">
            <button
              className={`w-full text-sm rounded-xl py-3 ${
                fileInputRef
                  ? "bg-main-green text-primary cursor-pointer"
                  : "bg-main-green/70 cursor-not-allowed text-primary"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              Next
            </button>
          </div>
        </div>
      </DialogContent>
    </CustomDialog>
  );
}

export default UploadVideo;
