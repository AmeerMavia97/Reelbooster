"use client";
import React, { useEffect, useState, useMemo } from "react";
import { hideModal, showModal } from "../store/Slice/ModalsSlice";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import useApiPost from "../hooks/postData";
import { toast } from "react-toastify";
import { setUserEmail } from "../store/Slice/PhoneEmailSlice";
import { ClipLoader } from "react-spinners";
import { SignUpRes } from "../types/ResTypes";
import Image from "next/image";
import validator from "validator";
import Cookies from "js-cookie";

function EmailSignin({ authMode }: { authMode: "login" | "signup" }) {
  const dispatch = useAppDispatch();
  const { postData, loading } = useApiPost();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const demoEmail = useAppSelector((state) => state.user.email);

  // -----------------------------------
  // VALID EMAIL USING USEMEMO (optimal)
  // -----------------------------------
  const isValidEmail = useMemo(() => {
    if (!email) return false;
    return validator.isEmail(email.trim());
  }, [email]);

  // -----------------------------------
  // HANDLE SIGNIN
  // -----------------------------------
  const handleSignin = async () => {
    if (!isValidEmail) return toast.error("Invalid email format.");
    if (!password) return toast.error("Please enter your password.");

    try {
      const response: SignUpRes = await postData("/users/signup", {
        login_type: "email",
        email: email.trim(),
        password,
        platform: "website",
        auth_action: authMode,
      });

      if (response?.status) {
        const { token, user, newUser } = response.data;
        Cookies.set("Reelboost_auth_token", token, { expires: 30 });
        Cookies.set("Reelboost_user_id", String(user.user_id), { expires: 30 });
        dispatch(setUserEmail(email.trim()));
        dispatch(hideModal("Signin"));

        if (newUser || !user.user_name) {
          Cookies.set("FreeCoinPopup", "true");
          dispatch(showModal("Signup"));
          dispatch(showModal("FreeCoin"));
        } else {
          toast.success("Signed in successfully!");
          window.location.replace("/");
        }
      } else {
        toast.error(response?.message || "Something went wrong.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error signing in");
    }
  };

  // Load saved email (if exists)
  useEffect(() => {
    if (demoEmail) setEmail(demoEmail);
  }, [demoEmail]);

  return (
    <>
      {/* Email Input */}
      <div className="flex flex-col gap-1">
        <label className="text-dark text-sm">
          Email<span className="text-red">*</span>
        </label>

        <div className="relative">
          {/* Email Icon */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full">
            <Image
              src="/signup/email.png"
              alt="Email"
              width={20}
              height={20}
            />
          </div>

          {/* Email Input */}
          <input
            type="text"
            className="border border-border-color rounded-lg text-dark w-full py-4 pl-16 text-xs placeholder:text-gray bg-white focus:outline-none focus:ring-1 focus:ring-main-green"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            spellCheck="false"
            onKeyDown={(e) => {
              if (e.key === "Enter" && isValidEmail) {
                e.preventDefault();
                handleSignin();
              }
            }}
          />
        </div>

        {/* Invalid Email Warning */}
        {email && !isValidEmail && (
          <div className="flex gap-1 items-center mt-1">
            <Image
              src="/signup/notValid.png"
              alt="invalid"
              height={12}
              width={12}
            />
            <p className="text-xs text-red">Not valid email format</p>
          </div>
        )}
      </div>

      {/* Password Input */}
      <div className="flex flex-col gap-1 mt-4">
        <label className="text-dark text-sm">
          Password<span className="text-red">*</span>
        </label>

        <div className="relative">
          <input
            type="password"
            className="border border-border-color rounded-lg text-dark w-full py-4 px-4 text-xs placeholder:text-gray bg-white focus:outline-none focus:ring-1 focus:ring-main-green"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            spellCheck="false"
            onKeyDown={(e) => {
              if (e.key === "Enter" && isValidEmail && password) {
                e.preventDefault();
                handleSignin();
              }
            }}
          />
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center mt-8">
        <button
          disabled={!isValidEmail || !password}
          onClick={handleSignin}
          className={`w-[70%] rounded-xl p-2.5 text-primary text-sm transition-all
            ${
              isValidEmail && password
                ? "bg-main-green cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }
          `}
        >
          {loading ? (
            <ClipLoader loading={loading} color="#FFFFFF" size={15} />
          ) : authMode === "login" ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </button>
      </div>
    </>
  );
}

export default EmailSignin;
