"use client";
import React from "react";
import { useRouter } from "next/navigation";
import PaymentWithdrawSelect from "../PaymentWithdrawSelect";

function PaymentHistory() {
  const router = useRouter();

  return (
    <div className="border border-main-green/[0.36] rounded-md px-4 py-4">
      {/* Title and See all */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-dark text-base font-semibold">Payment History</h2>
        <button
          className="text-gray text-xs hover:underline cursor-pointer"
          onClick={() => router.push("/setting/payment-history")}
        >
          See all
        </button>
      </div>

      {/* Tabs */}
      <PaymentWithdrawSelect />
    </div>
  );
}

export default PaymentHistory;
