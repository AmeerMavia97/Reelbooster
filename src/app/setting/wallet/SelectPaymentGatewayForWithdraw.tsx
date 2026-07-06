"use client";
import CustomDialog from "@/app/components/CustomDialog";
import { hideModal } from "@/app/store/Slice/ModalsSlice";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import React, { useEffect, useState } from "react";
import IconInput from "../../components/SignupField";
import Image from "next/image";
import { WithdrawRes } from "@/app/types/Gift";
import useApiPost from "@/app/hooks/postData";
import { toast } from "react-toastify";
import { useUserProfile } from "@/app/store/api/updateUser";
import Cookies from "js-cookie";
import EditBankDetails from "../bank-details/EditBankDetails";
import { setScreen } from "@/app/store/Slice/BankScreenSlice";

function SelectPaymentGatewayForWithdraw() {
  const open = useAppSelector(
    (state) => state.modals.PaymentGatewayForWithdraw
  );
  const dispatch = useAppDispatch();
  const { postData } = useApiPost();
  const token = Cookies.get("Reelboost_auth_token");
  const { data,refetch } = useUserProfile(token ?? "");
  const userBankDetails = data?.data;

  const [selected, setSelected] = useState<string | null>(null);
  const [coins, setCoins] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const currentScreen = useAppSelector(
    (state) => state.bankScreen.activeScreen
  );

  const [formData, setFormData] = useState({
    account_name: "",
    account_number: "",
    swift_code: "",
  });

  useEffect(() => {
    if (userBankDetails) {
      setFormData({
        account_name: userBankDetails.account_name || "",
        account_number: userBankDetails.account_number || "",
        swift_code: userBankDetails.swift_code || "",
      });
    }
  }, [userBankDetails]);
  // Submit handler (no mutation, just API call)
  const handleSubmit = async () => {
  try {
    const res = await postData("/users/updateUser", {
      token,
      ...formData,
    });

    if (res?.status) {
      toast.success(res.message);
      refetch()
      dispatch(setScreen("edit")); // ✅ move here
    } else {
      toast.error(res?.message);
    }
  } catch (error) {
  }
};

  // Handle input change
  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleWithdraw = async () => {
    const coinValue = Number(coins);

    if (!coinValue || coinValue < 10) {
      toast.error("Minimum withdrawal amount is 10 coins");
      return;
    }

    if (!selected) {
      toast.error("Please select a payment method");
      return;
    }

    if ((selected === "paypal" || selected === "stripe") && !email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      const res: WithdrawRes = await postData("/transaction/withdraw", {
        coins: coinValue,
        payment_method: selected,
        transaction_email: selected === "bank" ? "" : email, // ✅ Bank always sends empty email
      });

      if (res.status) {
        toast.success(res.message);
        dispatch(hideModal("PaymentGatewayForWithdraw")); // ✅ Close dialog
        setEmail("");
        setCoins("");
        setSelected(null);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Enter all the details");
    }
  };

  return (
    <CustomDialog
      open={open}
      onClose={() => {
        dispatch(hideModal("PaymentGatewayForWithdraw"));
        setEmail("");
        setCoins("");
        setSelected("");
      }}
      width="420px"
      title="Withdraw"
    >
      <div className="flex flex-col gap-5 p-5 overflow-y-auto sm:overflow-hidden">
        {/* <div className="flex flex-col gap-5 p-5 
                overflow-y-auto sm:overflow-y-visible max-h-[80vh]"> */}

        {/* Enter Coin Input ========================== */}
        <div className="flex flex-col gap-1">
          <label className="text-dark text-[13px]">
            Enter Coin<span className="text-red">*</span>
          </label>
          <IconInput
            iconSrc="/profile/coin.png"
            placeholder="Enter Withdraw Coin"
            type="text"
            value={coins}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCoins(e.target.value)
            }
          />
          {coins && Number(coins) < 10 && (
            <span className="text-red text-xs">
              Minimum Withdrawal Amount is 10
            </span>
          )}
        </div>

        {/* Select Payment Gateway ============================= */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base text-dark font-semibold">
            Select Payment Gateway
          </h2>

          {/* PayPal */}
          <div className="border border-main-green/40 rounded-xl">
            <button
              type="button"
              className="w-full flex items-center justify-between p-3"
              onClick={() =>
                setSelected(selected === "paypal" ? null : "paypal")
              }
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/gift/PaypalLogo.png"
                  alt="paypal"
                  width={24}
                  height={24}
                />
                <span className="text-sm text-dark font-medium">Paypal</span>
              </div>
              <Image
                src="/gift/DownArrow.png"
                alt=""
                width={10}
                height={10}
                className={`${selected === "paypal" ? "rotate-180" : ""}`}
              />
            </button>

            {selected === "paypal" && (
              <div className="px-4 pb-5 pt-2 flex flex-col gap-1">
                <label className="text-xs text-dark pb-2 font-semibold">
                  Paypal Email Address<span className="text-red">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter Your Paypal Email Address"
                  className="border px-3 py-3 text-xs rounded-xl border-gray placeholder:text-xs focus:outline-none focus:ring-1 focus:ring-main-green"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Stripe Pay */}
          <div className="border border-main-green/40 rounded-xl">
            <button
              type="button"
              className="w-full flex items-center justify-between p-3"
              onClick={() =>
                setSelected(selected === "stripe" ? null : "stripe")
              }
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/gift/StripeLogo.png"
                  alt="stripe"
                  width={32}
                  height={32}
                />
                <span className="text-sm text-dark font-medium">Stripe</span>
              </div>
              <Image
                src="/gift/DownArrow.png"
                alt=""
                width={10}
                height={10}
                className={`${selected === "stripe" ? "rotate-180" : ""}`}
              />
            </button>

            {selected === "stripe" && (
              <div className="px-4 pb-5 pt-2 flex flex-col gap-1">
                <label className="text-xs text-dark pb-2 font-semibold">
                  Stripe Email Address<span className="text-red">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter Your Stripe Email Address"
                  className="border px-3 py-3 text-xs rounded-xl border-gray placeholder:text-xs focus:outline-none focus:ring-1 focus:ring-main-green"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Bank Transfer */}
          <div className="border border-main-green/40 rounded-xl">
            <button
              type="button"
              className="w-full flex items-center justify-between p-3"
              onClick={() => setSelected(selected === "bank" ? null : "bank")}
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/gift/BankTransfer.png"
                  alt="bank"
                  width={21}
                  height={22}
                />
                <span className="text-sm text-dark font-medium">
                  Bank Transfer
                </span>
              </div>
              <Image
                src="/gift/DownArrow.png"
                alt=""
                width={10}
                height={10}
                className={`${selected === "bank" ? "rotate-180" : ""}`}
              />
            </button>

            {selected === "bank" && (
              <>
                {userBankDetails?.IFSC_code === "" ||
                userBankDetails?.account_name === "" ||
                userBankDetails?.account_number === "" ||
                userBankDetails?.bank_name === "" ||
                userBankDetails?.swift_code === "" ||
                currentScreen === "add" ? (
                  <>
                    <div className="px-4 pb-5 flex flex-col gap-2 space-y-3">
                      <div className="w-full flex flex-col gap-2">
                        <label className="text-xs text-dark font-semibold">
                          Account Holder’s Name
                          <span className="text-red">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Your Account Holder's Name"
                          className="border px-3 py-3 w-full text-xs rounded-xl border-gray placeholder:text-xs focus:outline-none focus:ring-1 focus:ring-main-green"
                          value={formData.account_name}
                          onChange={(e) =>
                            handleChange("account_name", e.target.value)
                          }
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-dark font-semibold">
                          Account Number<span className="text-red">*</span>
                        </label>

                        <input
                          type="text"
                          placeholder="Enter Your Account Number"
                          className="border px-3 py-3 text-xs rounded-xl border-gray placeholder:text-xs focus:outline-none focus:ring-1 focus:ring-main-green"
                          value={formData.account_number}
                          onChange={(e) =>
                            handleChange("account_number", e.target.value)
                          }
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-dark font-semibold">
                          SWIFT/BIC Code<span className="text-red">*</span>
                        </label>

                        <input
                          type="text"
                          placeholder="Enter Your SWIFT/BIC Code"
                          className="border px-3 py-3 text-xs rounded-xl border-gray placeholder:text-xs focus:outline-none focus:ring-1 focus:ring-main-green"
                          value={formData.swift_code}
                          onChange={(e) =>
                            handleChange("swift_code", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-center pb-4">
                      <button
                        className="bg-main-green text-xs text-primary w-3/10 p-1 rounded-xl cursor-pointer"
                        onClick={() => {
                          handleSubmit();
                          dispatch(setScreen("edit"));
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="px-4 cursor-pointer"
                      onClick={() => setScreen("add")}
                    >
                      <EditBankDetails />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Withdraw Button */}
        <button
          className="w-3/4 mt-4 mx-auto bg-main-green text-primary rounded-xl py-2 font-medium"
          onClick={handleWithdraw}
        >
          Withdraw
        </button>
      </div>
    </CustomDialog>
  );
}

export default SelectPaymentGatewayForWithdraw;
