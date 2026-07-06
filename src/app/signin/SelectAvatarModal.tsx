"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { Dialog } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { hideModal, showModal } from "../store/Slice/ModalsSlice";
import { RxCaretLeft, RxCaretRight, RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import { useAvatars } from "../store/api/getAvatars";
import Cookies from "js-cookie";
import useApiPost from "../hooks/postData";
import { ProjectConfigRes, UpdateUserRes } from "../types/ResTypes";
import { uploadFileToS3 } from "../hooks/s3upload";

function SelectAvatarModal() {
  const token = Cookies.get("Reelboost_auth_token");
  // const { data: AvatarData, isLoading } = useGetAllAvatarQuery({
  //   token: token,
  // });
  const { data: AvatarData } = useAvatars(token);
  const { postData, loading } = useApiPost();

  const Avatars = AvatarData?.data.Records;

  const [uploadedImage, setUploadedImage] = useState("");
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [mediaflow, setMediaflow] = useState<"LOCAL" | "S3" | string>("");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(
          `https://api.yeteneksat.com/api/project_conf`,
          {
            headers: {
              Authorization: `Bearer ${
                Cookies.get("Reelboost_auth_token") || ""
              }`,
            },
          }
        );

        const data: ProjectConfigRes = await res.json();

        if (data?.data?.mediaflow) {
          setMediaflow(data.data.mediaflow);
        }
      } catch (error) {
        // Optional: Show toast, but DO NOT redirect here
      }
    };

    fetchConfig();
  }, []);

  //   const dispatch = useAppDispatch();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    avatar_id: 0,
  });

  const [selectedAvatar, setSelectedAvatar] = useState<number | null>();

  // Function to handle avatar selection
  const handleAvatarClick = (avatarSrc: string, avatarId: number) => {
    setSelectedAvatar(avatarId);
    setUploadedImage(avatarSrc);
    setImagePreview(null); // Clear custom uploaded image preview
    setImageFile(null); // Clear uploaded file
    setFormData({
      ...formData,
      avatar_id: avatarId,
    });
  };

  // Function to trigger file input
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to remove uploaded image
  const handleRemoveImage = () => {
    setUploadedImage(""); // remove uploaded image
    setImagePreview(null); // clear preview
    setImageFile(null); // clear file

    // Reset to the first avatar if avatars exist
    if (Avatars && Avatars.length > 0) {
      const firstAvatar = Avatars[0];
      setSelectedAvatar(firstAvatar.avatar_id);
      setUploadedImage(firstAvatar.avatar_media);
      setFormData({
        ...formData,
        avatar_id: firstAvatar.avatar_id,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Clear avatar selection
      setSelectedAvatar(null);
      setUploadedImage("");
      setFormData({
        ...formData,
        avatar_id: 0, // Clear avatar ID
      });
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const form = new FormData();

    if (selectedAvatar) {
      form.append("avatar_id", formData.avatar_id.toString());
      form.append("pictureType", "avatar");
    } else if (imageFile) {
      // S3 Flow condition
      if (mediaflow === "LOCAL") {
        form.append("files", imageFile);
      } else {
        form.append("file_media_1", imageFile);
        const uploadedImageUrl = await uploadFileToS3(
          imageFile,
          "reelboost/images", // S3 folder prefix for images
          postData
        );

        if (!uploadedImageUrl) {
          toast.error("Image upload failed!");
          return;
        }

        // Append the S3 URL to formData
        form.append("file_media_1", uploadedImageUrl);
      }
    } else {
      toast.error("Please select an avatar or upload an image.");
      return;
    }

    setIsSubmitting(true); // block any redirect checks

    try {
      const response: UpdateUserRes = await postData("/users/updateUser", form);
      if (response.status) {
        dispatch(hideModal("Avtar"));
        dispatch(showModal("Profile"));
        window.location.replace("/");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (Avatars && Avatars.length > 0 && !selectedAvatar && !imagePreview) {
      setSelectedAvatar(Avatars[0].avatar_id);
      setUploadedImage(Avatars[0].avatar_media);
      setFormData((prev) => ({
        ...prev,
        avatar_id: Avatars[0].avatar_id,
      }));
    }
  }, [Avatars]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -100, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 100, behavior: "smooth" });
  };

  const open = useAppSelector((state) => state.modals.Avtar);

  return (
    <>
      <Dialog
        open={open}
        fullWidth
        PaperProps={{
          sx: {
            p: 0,
            overflow: "visible",
            borderRadius: 3,
            maxWidth: "100%",
            width: "420px",
          },
        }}
        BackdropProps={{
          sx: {
            background: "#000000BD",
          },
        }}
      >
        {/* Select Image div */}
        <div
          className="flex flex-col rounded-xl justify-center opacity-100 place-content-center relative bg-primary sm:py-8 sm:px-8 p-5"
          style={{ boxShadow: "9.3px 10.46px 64.96px 0px #00000026" }}
        >
          {/* Select Avatar div */}
          <div>
            <h2 className="text-center text-dark sm:text-base text-sm font-medium">
              {" "}
              Pick your Avatar or select a photo
            </h2>

            {/* Profile Circle */}
            <div className="flex justify-center items-center w-full py-4">
              <div className="relative rounded-full border border-main-green/[0.4] w-24 h-24 flex justify-center items-center">
                {/* Border */}

                {/* User Image */}
                {/* {IsLoading ? (
                  <>
                    <div className="w-24 h-24 rounded-full">
                      <RoundedShimmer />
                    </div>
                  </>
                ) : (
                  <> */}
                <Image
                  src={
                    imagePreview
                      ? imagePreview // uploaded image
                      : uploadedImage // selected avatar image
                  }
                  alt="User"
                  className="absolute inset-0 rounded-full w-22 h-22 m-auto"
                  height={85}
                  width={85}
                />

                {/* </> */}

                {/* )} */}
              </div>
            </div>

            {/* Choose Avatar */}
            <div className="border border-[#EFEFEF] rounded-xl px-4 py-2">
              <h2 className="text-left font-semibold text-dark font-poppins text-sm">
                Choose Avatar
              </h2>

              <div className="relative py-4">
                {/* Left Arrow */}
                <button
                  className="absolute -left-8 top-1/2 cursor-pointer -translate-y-1/2 z-10 bg-primary shadow-md p-2 rounded-full"
                  onClick={scrollLeft}
                >
                  <RxCaretLeft className="text-lg text-dark" />
                </button>

                {/* Avatar Scroll Area */}
                <div
                  ref={scrollRef}
                  className="flex gap-4 overflow-x-auto no-scrollbar px-4"
                >
                  {Avatars?.map((avatar) => (
                    <div
                      key={avatar.avatar_id}
                      onClick={() =>
                        handleAvatarClick(avatar.avatar_media, avatar.avatar_id)
                      }
                      className={`relative cursor-pointer flex-shrink-0 flex justify-center items-center ${
                        selectedAvatar === avatar.avatar_id
                          ? "border-2 border-main-green rounded-full p-1"
                          : ""
                      }`}
                    >
                      {selectedAvatar === avatar.avatar_id && (
                        <>
                          <div className="bg-main-green rounded-full absolute -bottom-[-1px] p-0.5 border-4 border-primary -right-[-2px]">
                            <TiTick className="text-primary text-xs" />
                          </div>
                        </>
                      )}
                      {/* {IsLoading ? (
                        <>
                          <div className="w-20 h-20 rounded-full">
                            <RoundedShimmer />
                          </div>
                        </>
                      ) : (
                        <> */}
                      <Image
                        src={avatar.avatar_media}
                        alt=""
                        className="rounded-full"
                        height={70}
                        width={70}
                      />
                      {/* </>
                      )} */}
                    </div>
                  ))}
                </div>

                {/* Right Arrow */}
                <button
                  className="absolute -right-8 top-1/2 cursor-pointer -translate-y-1/2 z-10 bg-primary shadow-md p-2 rounded-full"
                  onClick={scrollRight}
                >
                  <RxCaretRight className="text-dark" />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center py-4 w-full">
              <div className="flex-grow border-t border-main-green"></div>
              <h1 className="mx-4 text-lg font-poppins text-dark font-base">
                OR
              </h1>
              <div className="flex-grow border-t border-main-green"></div>
            </div>

            {/* Choose photo image */}
            <div className="border border-gray-200 rounded-xl px-4 py-2">
              <h2 className="text-left text-sm font-semibold text-dark">
                Choose From
              </h2>

              {imagePreview ? (
                <div className="relative">
                  <div className="flex justify-center items-center w-full py-2">
                    <div className="shadow-md px-1 py-1 rounded-full">
                      <div className="relative w-24 h-24 border rounded-full border-main-green flex justify-center items-center">
                        <div
                          className="absolute bottom-16 p-1 border-4 border-primary -right-1 cursor-pointer bg-main-green rounded-full"
                          onClick={handleRemoveImage}
                        >
                          <RxCross2 className="text-primary text-xs xl:text-sm" />
                        </div>
                        <Image
                          src={imagePreview}
                          alt="Uploaded"
                          className="inset-0 rounded-full w-22 h-22 m-auto"
                          height={85}
                          width={85}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="items-center w-full place-items-center h-full pb-4">
                  <div
                    className="flex justify-center background-opacityGradient rounded-full p-4"
                    onClick={handleImageClick}
                  >
                    <Image
                      src="/signup/gallery.png"
                      height={25}
                      width={25}
                      alt="gallery"
                    />
                  </div>
                  <label className="block cursor-pointer text-gray-600 pt-3 text-sm">
                    Add Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Submit button */}
            <div className="flex justify-center">
              <button
                className="py-2 w-full mt-6 cursor-pointer text-sm rounded-xl text-primary font-normal bg-main-green font-sans hover:opacity-90 "
                onClick={handleSubmit}
              >
                {loading ? (
                  <>
                    <ClipLoader color="#FFFFFF" size={15} loading={loading} />
                  </>
                ) : (
                  <>Submit</>
                )}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
export default SelectAvatarModal;
