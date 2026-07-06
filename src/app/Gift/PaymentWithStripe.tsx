"use client";
import React, { useEffect, useState } from "react";
import { loadStripe,Stripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import useApiPost from "../hooks/postData";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { RechargeResponse } from "../types/Gift";
import { PaymentIntentResponse, ProjectConfigRes } from "../types/ResTypes";
import { toast } from "react-toastify";
import { hideModal, showModal } from "../store/Slice/ModalsSlice";
import Cookies from "js-cookie";

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { postData } = useApiPost();
  const { plans, selectedPlanId, total_money } = useAppSelector(
    (state) => state.transactionPlans
  );
  const [clientSecret, setClientSecret] = useState("");
  const dispatch = useAppDispatch();

  // Create payment intent when component mounts (dialog opens)
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res: PaymentIntentResponse = await postData(
          "/transaction/create-stripe-paymentintent",
          { plan_id: selectedPlanId }
        );
        setClientSecret(res?.data.clientSecret);
      } catch (err) {
      }
    };

    if (selectedPlanId) {
      createPaymentIntent();
    }
  }, [selectedPlanId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) return;

    // Confirm payment with Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: { card: cardNumber } }
    );

    if (error) {
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      // Call backend to register the recharge
      try {
        const res: RechargeResponse = await postData("/transaction/recharge", {
          payment_method: "stripe",
          success: "success",
          acutal_money: total_money,
          plan_id: selectedPlanId,
          transaction_id_gateway: clientSecret,
        });
        if(res.status) {
          toast.success(res.message)
          dispatch(hideModal("PaymentGateway"));
          dispatch(showModal("RechargeSuccessful"))
        } else {
          toast.error(res.message)
        }
      } catch (err) {
      }
    }
  };

  const elementStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        "::placeholder": { color: "#a0a0a0" },
      },
      invalid: { color: "#fa755a" },
    },
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 w-full max-w-md mx-auto"
    >
      <div className="p-3 border rounded-lg bg-primary">
        <CardNumberElement options={elementStyle} />
      </div>

      <div className="flex gap-4">
        <div className="flex-1 p-3 border rounded-xl bg-primary">
          <CardExpiryElement options={elementStyle} />
        </div>
        <div className="flex-1 p-3 border rounded-xl bg-primary">
          <CardCvcElement options={elementStyle} />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || !clientSecret}
        className="bg-main-green text-primary py-3  cursor-pointer rounded-xl font-semibold hover:opacity-90 transition"
      >
        Pay with Stripe
      </button>
    </form>
  );
}


export default function PaymentWithStripe() {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
const token = Cookies.get("Reelboost_auth_token")
  useEffect(() => {
    if (!token) return;

    const fetchConfig = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/project_conf`);
        const data: ProjectConfigRes = await res.json();
        if (data?.data?.stripe_public_key) {
          setStripePromise(loadStripe(data.data.stripe_public_key));
        }
      } catch (err) {
      }
    };
    fetchConfig();
  }, [token]);

  if (!stripePromise) {
    return <div>Loading Stripe...</div>; // loader until key is ready
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}