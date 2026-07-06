"use client";
import React, { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { useAppSelector } from "../utils/hooks";
import { useAppDispatch } from "../utils/hooks";
import { hideModal } from "../store/Slice/ModalsSlice";
import PhoneSignin from "./PhoneSignin";
import EmailSignin from "./EmailSignin";
import SocialLogin from "./SocialLogin";
import { ProjectConfigRes } from "../types/ResTypes";
import {
  clearUserInfo,
  setUserEmail,
  setUserPhone,
} from "../store/Slice/PhoneEmailSlice";

function Signin() {
  const [selectedOption, setSelectedOption] = useState("Email");
  const [phoneEnabled, setPhoneEnabled] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.modals.Signin);
  const IS_DEMO = process.env.NEXT_PUBLIC_IS_DEMO === "true";

  useEffect(() => {
    const fetchAuthConfig = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/project_conf`);
        const data: ProjectConfigRes = await res.json();
        const phoneAuth = !!data?.data?.phone_authentication;
        setPhoneEnabled(phoneAuth);
        setSelectedOption(phoneAuth ? "Phone" : "Email");
      } catch {
        setPhoneEnabled(false);
        setSelectedOption("Email");
      }
    };
    fetchAuthConfig();
  }, []);
  // Demo data
  const demoEmail = "dummy3@dummy.com";
  const demoEmailOTP = "1234";
  const demoPhone = {
    phone: "1234567890",
    country_code: "+1",
    country_short_name: "US",
    country: "United States",
  };
  const demoPhoneOTP = "1234";

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          dispatch(hideModal("Signin"));
          dispatch(clearUserInfo());
        }}
        fullWidth
        PaperProps={{
          sx: {
            p: 0,
            overflow: "visible",
            borderRadius: 3,
            maxHeight: "90vh",
            width: "420px",
            maxWidth: "100%",
          },
        }}
        BackdropProps={{ sx: { background: "#000000BD" } }}
      >
        <div className="bg-primary rounded-xl">
          <button
            onClick={() => {
              dispatch(hideModal("Signin"));
              dispatch(clearUserInfo());
            }}
            className="absolute top-2 right-2 text-dark p-2 hover:text-gray-800 transition cursor-pointer"
          >
            ✕
          </button>
          <>
            <div
              style={{ boxShadow: "9.3px 10.46px 64.96px 0px #00000026" }}
              className="py-8 rounded-xl"
            >
              {/* Title */}
              <h3 className="pb-4 text-[20px] font-medium text-dark text-center">
               {authMode === "login" ? "Login to your account" : "Sign up for an account"}
              </h3>

              {/* Login / Sign Up Toggle */}
              <div
                className="flex justify-around items-center border border-main-green/[0.1] mx-6 rounded-full p-3 mb-4"
                style={{ boxShadow: "1px 1px 6.7px 0px #00000008" }}
              >
                <button
                  className={`cursor-pointer text-[16px] font-medium ${authMode === "login" ? "text-main-green" : "text-gray"
                    }`}
                  onClick={() => setAuthMode("login")}
                >
                  Login
                </button>

                <div
                  className="w-0.5 h-4"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(35, 156, 87, 0.12), rgba(1, 159, 200, 0.12))",
                  }}
                ></div>

                <button
                  className={`cursor-pointer text-[16px] font-medium ${authMode === "signup" ? "text-main-green" : "text-gray"
                    }`}
                  onClick={() => setAuthMode("signup")}
                >
                  Sign Up
                </button>
              </div>

              {phoneEnabled && (
                <div
                  className="flex justify-around items-center border border-main-green/[0.1] mx-6 rounded-full p-3"
                  style={{ boxShadow: "1px 1px 6.7px 0px #00000008" }}
                >
                  <button
                    className={`cursor-pointer text-[16px] font-medium ${selectedOption === "Phone" ? "text-main-green" : "text-gray"
                      }`}
                    onClick={() => setSelectedOption("Phone")}
                  >
                    Phone
                  </button>

                  <div
                    className="w-0.5 h-4"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(35, 156, 87, 0.12), rgba(1, 159, 200, 0.12))",
                    }}
                  ></div>

                  <button
                    className={`cursor-pointer text-[16px] font-medium ${selectedOption === "Email" ? "text-main-green" : "text-gray"
                      }`}
                    onClick={() => setSelectedOption("Email")}
                  >
                    Email
                  </button>
                </div>
              )}

              <div className=" pt-8 px-10">
                {selectedOption === "Phone" && <PhoneSignin />}
                {selectedOption === "Email" && <EmailSignin authMode={authMode} />}
              </div>


              <div className="flex items-center justify-center py-4 px-10 w-full">
                <div className="flex-grow border-t border-main-green"></div>
                <h1 className="mx-4 text-sm font-poppins text-dark font-base">
                  OR
                </h1>
                <div className="flex-grow border-t border-main-green"></div>
              </div>
              {/* Social Login ============================= */}
              <SocialLogin />

              {/* demo details ==================================== */}

              {IS_DEMO && (
                <div className="flex justify-center mt-6">
                  <div className=" rounded-lg bg-main-green/[0.1] border border-main-green/[0.2] shadow-md w-full max-w-md mx-9">
                    <h2 className="text-dark font-poppins font-semibold p-2">
                      For Demo
                    </h2>
                    <hr className="border-gray-200 mb-2" />

                    {selectedOption === "Email" ? (
                      <div
                        className="flex flex-col gap-2 p-2 cursor-pointer transition"
                        onClick={() => dispatch(setUserEmail(demoEmail))}
                      >
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-poppins">
                            Email: {demoEmail}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(demoEmail);
                              dispatch(setUserEmail(demoEmail));
                            }}
                            className="cursor-pointer"
                          >
                            <img src="/signup/copy.png" className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-sm font-poppins">
                          OTP: {demoEmailOTP}
                        </p>
                      </div>
                    ) : (
                      <div
                        className="flex flex-col gap-2 cursor-pointer p-2 transition"
                        onClick={() => dispatch(setUserPhone(demoPhone))}
                      >
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-poppins">
                            Mobile: {demoPhone.country_code}-{demoPhone.phone}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const fullNumber = `${demoPhone.country_code}${demoPhone.phone}`;
                              copyToClipboard(fullNumber);
                              dispatch(setUserPhone(demoPhone));
                            }}
                            className="cursor-pointer"
                          >
                            <img src="/signup/copy.png" className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-sm font-poppins">
                          OTP: {demoPhoneOTP}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        </div>
      </Dialog>
    </>
  );
}

export default Signin;
