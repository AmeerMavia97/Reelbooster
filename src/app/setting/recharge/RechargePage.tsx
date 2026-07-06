"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useTransactionPlans } from "@/app/store/api/getTransactionPlans";
import { useDispatch } from "react-redux";
import {
  appendPlans,
  setSelectedPlanId,
  setSelectedPlanAmount
} from "@/app/store/Slice/TransactionPlanSlice";
import { useAppSelector } from "@/app/utils/hooks";
import getSymbolFromCurrency from "currency-symbol-map";
import { showModal } from "@/app/store/Slice/ModalsSlice";

export default function RechargePage() {
  const dispatch = useDispatch();
  const { plans, selectedPlanId } = useAppSelector(
    (state) => state.transactionPlans
  );

  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isFetching } = useTransactionPlans(page);

  // Append new records into Redux
  useEffect(() => {
    if (data?.data?.Records) {
      dispatch(appendPlans(data.data.Records));
    }
  }, [data, dispatch]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        const pagination = data?.data?.Pagination;
        if (
          target.isIntersecting &&
          !isFetching &&
          pagination &&
          pagination.current_page < pagination.total_pages
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [data, isFetching]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-3 p-6">
        <h1 className="text-lg font-bold text-dark sm:block hidden">
          Recharge
        </h1>
        <h3 className="text-main-green text-base">
          Upgrade to Premium & Unlock Full Access
        </h3>
        <p className="text-gray text-sm">
          Get the Premium Plan for unlimited access to advanced features and
          exclusive content.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="flex-1 flex justify-center">
        <div className="grid sm:grid-cols-3 grid-cols-2 gap-6 mt-4 overflow-y-auto scrollbar-hide">
          {plans.map((plan) => {
            // Get currency symbol dynamically from package
            const symbol =
              getSymbolFromCurrency(plan.currency) || plan.currency;
            return (
              <div
                key={plan.plan_id}
                onClick={() => {dispatch(setSelectedPlanId(plan.plan_id)); dispatch(setSelectedPlanAmount(plan.corresponding_money))}}
                className={`flex flex-col items-center gap-3 h-fit py-8 px-12 border rounded-lg cursor-pointer transition 
                  ${
                    selectedPlanId === plan.plan_id
                      ? "border-main-green bg-main-green/[0.1]"
                      : "border-main-green/[0.36]"
                  }`}
              >
                <Image
                  src="/profile/coin.png"
                  alt={plan.plan_name}
                  width={50}
                  height={50}
                  className="rounded-lg"
                />
                <div className="flex flex-col items-center">
                  <span className="font-medium text-sm text-dark">
                    {plan.coins} Coins
                  </span>
                  {/* Use currency-symbol-map */}
                  <span className="text-sm text-main-green">
                    {symbol}
                    {plan.corresponding_money}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Loader */}
      <div ref={loaderRef} className="flex justify-center p-4">
        {isLoading || isFetching ? <p>Loading...</p> : null}
      </div>

      {/* Pay Now Button */}
      {selectedPlanId && (
        <div className="sticky bottom-0 w-full p-4 bg-primary shadow-lg flex justify-center">
          <button
            className="w-full max-w-sm bg-main-green text-primary py-3 rounded-xl font-medium hover:opacity-90 transition cursor-pointer"
            onClick={() => dispatch(showModal("PaymentGateway"))}
          >
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
}
