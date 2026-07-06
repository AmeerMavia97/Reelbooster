"use client";
import { useUserProfile } from "@/app/store/api/updateUser";
import Cookies from "js-cookie";
import AddBankDetails from "./AddBankDetails";
import EditBankDetails from "./EditBankDetails";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import { setScreen } from "@/app/store/Slice/BankScreenSlice";

function BankScreens() {
  const token = Cookies.get("Reelboost_auth_token");
  const dispatch = useAppDispatch();
  const activeScreen = useAppSelector((s) => s.bankScreen.activeScreen);

  // Fetch bank details
  const { data } = useUserProfile(token ?? "");
  const userBankDetails = data?.data;

  // ✅ Check if all required fields are filled
  const isBankDetailsComplete =
    !!userBankDetails?.account_name &&
    !!userBankDetails?.bank_name &&
    !!userBankDetails?.account_number &&
    !!userBankDetails?.IFSC_code &&
    !!userBankDetails?.swift_code;

  // ✅ Show Add screen ONLY if:
  // - Fields are incomplete
  // - OR user explicitly switched to "add" mode
  const shouldShowAddScreen = !isBankDetailsComplete || activeScreen === "add";

  return (
    <div>
      {shouldShowAddScreen ? (
        <div className="px-6 py-4">
          <h2 className="text-dark font-semibold text-lg">Add Bank Details</h2>
          <AddBankDetails
            onSubmitSuccess={() => {
              dispatch(setScreen("edit")); // switch to edit after submit
            }}
          />
        </div>
      ) : (
        <div className="px-6 py-4">
          <h2 className="text-dark font-semibold text-lg">Bank Details</h2>
          <EditBankDetails />
        </div>
      )}
    </div>
  );
}

export default BankScreens;
