"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import PaymentWithStripe from "@/app/Gift/PaymentWithStripe";
import GPayPayment from "@/app/Gift/GPayPayment";
import PaymentWithPaypal from "@/app/Gift/PaymentWithPaypal";
import CustomDialogRecharge from "./CustomDialogRecharge";
import { hideModal } from "@/app/store/Slice/ModalsSlice";

function ViewstreamingPayment() {
  const [selected, setSelected] = useState<string>("");
  const [showPayment, setShowPayment] = useState(false);

  const isOpen = useAppSelector(
    (state) => state.modals.ViewstreamingPayment
  );
  const dispatch = useAppDispatch();

  const paymentMethods = [
    { id: "stripe", name: "Stripe", logo: "/gift/StripeLogo.png" },
    { id: "gpay", name: "Google Pay", logo: "/gift/GooglePayLogo.png" },
    { id: "paypal", name: "Paypal", logo: "/gift/PaypalLogo.png" },
  ];

  /** 🔥 RESET STATE WHEN MODAL CLOSES */
  useEffect(() => {
    if (!isOpen) {
      setSelected("");
      setShowPayment(false);
    }
  }, [isOpen]);

  const handlePayNow = () => {
    if (!selected) {
      toast.warn("Please select a payment method first!");
      return;
    }
    setShowPayment(true);
  };

  const handleClose = () => {
    dispatch(hideModal("ViewstreamingPayment"));
  };

  const renderPaymentUI = () => {
    switch (selected) {
      case "stripe":
        return <PaymentWithStripe />;
      case "gpay":
        return <GPayPayment />;
      case "paypal":
        return <PaymentWithPaypal />;
      default:
        return null;
    }
  };

  return (
    <CustomDialogRecharge
      open={isOpen}
      onClose={handleClose}
      title="Payment Methods"
      fullWidth
      maxWidth="sm"
    >
      <div className="flex flex-col gap-6 p-4 py-8">
        {!showPayment ? (
          <>
            {/* Payment methods list */}
            <div className="flex flex-col gap-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelected(method.id)}
                  className={`flex items-center justify-between border rounded-xl px-4 py-3 cursor-pointer transition
                    ${
                      selected === method.id
                        ? "border-main-green bg-main-green/[0.04]"
                        : "border-gray-300"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={method.logo}
                      alt={method.name}
                      height={24}
                      width={24}
                    />
                    <p className="text-dark text-sm font-medium">
                      {method.name}
                    </p>
                  </div>
                  <input
                    type="radio"
                    checked={selected === method.id}
                    onChange={() => setSelected(method.id)}
                    className="w-4 h-4 accent-main-green"
                  />
                </div>
              ))}
            </div>

            {/* Pay Now button */}
            <button
              onClick={handlePayNow}
              className="w-3/4 mx-auto mt-4 rounded-xl  cursor-pointer bg-main-green text-primary py-2"
            >
              Recharge
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-6">
            {renderPaymentUI()}
          </div>
        )}
      </div>
    </CustomDialogRecharge>
  );
}

export default ViewstreamingPayment;
