"use client";

import { useEffect, useState, useMemo } from "react";
import PhoneInput, { CountryData } from "react-phone-input-2";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { hideModal, showModal } from "../store/Slice/ModalsSlice";
import useApiPost from "../hooks/postData";
import { toast } from "react-toastify";
import { setUserPhone } from "../store/Slice/PhoneEmailSlice";
import { ClipLoader } from "react-spinners";
import { SignUpRes } from "../types/ResTypes";

function PhoneSignin() {
  const dispatch = useAppDispatch();
  const { postData, loading } = useApiPost();

  const [phone, setPhone] = useState<string>(""); // digits only
  const [dialCode, setDialCode] = useState<string>("");
  const [countryName, setCountryName] = useState<string>("");
  const [countryShortName, setCountryShortName] = useState<string>("");

  const demoPhone = useAppSelector((state) => state.user);

  // --------------------------------------------
  // ✅ GLOBAL E.164 VALIDATION (BULLETPROOF)
  // --------------------------------------------
  const isValidPhone = useMemo(() => {
    if (!phone) return false;

    // react-phone-input-2 returns digits without "+"
    const e164 = `+${phone}`;

    // E.164 rules: + followed by 7–15 digits, first digit non-zero
    return /^\+[1-9]\d{6,14}$/.test(e164);
  }, [phone]);

  // --------------------------------------------
  // HANDLE SIGN-IN
  // --------------------------------------------
  const handleSignin = async () => {
    if (!isValidPhone) {
      toast.error("Please enter a valid mobile number.");
      return;
    }

    try {
      const response: SignUpRes = await postData("/users/signup", {
        login_type: "phone",
        country: countryName,
        country_short_name: countryShortName.toUpperCase(),
        country_code: `+${dialCode}`,
        mobile_num: phone.slice(dialCode.length),
        platform: "website",
      });

      if (response?.status) {
        dispatch(
          setUserPhone({
            phone: phone.slice(dialCode.length),
            country_code: `+${dialCode}`,
            country_short_name: countryShortName.toUpperCase(),
            country: countryName,
          })
        );

        dispatch(showModal("OTP"));
        dispatch(hideModal("Signin"));
      } else {
        toast.error(response?.message || "Something went wrong.");
      }
    } catch {
      toast.error("Error signing in.");
    }
  };

  // --------------------------------------------
  // PREFILL DEMO / STORED DATA
  // --------------------------------------------
  useEffect(() => {
    if (demoPhone?.phone && demoPhone?.country_code) {
      const dial = demoPhone.country_code.replace("+", "");

      setDialCode(dial);
      setCountryName(demoPhone.country || "");
      setCountryShortName(demoPhone.country_short_name || "");
      setPhone(`${dial}${demoPhone.phone}`);
    }
  }, [demoPhone]);


  return (
    <>
      <div className="flex flex-col gap-1">
        <label className="text-dark text-sm">
          Mobile Number <span className="text-red">*</span>
        </label>

        <PhoneInput
          //@ts-ignore
          className="border border-border-color text-dark rounded-lg w-full p-2 bg-primary focus:ring-1 focus:ring-main-green"
          placeholder="Mobile Number"
          value={phone}
          country={"us"}
          enableSearch
          onChange={(value, data: CountryData) => {
            setPhone(value);
            setDialCode(data.dialCode || "");
            setCountryName(data.name || "");
            setCountryShortName(data.countryCode || "");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isValidPhone) {
              handleSignin();
            }
          }}
        />
      </div>

      {/* Continue Button */}
      <div className="flex justify-center mt-8">
        <button
          disabled={!isValidPhone}
          onClick={handleSignin}
          className={`w-[70%] rounded-xl p-2.5 text-primary text-sm cursor-pointer transition-all 
            ${isValidPhone
              ? "bg-main-green cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          {loading ? (
            <ClipLoader loading={loading} color="#FFFFFF" size={15} />
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </>
  );
}

export default PhoneSignin;
