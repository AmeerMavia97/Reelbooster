"use client"
import { setDateRange } from "@/app/store/Slice/DateRangeSlice";
import PaymentWithdrawSelect from "../PaymentWithdrawSelect";
import DateRangePicker from "@/app/components/DatePicker";
import { useAppDispatch } from "@/app/utils/hooks";

function PaymentHistory() {
  const dispatch = useAppDispatch()

  return (
    <div className="border border-main-green/[0.36] rounded-lg px-4 py-4 mt-6 sm:mx-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-dark text-base font-semibold pb-3">
          Payment History
        </h2>

        <DateRangePicker
          onChange={(range) => {
            if (range?.startDate && range?.endDate) {
              dispatch(setDateRange(range));
            }
          }}
        />
      </div>

      {/* Tabs */}
      <PaymentWithdrawSelect />
    </div>
  );
}

export default PaymentHistory;
