"use client";
import React, { useEffect, useState } from "react";
import GooglePayButton from "@google-pay/button-react";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import useApiPost from "../hooks/postData";
import { RechargeResponse } from "../types/Gift";
import { toast } from "react-toastify";
import { hideModal, showModal } from "../store/Slice/ModalsSlice";
import { ProjectConfigRes } from "../types/ResTypes";
import Cookies from "js-cookie";

export default function GPayPayment() {
  const totalAmount = useAppSelector(
    (state) => state.transactionPlans.total_money
  );
  const selectedPlanId = useAppSelector(
    (state) => state.transactionPlans.selectedPlanId
  );
  const { postData } = useApiPost();
  const dispatch = useAppDispatch();
  const [merchantId,setMerchantId] = useState("");
  const [merchantName,setMerchantName] = useState("");
  const token = Cookies.get("Reelboost_auth_token")

  useEffect(() => {
    if (!token) return ;
      const fetchConfig = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/project_conf`
          );
          const data: ProjectConfigRes = await res.json();
          if (data?.data?.gpay_merch_id) setMerchantId(data.data.gpay_merch_id);
          if (data?.data?.gpay_merch_name) setMerchantName(data.data.gpay_merch_name);
        } catch (error) {
        }
      };
      fetchConfig();
    }, [token]);

  return (
    <GooglePayButton
      environment="TEST"
      buttonColor="white"
      paymentRequest={{
        apiVersion: 2,
        
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
              allowedCardNetworks: ["VISA", "MASTERCARD"],
            },
            tokenizationSpecification: {
              type: "PAYMENT_GATEWAY",
              parameters: {
                gateway: "stripe",
                "stripe:version": "2020-08-27",
                "stripe:publishableKey":
                  process.env.NEXT_PUBLIC_STRIPE_KEY!
              },
            },
          },
        ],
        merchantInfo: {
          merchantId: merchantId, // Replace with your GPay merchant ID in production
          merchantName: merchantName,
        },
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPriceLabel: "Total",
          totalPrice: String(totalAmount),
          currencyCode: "USD",
          countryCode: "US",
        },
      }}
      onLoadPaymentData={async (paymentData) => {

        // Extract Stripe token from Google Pay
        const token =
          paymentData.paymentMethodData?.tokenizationData?.token || null;

        if (!token) {
          return;
        }

        try {
          // Call your backend API
          const res: RechargeResponse = await postData(
            "/transaction/recharge",
            {
              payment_method: "Google pay",
              success: "success",
              acutal_money: totalAmount,
              plan_id: selectedPlanId,
              transaction_id_gateway: "", // Send token to backend
            }
          );
          if (res.status) {
            dispatch(hideModal("PaymentGateway"));
            toast.success(res.message);

            dispatch(showModal("RechargeSuccessful"));
          } else {
            toast.error(res.message);
          }
        } catch (error) {}
      }}
      onCancel={() => {
        dispatch(hideModal("PaymentGateway"))
        toast.success("Payment Cancel")
      }}
      onError={(err) => {
      }}
    />
  );
}
   