"use client";
import React, { useCallback, useEffect, useState } from "react";
import useApiPost from "../hooks/postData";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { GoogleLogin } from "@react-oauth/google";
import { SignUpRes } from "../types/ResTypes";
import { useAppDispatch } from "../utils/hooks";
import { hideModal, showModal } from "../store/Slice/ModalsSlice";

type SocialProvider = "google" | "facebook";


type FacebookAuthResponse = {
  accessToken: string;
};

type FacebookLoginResponse = {
  status: "connected" | "not_authorized" | "unknown";
  authResponse?: FacebookAuthResponse;
};



declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: {
      init: (options: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: FacebookLoginResponse) => void,
        options: { scope: string }
      ) => void;
      // api: (
      //   path: string,
      //   params: Record<string, string>,
      //   callback: (response: FacebookUserResponse) => void
      // ) => void;
    };
  }
}

function SocialLogin() {
  const { postData } = useApiPost();
  const dispatch = useAppDispatch();
  const [facebookReady, setFacebookReady] = useState(false);

  const handleSocialAuth = useCallback(
    async (provider: SocialProvider, token: string) => {
      try {
        const response: SignUpRes = await postData("/users/signup", {
          login_type: "social",
          provider,
          token,
          platform: "website",
          device_token: "",
        });

        if (!response.status) {
          toast.error(response.message);
          return;
        }

        Cookies.set("Reelboost_auth_token", response.data.token, {
          sameSite: "Strict",
          expires: 30,
        });

        Cookies.set("Reelboost_user_id", String(response.data.user.user_id), {
          sameSite: "Strict",
          expires: 30,
        });

        toast.success("Signed in successfully!");

        dispatch(hideModal("Signin"));
        dispatch(hideModal("Signup"));

        window.location.replace("/");

      } catch (err) {
        console.log(err);
        console.log(err?.response?.data);

        toast.error(`${provider} login failed`);
      }
    },
    [dispatch, postData]
  );

  // const googleLogin = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //     try {
  //       const { access_token } = tokenResponse;

  //       const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
  //         headers: {
  //           Authorization: `Bearer ${access_token}`,
  //         },
  //       });

  //       const { email, given_name, family_name } = res.data;

  //       if (!email) {
  //         toast.error("Google account email not found");
  //         return;
  //       }

  //       await handleSocialAuth(
  //         {
  //           email,
  //           first_name: given_name || "",
  //           last_name: family_name || "",
  //         },
  //         "google"
  //       );
  //     } catch (error) {
  //       toast.error("Google login failed");
  //     }
  //   },
  //   onError: () => {
  //     toast.error("Google login failed");
  //   },
  // });

  useEffect(() => {
    const facebookAppId = "1038845251818651";

    if (!facebookAppId || facebookAppId.includes("Facebook")) {
      return;
    }

    if (window.FB) {
      setFacebookReady(true);
      return;
    }

    window.fbAsyncInit = function () {
      window.FB?.init({
        appId: facebookAppId,
        cookie: true,
        xfbml: false,
        version: "v20.0",
      });
      setFacebookReady(true);
    };

    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  const facebookLogin = () => {
    console.log("hello");

    if (!facebookReady || !window.FB) {
      toast.error("Facebook login is not configured");
      return;
    }

    window.FB.login(
      (loginResponse) => {
        console.log(loginResponse);

        if (loginResponse.status !== "connected") {
          toast.error("Facebook login cancelled");
          return;
        }

        handleSocialAuth(
          "facebook",
          loginResponse.authResponse!.accessToken
        ).catch(console.error);
      },
      { scope: "public_profile,email" }
    );
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="mx-10">
          <GoogleLogin
            locale="tr"
            text="signup_with"
            onSuccess={async (credentialResponse) => {
              if (!credentialResponse.credential) {
                toast.error("Google login failed");
                return;
              }

              await handleSocialAuth(
                "google",
                credentialResponse.credential
              );
            }}
            onError={() => toast.error("Google login failed")}
          />
        </div>

        <button
          type="button"
          className="relative border border-main-green rounded-md bg-main-green/[0.04] py-2 mx-10 cursor-pointer text-center"
          onClick={facebookLogin}
        >
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#1877F2] text-white text-sm font-semibold">
            f
          </span>
          <span className="font-medium text-sm text-dark cursor-pointer">
            Facebook ile devam et
          </span>
        </button>
      </div>
    </>
  );
}

export default SocialLogin;
