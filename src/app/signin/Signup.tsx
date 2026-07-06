"use client";
import { Dialog } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import "react-phone-input-2/lib/high-res.css";
import PhoneInput from "react-phone-input-2";
import { hideModal, showModal } from "../store/Slice/ModalsSlice";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import IconInput from "../components/SignupField";
import { FindUserRes, UpdateUserRes } from "../types/ResTypes";
import useApiPost from "../hooks/postData";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import validator from "validator";

export default function Signup() {
  const dispatch = useAppDispatch();
  const [isChecked, setIsChecked] = useState(false);
  // const open = useAppSelector((state) => state.modals.Signup);
  const email = useAppSelector((state) => state.user.email);
  const country = useAppSelector((state) => state.user.country);
  const countryCode = useAppSelector((state) => state.user.country_code);
  const phone = useAppSelector((state) => state.user.phone);
  const { postData, loading } = useApiPost();

  

  // Initial form data
  const [formData, setFormData] = useState({
    user_name: "",
    first_name: "",
    last_name: "",
    full_name: "",
    email: email || "",
    mobile_num: countryCode && phone ? `+${countryCode}${phone}` : "", // formatted
    country: country || "",
    profile_pic: "",
    bio: "",
  });


// ✅ Validate signup fields
const validateSignup = () => {
  const { user_name, email, mobile_num } = formData;

  // Username
  if (!user_name || !validator.matches(user_name, /^[a-zA-Z0-9_.-]+$/)) {
    toast.error(
      "Username can only contain letters, numbers, underscores (_), hyphens (-), and dots (.)"
    );
    return false;
  }

  // Email
  if (!email || !validator.isEmail(email)) {
    toast.error("Please enter a valid email address.");
    return false;
  }


  // Mobile number is optional (not all users sign up via phone/OTP)
  if (mobile_num) {
    const phoneWithoutPlus = mobile_num.startsWith("+") ? mobile_num.slice(1) : mobile_num;

    if (!validator.isMobilePhone(phoneWithoutPlus, undefined, { strictMode: false })) {
      toast.error("Invalid mobile number.");
      return false;
    }
  }

  return true;
};



  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      email: email || "",
      mobile_num: countryCode && phone ? `+${countryCode}${phone}` : "",
    }));
  }, [email, phone, countryCode]);

  // ✅ Update full_name whenever first_name or last_name changes
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const first_name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      first_name,
      full_name: `${first_name} ${prev.last_name}`.trim(),
    }));
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const last_name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      last_name,
      full_name: `${prev.first_name} ${last_name}`.trim(),
    }));
  };

  // ✅ Updated checkUsernameAvailability with token in headers
  const checkUsernameAvailability = async (user_name: string) => {
    if (!user_name) {
      setUsernameVerified(false);
      return;
    }
    try {
      const response: FindUserRes = await postData("/users/find-user", {
        user_name,
        user_check: true,
      });

      if (response.status === true) {
        setUsernameVerified(true);
      } else {
        setUsernameVerified(false);
      }
    } catch (error) {
      setUsernameVerified(false);
    }
  };
  // ✅ Updated handleSignup to include token
  const handleSignup = async () => {
    if(!validateSignup()) return;

    try {
      const response: UpdateUserRes = await postData("/users/updateUser", {
        user_name: formData.user_name,
        first_name: formData.first_name,
        last_name: formData.last_name,
        mobile_num: phone,
        country: country,
        bio: formData.bio,
        email: formData.email,
      });

      if (response.status === false) {
        toast.error(response.message);
      } else {
        toast.success("Signed up successfully!");
        dispatch(hideModal("Signup"));
        dispatch(showModal("Avtar"));
      }
    } catch (error) {
      toast.error("Signup failed. Please try again.");
    }
  };

  const [usernameVerified, setUsernameVerified] = useState(false);
  const open = useAppSelector((state) => state.modals.Signup);
 

  return (
    <>
      <Dialog
        open={open}
        onClose={() => dispatch(hideModal("Signup"))}
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
      >
        {/* Login Form ====================================================================================*/}

        <>
          <div
            className=" rounded-xl py-5 px-5"
            style={{ boxShadow: "9.3px 10.46px 64.96px 0px #00000026" }}
          >
            {/* Close Button */}

            {/* Title */}

            <h3 className=" pb-6 text-[20px] font-medium text-dark text-center">
              Signup
            </h3>
            <form className="">
              <div className="max-h-[55vh] overflow-y-auto flex flex-col gap-4 px-4">
                {/* Username =================== */}
                <div className="flex flex-col gap-0.5 relative">
                  <label className="text-dark text-[13px]">
                    User Name<span className="text-red">*</span>
                  </label>

                  <IconInput
                    iconSrc="/signup/username.png"
                    placeholder="Enter Username"
                    value={formData.user_name}
                    onChange={(e) => {
                      const user_name = e.target.value;
                      setFormData({ ...formData, user_name });
                      checkUsernameAvailability(user_name);
                    }}
                  />

                  {usernameVerified === true && (
                    <Image
                      src="/profile/verified.png"
                      className="absolute top-1/2 -translate-y-1/2 right-2 w-5 h-5 mt-2"
                      alt="verified"
                      height={23}
                      width={23}
                    />
                  )}

                  {formData.user_name && usernameVerified === false && (
                    <p className="text-xs text-red mt-1">
                      Username already taken
                    </p>
                  )}
                </div>

                {/* First Name ================== */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-dark text-[13px]">
                    First Name<span className="text-red">*</span>
                  </label>
                  <IconInput
                    iconSrc="/signup/name.png"
                    placeholder="Enter First Name"
                    value={formData.first_name}
                    onChange={handleFirstNameChange}
                  />
                </div>

                {/* Last Name ========================= */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-dark text-[13px]">
                    Last Name<span className="text-red">*</span>
                  </label>
                  <IconInput
                    iconSrc="/signup/name.png"
                    placeholder="Enter Last Name"
                    value={formData.last_name}
                    onChange={handleLastNameChange}
                  />
                </div>

                {/* Phone number ===================== */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-dark text-[13px] font-">
                    Mobile Number
                  </label>

                  <div className="relative">
                    <PhoneInput
                      country={"in"}
                      enableSearch
                      value={formData.mobile_num}
                      onChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          mobile_num: value, // value is like "+919876543210"
                        }));
                      }}
                      inputClass="border border-border-color rounded-lg w-full p-2 py-1.5 placeholder:text-xs text-dark placeholder:text-gray bg-white focus:outline-none focus:ring-1 focus:ring-main-green"
                      buttonClass="!bg-transparent"
                      containerClass="relative"
                    />

                    {/* Verified Icon */}
                    {phone && (
                      <Image
                        src="/profile/verified.png"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                        alt="Verified"
                        height={23}
                        width={23}
                      />
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-0.5 relative">
                  <label className="text-dark text-[13px] font-">
                    Email<span className="text-red">*</span>
                  </label>
                  <IconInput
                    iconSrc="/signup/email.png"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={(e) => {
                      const email = e.target.value;
                      setFormData({ ...formData, email });
                    }}
                  />

                  {email && (
                    <Image
                      src="/profile/verified.png"
                      className="absolute right-4 top-8 w-5 h-5"
                      alt="Verified"
                      width={23}
                      height={23}
                    />
                  )}
                </div>

                {/* Bio ========================== */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-dark text-[13px]">Bio</label>
                  <div className="relative">
                    {/* Icon inside the textarea container */}
                    <div className="absolute left-3 background-opacityGradient p-2 rounded-full top-2 flex items-center justify-center z-10">
                      <Image
                        src="/signup/bio.png"
                        alt="User"
                        className="opacity-70"
                        width={20}
                        height={20}
                      />
                    </div>

                    <textarea
                      rows={6}
                      value={formData.bio}
                      className="w-full border border-gray-300 text-xs rounded-md pl-16 text-dark pr-2 pt-4 pb-2 bg-white focus:outline-none focus:ring-1 focus:ring-main-green placeholder:text-xs font-gilroy_regular placeholder:text-gray-400"
                      placeholder="Enter Bio"
                      onChange={(e) => {
                        const bio = e.target.value;
                        setFormData({ ...formData, bio });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="my-5">
                <div className="flex gap-1 px-2 py-4 cursor-pointer justify-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                  <p className="text-dark text-sm text-center">
                    I agree to the{" "}
                    <span className="text-main-green cursor-pointer hover:underline">
                      Terms of Services
                    </span>{" "}
                    &{" "}
                    <span className="text-main-green hover:underline cursor-pointer">
                      Privacy Policy
                    </span>
                  </p>
                </div>

                <div className="flex justify-center place-items-center">
                  <button
                    type="button"
                    className="bg-main-green text-primary rounded-xl w-[55%] py-2.5 font-normal text-sm cursor-pointer"
                    onClick={() => {
                      if (!isChecked) {
                        toast.error(
                          "Please agree to Terms & Privacy Policy to continue"
                        );
                        return;
                      }
                      handleSignup();
                    }}
                  >
                    {loading ? (
                      <>
                        <ClipLoader
                          color="#FFFFFF"
                          size={15}
                          loading={loading}
                        />
                      </>
                    ) : (
                      <>Next</>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* <div className="w-full text-center text-sm text-dark">
          Already a member?{" "}
          <span
            className="text-main-green hover:underline cursor-pointer"
            onClick={() => {
              dispatch(showModal("Signin"));
              dispatch(hideModal("Signup"));
            }}
          >
            Signin
          </span>
        </div> */}
          </div>
        </>
      </Dialog>
    </>
  );
}
