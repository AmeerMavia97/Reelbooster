"use client";
import React, { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useAppSelector, useAppDispatch } from "../utils/hooks";
import useApiPost from "../hooks/postData";
import { showModal, hideModal } from "../store/Slice/ModalsSlice";
import { toast } from "react-toastify";
import { RechargeResponse } from "../types/Gift";
import { ProjectConfigRes } from "../types/ResTypes";
import Cookies from "js-cookie";

export default function PaymentWithPaypal() {
  const dispatch = useAppDispatch();
  const amount =
    useAppSelector((state) => state.transactionPlans.total_money) || "0.00";
  const selectedPlanId = useAppSelector(
    (state) => state.transactionPlans.selectedPlanId
  );
  const { postData } = useApiPost();
  const [paypalClientId, setPaypalClientId] = useState("");
const token = Cookies.get("Reelboost_auth_token")
  useEffect(() => {
    if (!token) return;

    const fetchConfig = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/project_conf`
        );
        const data: ProjectConfigRes = await res.json();
        setPaypalClientId(data?.data.paypal_public_key || "");
      } catch (error) {
      }
    };
    fetchConfig();
  }, [token]);

  if (!paypalClientId) {
    return <div>Loading PayPal...</div>; // or a spinner
  }
  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId, // ✅ from state, not env
        currency: "USD",
      }}
    >
      <div className="w-full max-w-2xl mx-auto p-4 border rounded-lg shadow-md max-h-[70vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Pay with PayPal
        </h2>

        <PayPalButtons
          style={{
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "paypal",
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              intent: "CAPTURE", // ✅ required by TS typings
              purchase_units: [
                {
                  description: "Your purchase",
                  amount: {
                    currency_code: "USD", // ✅ required
                    value: String(amount), // must be string
                  },
                },
              ],
              application_context: {
                shipping_preference: "NO_SHIPPING",
              },
            });
          }}
          onApprove={async (data, actions) => {
            if (!actions.order) return;
            try {
              const details = await actions.order.capture();

              // Call your backend API
              const res: RechargeResponse = await postData(
                "/transaction/recharge",
                {
                  payment_method: "Paypal",
                  success: "success",
                  acutal_money: amount,
                  plan_id: selectedPlanId,
                  transaction_id_gateway: details.id, // PayPal order ID
                }
              );

              if (res.status) {
                dispatch(hideModal("PaymentGateway"));
                toast.success(res.message);
                dispatch(showModal("RechargeSuccessful"));
              } else {
                toast.error(res.message);
              }
            } catch (error) {
              // toast.error("Something went wrong while processing the payment.");
            }
          }}
          onError={(err) => {
            toast.error("An error occurred during PayPal Checkout.");
          }}
          onCancel={() => {
            toast.info("Payment cancelled by the user.");
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
}
