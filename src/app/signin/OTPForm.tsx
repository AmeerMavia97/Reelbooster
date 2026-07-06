"use client";

import React, { useRef, useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import useApiPost from "../hooks/postData";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { clearUserInfo } from "../store/Slice/PhoneEmailSlice";
import { toast } from "react-toastify";
import { VerifyOtpRes } from "../types/ResTypes";
import { hideModal, showModal } from "../store/Slice/ModalsSlice";
import Cookies from "js-cookie";
import { Dialog } from "@mui/material";

function OtpForm() {
  // ------------------------ STATE ------------------------
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const dispatch = useAppDispatch();
  const { postData, loading } = useApiPost();

  // ------------------------ REDUX SELECTORS ------------------------
  const phoneNumber = useAppSelector((state) => state.user.phone);
  const email = useAppSelector((state) => state.user.email);
  const countryName = useAppSelector((state) => state.user.country);
  const countryShort = useAppSelector((state) => state.user.country_short_name);
  const countryCode = useAppSelector((state) => state.user.country_code);
  const open = useAppSelector((state) => state.modals.OTP);

  // ------------------------ CONSTANTS ------------------------
  const IS_DEMO = process.env.NEXT_PUBLIC_IS_DEMO === "true";
  const loginType = phoneNumber ? "phone" : "email";

  // ------------------------ FUNCTIONS ------------------------
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const saveUserCookies = (token: string, userId: number) => {
    Cookies.set("Reelboost_auth_token", token, { expires: 30 });
    Cookies.set("Reelboost_user_id", String(userId), { expires: 30 });
  };

  const handleCheckOTP = async () => {
    const otpCode = otp.join("");

    if (!/^\d{4}$/.test(otpCode)) {
      toast.error("Please enter a valid 4-digit OTP.");
      return;
    }

    const bodyData = phoneNumber
      ? { otp: otpCode, login_type: loginType, mobile_num: phoneNumber, country_code: countryCode }
      : { otp: otpCode, login_type: loginType, email, platform: "website" };

    try {
      const res: VerifyOtpRes = await postData("/users/verfyOtp", bodyData);

      if (!res.status) {
        toast.error(res.message || "Invalid OTP. Try again.");
        return;
      }

      const user = res.data.user;
      saveUserCookies(res.data.token, user.user_id);

      if (!user.user_name) {
        Cookies.set("FreeCoinPopup", "true");
        dispatch(showModal("Signup"));
        dispatch(showModal("FreeCoin"));
      } else {
        toast.success("Signed in successfully!");
        window.location.replace("/");
        dispatch(showModal("Profile"));
      }

      dispatch(clearUserInfo());
      dispatch(hideModal("OTP"));
    } catch {
      toast.error("Verification failed. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    if (timeLeft > 0) return;

    const bodyData = phoneNumber
      ? {
          login_type: "phone",
          country: countryName,
          country_short_name: countryShort.toUpperCase(),
          country_code: countryCode,
          mobile_num: phoneNumber,
          platform: "website",
        }
      : { login_type: "email", email, platform: "website" };

    try {
      const res = await postData("/users/signup", bodyData);
      if (!res.status) toast.error(res.message || "Something went wrong.");

      setTimeLeft(120);
      toast.success("OTP resent successfully!");
    } catch {
      toast.error("Error sending OTP.");
    }
  };

  const formatTime = (t: number) =>
    `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;

  // ------------------------ AUTO VERIFY ------------------------
  useEffect(() => {
    if (otp.every((d) => d.trim().length === 1)) handleCheckOTP();
  }, [otp]);

  // ------------------------ TIMER ------------------------
  useEffect(() => {
    if (timeLeft === 0) return;

    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  // ------------------------ RENDER ------------------------
  return (
    <Dialog
      open={open}
      onClose={() => {
        dispatch(hideModal("OTP"));
        dispatch(clearUserInfo());
      }}
      fullWidth
      PaperProps={{
        sx: {
          p: 0,
          borderRadius: 3,
          maxHeight: "90vh",
          width: "420px",
          overflow: "hidden",
        },
      }}
      BackdropProps={{ sx: { background: "#000000BD" } }}
    >
      <div className="relative py-14">
        {/* Close Button */}
        <button
          onClick={() => {
            dispatch(hideModal("OTP"));
            dispatch(clearUserInfo());
          }}
          className="absolute top-2 right-2 text-dark hover:text-gray-800 p-2"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-center font-poppins text-dark font-medium">
          {phoneNumber
            ? "Enter OTP sent to your registered number"
            : "Enter OTP sent to your registered email"}
        </h2>

        <p className="text-xs text-center text-gray mt-2">
          {"4-digit OTP has been sent to "}{phoneNumber || email}
        </p>

        {/* Demo OTP */}
        {IS_DEMO && (
          <div className="bg-main-green text-black text-center  mx-auto  w-[80%] rounded-lg p-3 mt-6">
            <p className="text-sm">Demo Mode – Use this OTP</p>
            <p className="font-bold text-lg mt-1">1234</p>
          </div>
        )}

        {/* OTP Inputs */}
        <div className="flex gap-4 justify-center mt-6">
          {otp.map((val, i) => (
            <input
              key={i}
              ref={(el) => el && (inputRefs.current[i] = el)}
              type="text"
              value={val}
              maxLength={1}
              disabled={loading}
              className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg focus:ring-main-green focus:ring-1"
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleBackspace(i, e)}
            />
          ))}
        </div>

        {/* Resend */}
        <p className="text-main-green text-sm text-center mt-4 cursor-pointer" onClick={handleResendOTP}>
          Resend OTP {timeLeft > 0 && <span className="ml-1">in {formatTime(timeLeft)}</span>}
        </p>

        {/* Sign In Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleCheckOTP}
            disabled={loading}
            className="w-[70%] bg-main-green py-2 rounded-xl text-primary text-sm font-poppins"
          >
            {loading ? <ClipLoader color="#fff" size={15} /> : "Sign In"}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default OtpForm;
