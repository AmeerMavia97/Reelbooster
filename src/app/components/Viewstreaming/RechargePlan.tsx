"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { DialogContent } from "@mui/material";
import getSymbolFromCurrency from "currency-symbol-map";
import { useTransactionPlans } from "@/app/store/api/getTransactionPlans";
import {
  appendPlans,
  setSelectedPlanAmount,
  setSelectedPlanId,
} from "@/app/store/Slice/TransactionPlanSlice";
import { hideModal, showModal } from "@/app/store/Slice/ModalsSlice";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import CustomDialogRecharge from "./CustomDialogRecharge";

const RechargePlan = () => {
  const dispatch = useAppDispatch();

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isFetchingRef = useRef(false);

  const isOpen = useAppSelector((state) => state.modals.RechargePlan);
  const { plans, selectedPlanId } = useAppSelector(
    (state) => state.transactionPlans
  );

  const [page, setPage] = useState(12);
  const [hasMore, setHasMore] = useState(true);

  const { data, isFetching, isLoading } = useTransactionPlans(page);

  /* -------------------------------
     Reset pagination when modal opens
  ------------------------------- */
  useEffect(() => {
    if (isOpen) {
      setPage(1);
      setHasMore(true);
    }
  }, [isOpen]);

  /* -------------------------------
     Append new plans & handle pagination
  ------------------------------- */
  useEffect(() => {
    if (!data?.data) return;

    const { Records, Pagination } = data.data;

    if (Records?.length) {
      dispatch(appendPlans(Records));
    }

    setHasMore(Pagination.current_page < Pagination.total_pages);
    isFetchingRef.current = false;
  }, [data, dispatch]);

  /* -------------------------------
     Infinite Scroll Observer
  ------------------------------- */
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingRef.current && !isFetching) {
          isFetchingRef.current = true;
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "150px" }
    );

    observerRef.current.observe(loaderRef.current);

    return () => observerRef.current?.disconnect();
  }, [hasMore, isFetching]);

  /* -------------------------------
     Handlers
  ------------------------------- */
  const handlePlanSelect = useCallback(
    (plan: any) => {
      dispatch(setSelectedPlanId(plan.plan_id));
      dispatch(setSelectedPlanAmount(plan.corresponding_money));
    },
    [dispatch]
  );

  const handleClose = () => dispatch(hideModal("RechargePlan"));

  /* -------------------------------
     Render
  ------------------------------- */
  return (
    <CustomDialogRecharge
      open={isOpen}
      onClose={handleClose}
      title="Recharge Plan"
      fullWidth
      maxWidth="sm"
    >
      <DialogContent sx={{ p: 0 }}>
        <div className="flex flex-col h-full bg-primary">

          {/* Plans Grid */}
          <div className="flex-1 px-6 py-6 overflow-y-auto scrollbar-hide">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {plans.map((plan) => {
                const symbol =
                  getSymbolFromCurrency(plan.currency) || plan.currency;

                return (
                  <div
                    key={plan.plan_id}
                    onClick={() => handlePlanSelect(plan)}
                    className={`flex flex-col items-center gap-3 py-6 px-6 border rounded-lg cursor-pointer transition
                      ${selectedPlanId === plan.plan_id
                        ? "border-main-green bg-main-green/10"
                        : "border-main-green/40 hover:bg-main-green/5"
                      }`}
                  >
                    <Image
                      src="/profile/coin.png"
                      alt={plan.plan_name}
                      width={50}
                      height={50}
                    />
                    <div className="text-center">
                      <p className="text-sm font-medium">{plan.coins} Coins</p>
                      <p className="text-sm text-main-green">
                        {symbol}
                        {plan.corresponding_money}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Loader */}
            {hasMore && (
              <div ref={loaderRef} className="flex justify-center py-6">
                {(isLoading || isFetching) && <p>Loading...</p>}
              </div>
            )}
          </div>
          {/* Pay Now Button */}
          {selectedPlanId && (
            <div className="absolute   bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs sm:max-w-sm px-4">
              <button
                className="w-full bg-main-green text-white py-3 rounded-2xl  cursor-pointer font-semibold shadow-lg hover:shadow-xl hover:opacity-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main-green"
                onClick={() => dispatch(showModal("ViewstreamingPayment"), dispatch(hideModal("RechargePlan")))}
              >
                Pay Now
              </button>
            </div>
          )}

        </div>
      </DialogContent>
    </CustomDialogRecharge>
  );
};

export default RechargePlan;
