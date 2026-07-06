"use client"
import React, { useState } from 'react'
import RechargeHistory from './wallet/RechargeHistory'
import WithdrawHistory from './wallet/WithdrawHistory'
import { usePathname } from 'next/navigation';
import { useAppDispatch } from '../utils/hooks';
import { clearDateRange } from '../store/Slice/DateRangeSlice';

function PaymentWithdrawSelect() {
    const [activeTab,setActiveTab] = useState("recharge");
    const pathname= usePathname();
    const dispatch = useAppDispatch();
  return (
    <>
     <div className="flex bg-main-green/[0.04] rounded-xl overflow-hidden mb-4">
        <button
          onClick={() => {setActiveTab("recharge"); dispatch(clearDateRange())}}
          className={`flex-1 py-2 text-sm font-medium transition cursor-pointer ${
            activeTab === "recharge" ? "text-main-green" : "text-gray"
          }`}
        >
          Recharge
        </button>
        <div className="w-px h-4 my-2 bg-gray-300 self-stretch" />

        <button
          onClick={() => {setActiveTab("withdraw"); dispatch(clearDateRange())}}
          className={`flex-1 py-2 text-sm rounded-xl font-medium transition cursor-pointer ${
            activeTab === "withdraw" ? "text-main-green" : "text-gray"
          }`}
        >
         Withdraw History
        </button>
      </div>

      {/* Transactions */}
      {activeTab === "recharge" ? (
        <>
          {pathname.includes("payment-history") ? ( <RechargeHistory /> ) : (<><RechargeHistory limit={3} /></>)}
        </>
      ) : (
        <>
          {pathname.includes("payment-history") ? ( <WithdrawHistory /> ) : (<><WithdrawHistory limit={3} /></>)}

        </>
      )}
    </>
  )
}

export default PaymentWithdrawSelect 
