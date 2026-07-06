"use client";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import "react-phone-input-2/lib/high-res.css";
import PhoneInput, { CountryData } from "react-phone-input-2";
import { hideModal } from "../store/Slice/ModalsSlice";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { ProjectConfigRes, UpdateUserRes } from "../types/ResTypes";
import useApiPost from "../hooks/postData";
import { updateUserData } from "../store/Slice/UserDataSlice";
import { useUserProfile } from "../store/api/updateUser";
import Cookies from "js-cookie";
import Image from "next/image";
import CustomDialog from "../components/CustomDialog";
import { uploadFileToS3 } from "../hooks/s3upload";

export default function EditProfile() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.modals.EditProfile);
  const { postData } = useApiPost();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // prevents default behavior
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(""); // for showing preview
  const token = Cookies.get("Reelboost_auth_token");
  const [mediaflow, setMediaflow] = useState<"LOCAL" | "S3" | string>("");
  useEffect(() => {
    if (!token) return;

    const fetchConfig = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/project_conf`
        );
        const data: ProjectConfigRes = await res.json();
        if (data?.data?.mediaflow) {
          setMediaflow(data.data.mediaflow);
        }
      } catch (error) {}
    };
    fetchConfig();
  }, [token]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  interface FormDataType {
    user_name: string;
    first_name: string;
    last_name: string;
    email: string;
    country_code: string;
    mobile: string;
    bio: string;
  }

  const [formData, setFormData] = useState<FormDataType>({
    user_name: "",
    first_name: "",
    last_name: "",
    email: "",
    country_code: "",
    mobile: "",
    bio: "",
  });

  const { data: userData, isSuccess } = useUserProfile(token ?? "");

  // Auto-populate form from query on success
  useEffect(() => {
    if (isSuccess && userData?.status && userData.data) {
      const user = userData.data;

      setFormData({
        user_name: user.user_name || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        country_code: user.country_code || "",
        mobile: user.mobile_num || "",
        bio: user.bio || "",
      });

      // Set image preview to profile_pic
      setImagePreviewUrl(user.profile_pic);
    }
  }, [isSuccess, userData, dispatch]);

  const handleGetUserDetails = async () => {
    try {
      const submitData = new FormData();
      submitData.append("user_name", formData.user_name);
      submitData.append("first_name", formData.first_name);
      submitData.append("last_name", formData.last_name);
      submitData.append("email", formData.email);
      submitData.append("country_code", formData.country_code);
      submitData.append("mobile", formData.mobile);
      submitData.append("bio", formData.bio);

      //  Send selected image as `files`
      if (selectedImageFile) {
        if (mediaflow === "LOCAL") {
          // Local flow: send file directly
          submitData.append("files", selectedImageFile);
        } else {
          // S3 flow: upload image and get URL
          const uploadedImageUrl = await uploadFileToS3(
            selectedImageFile,
            "reelboost/images", // S3 folder prefix for images
            postData
          );

          if (!uploadedImageUrl) {
            toast.error("Image upload failed!");
            return;
          }

          // Append the S3 URL to formData
          submitData.append("file_media_1", uploadedImageUrl);
        }

        submitData.append("pictureType", "profile_pic"); // or other type if needed
      }

      const response: UpdateUserRes = await postData(
        "/users/updateUser",
        submitData,

        "multipart/form-data"
      );

      if (response?.status) {
        toast.success("Profile updated successfully");
        dispatch(updateUserData(response.data));
        dispatch(hideModal("EditProfile"));
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      {/* <Dialog
        open={open}
        onClose={() => dispatch(hideModal("EditProfile"))}
        fullWidth
        PaperProps={{
          sx: {
            p: 0,
            overflow: "visible",
            borderRadius: 3,
            maxHeight: "90vh",
            width: "430px",
            maxWidth: "100%",
          },
        }}
        BackdropProps={{
          sx: {
            background: "#000000BD",
          },
        }}
      > */}
      <CustomDialog
        open={open}
        onClose={() => dispatch(hideModal("EditProfile"))}
        width="430px"
        title="Edit Profile"
      >
        {/* Login Form ====================================================================================*/}
        <div className="w-full  py-6">
          <form className="">
            <div className="max-h-[55vh] overflow-y-auto flex flex-col gap-4 px-7">
              {/* Profile Pic ================ */}
              <div className="flex justify-center items-center w-full py-3.5">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />

                <div
                  className="relative w-28 h-28 cursor-pointer"
                  onClick={handleImageClick}
                >
                  <Image
                    src={imagePreviewUrl}
                    alt="User"
                    className="w-full h-full object-cover rounded-full p-1 border border-main-green"
                    height={120}
                    width={120}
                  />

                  <div className="absolute bottom-0 right-0 bg-main-green p-1 rounded-full border-4 border-primary z-10">
                    <FaPlus className="text-primary text-xs" />
                  </div>
                </div>
              </div>

              {/* Username =================== */}
              <div className="flex flex-col gap-0.5">
                <label className="text-dark text-sm font-medium">
                  User Name
                </label>

                <div className="relative">
                  {/* Left Icon */}
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full flex items-center justify-center background-opacityGradient">
                    <Image
                      src="/signup/username.png"
                      alt="User"
                      width={20}
                      height={20}
                    />
                  </div>

                  {/* Right Verified Icon */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Image
                      src="/profile/verified.png" // Replace with your actual verified icon path
                      alt="Verified"
                      width={23}
                      height={23}
                    />
                  </div>

                  {/* Input (disabled) */}
                  <input
                    type="text"
                    className="border border-border-color background-opacityGradient rounded-lg w-full py-3.5 my-1 pl-16 pr-10 placeholder:text-gray text-xs bg-white focus:outline-none focus:ring-1 focus:ring-main-green  cursor-not-allowed"
                    placeholder="Enter Username"
                    value={formData.user_name}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    disabled
                  />
                </div>
              </div>

              {/* First Name ================== */}
              <div className="flex flex-col gap-0.5">
                <label className="text-dark text-sm font-">First Name</label>
                <div className="relative">
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full flex items-center justify-center background-opacityGradient">
                    <Image
                      src="/signup/name.png"
                      alt="User"
                      width={20}
                      height={20}
                    />
                    {/* <CiUser className='w-5 h-5 text-custom' /> */}
                  </div>
                  <input
                    type="text"
                    className="border border-border-color rounded-lg w-full py-3.5 my-1 pl-16 text-xs placeholder:text-gray bg-white focus:outline-none focus:ring-1 focus:ring-main-green"
                    placeholder="Enter First Name"
                    value={formData.first_name}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Last Name ================== */}
              <div className="flex flex-col gap-0.5">
                <label className="text-dark text-sm font-">Last Name</label>
                <div className="relative">
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full flex items-center justify-center background-opacityGradient">
                    <Image
                      src="/signup/name.png"
                      alt="User"
                      height={20}
                      width={20}
                    />
                    {/* <CiUser className='w-5 h-5 text-custom' /> */}
                  </div>
                  <input
                    type="text"
                    className="border border-border-color rounded-lg w-full py-3.5 my-1 pl-16 text-xs placeholder:text-gray bg-white focus:outline-none focus:ring-1 focus:ring-main-green"
                    placeholder="Enter Last Name"
                    value={formData.last_name}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Phone number ===================== */}
              <div className="flex flex-col gap-0.5">
                <label className="text-dark text-sm font-medium">
                  Mobile Number
                </label>
                <div className="relative">
                  {/* Phone Input */}
                  <PhoneInput
                    containerClass={`pr-10 py-1.5 border border-border-color rounded-lg w-full text-xs placeholder:text-gray focus:outline-none focus:ring-1 focus:ring-main-green ${
                      userData?.data.login_type === "phone"
                        ? "cursor-not-allowed background-opacityGradient"
                        : ""
                    }`}
                    inputClass=""
                    inputStyle={{
                      background: "transparent", // remove white bg from the number area
                      border: "none",
                      width: "100%",
                    }}
                    buttonStyle={{
                      background: "transparent", // remove white bg from country code button
                      border: "none",
                    }}
                    placeholder="Mobile Number"
                    value={formData.country_code + formData.mobile}
                    onChange={(value, data: CountryData) => {
                      if (userData?.data.login_type !== "phone") {
                        setFormData({
                          ...formData,
                          mobile: value.slice(data.dialCode.length),
                          country_code: `+${data.dialCode}`,
                        });
                      }
                    }}
                    country={"us"}
                    enableSearch
                    disabled={userData?.data.login_type === "phone"}
                  />

                  {/* Right Icon (Verified) */}
                  {userData?.data.login_type === "phone" && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Image
                        src="/profile/verified.png"
                        alt="Verified"
                        width={22}
                        height={22}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-0.5">
                <label className="text-dark text-sm font-medium">Email</label>
                <div className="relative">
                  {/* Left Icon */}
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full flex items-center justify-center background-opacityGradient">
                    <Image
                      src="/signup/email.png"
                      alt="Email"
                      width={20}
                      height={20}
                    />
                  </div>

                  {/* Verified Icon on Right */}
                  {userData?.data.login_type === "email" && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Image
                        src="/profile/verified.png"
                        alt="Verified"
                        height={22}
                        width={22}
                      />
                    </div>
                  )}

                  <input
                    type="email"
                    className={`border border-border-color rounded-lg w-full py-3.5 my-1 pl-16 pr-10 text-xs placeholder:text-gray focus:outline-none focus:ring-1 focus:ring-main-green ${
                      userData?.data.login_type === "email"
                        ? "cursor-not-allowed background-opacityGradient"
                        : ""
                    }`}
                    placeholder="Enter Email"
                    value={formData.email}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    onChange={(e) => {
                      if (userData?.data.login_type !== "email") {
                        setFormData({ ...formData, email: e.target.value });
                      }
                    }}
                    disabled={userData?.data.login_type === "email"}
                  />
                </div>
              </div>

              {/* Bio ========================== */}
              <div className="flex flex-col gap-0.5">
                <label className="">Bio</label>
                <div className="relative">
                  {/* Icon inside the textarea container */}
                  <div className="absolute left-2 background-opacityGradient p-2 rounded-full top-2 flex items-center justify-center z-10">
                    <Image
                      src="/signup/bio.png"
                      alt="User"
                      width={22}
                      height={22}
                    />
                  </div>

                  {/* Textarea with left padding to avoid overlap with icon */}
                  <textarea
                    rows={5}
                    className="w-full border border-gray-300 rounded-md pl-16 pr-2 pt-4 pb-2 bg-white focus:outline-none focus:ring-1 focus:ring-main-green text-xs font-gilroy_regular placeholder:text-gray-400"
                    placeholder="Enter Bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="my-5 mx-5">
              <button
                type="button"
                className="bg-main-green text-primary rounded-xl w-full py-3 font-normal text-sm cursor-pointer"
                onClick={() => {
                  handleGetUserDetails();
                }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </CustomDialog>
    </>
  );
}
