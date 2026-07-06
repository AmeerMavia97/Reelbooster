"use client";
import React, { useEffect, useState } from "react";
import IconInput from "../../components/SignupField";
import { useUserProfile } from "@/app/store/api/updateUser";
import Cookies from "js-cookie";
import useApiPost from "@/app/hooks/postData";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/app/utils/hooks";
import { setScreen } from "@/app/store/Slice/BankScreenSlice";

type AddBankDetailsProps = {
  onSubmitSuccess: () => void; // 👈 parent callback
};
function AddBankDetails({ onSubmitSuccess }: AddBankDetailsProps) {
  const token = Cookies.get("Reelboost_auth_token");
  const dispatch = useAppDispatch();

  // Fetch user profile
  const { data, isLoading } = useUserProfile(token ?? "");
  const userBankDetails = data?.data;
  const { postData } = useApiPost();

  // Local state for form
  const [formData, setFormData] = useState({
    account_name: "",
    bank_name: "",
    account_number: "",
    IFSC_code: "",
    swift_code: "",
  });

  // Populate form when API data arrives
  useEffect(() => {
    if (userBankDetails) {
      setFormData({
        account_name: userBankDetails.account_name || "",
        bank_name: userBankDetails.bank_name || "",
        account_number: userBankDetails.account_number || "",
        IFSC_code: userBankDetails.IFSC_code || "",
        swift_code: userBankDetails.swift_code || "",
      });
    }
  }, [userBankDetails]);

  // Handle input change
  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Submit handler (no mutation, just API call)
  const handleSubmit = async () => {
    try {
      const res = await postData("/users/updateUser", {
        token,
        ...formData,
      });

      if (res?.status) {
        toast.success(res.message);
        dispatch(setScreen("edit"))
        onSubmitSuccess();
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex relative flex-col gap-1 space-y-4 py-6">
      {/* Account Holder Name */}
      <div className="flex flex-col gap-2 relative">
        <label className="text-dark font-medium text-[13px]">
          Account Holder Name
        </label>
        <IconInput
          iconSrc="/signup/name.png"
          placeholder="Account Holder Name"
          value={formData.account_name}
          onChange={(e) => handleChange("account_name", e.target.value)}
        />
      </div>

      {/* Bank Name */}
      <div className="flex flex-col gap-2 relative">
        <label className="text-dark font-medium text-[13px]">Bank Name</label>
        <IconInput
          iconSrc="/Setting/bankDetails.png"
          placeholder="Bank Name"
          value={formData.bank_name}
          onChange={(e) => handleChange("bank_name", e.target.value)}
        />
      </div>

      {/* Account Number */}
      <div className="flex flex-col gap-2 relative">
        <label className="text-dark font-medium text-[13px]">
          Account Number
        </label>
        <IconInput
          iconSrc="/Setting/AccountNumber.png"
          placeholder="Account Number"
          value={formData.account_number}
          onChange={(e) => handleChange("account_number", e.target.value)}
        />
      </div>

      {/* IFSC Code / Routing */}
      <div className="flex flex-col gap-2 relative">
        <label className="text-dark font-medium text-[13px]">
          IFSC Code / Routing Number
        </label>
        <IconInput
          iconSrc="/signup/email.png"
          placeholder="IFSC Code / Routing Number"
          value={formData.IFSC_code}
          onChange={(e) => handleChange("IFSC_code", e.target.value)}
        />
      </div>

      {/* Swift/BIC Code */}
      <div className="flex flex-col gap-2 relative">
        <label className="text-dark font-medium text-[13px]">
          Swift/BIC Code
        </label>
        <IconInput
          iconSrc="/Setting/Swift.png"
          placeholder="Swift/BIC Code"
          value={formData.swift_code}
          onChange={(e) => handleChange("swift_code", e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <button
        className="bg-main-green w-3/5 mx-auto p-3 rounded-xl mt-8 text-primary cursor-pointer"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}

export default AddBankDetails;
