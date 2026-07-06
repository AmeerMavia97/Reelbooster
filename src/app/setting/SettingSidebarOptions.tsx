"use client";
import { showModal } from "../store/Slice/ModalsSlice";
import { useAppDispatch } from "../utils/hooks";
import SidebarOptionsButton from "./SidebarOptionsButton";
import { useRouter, usePathname } from "next/navigation";

function SettingSidebarOptions({
  onSelect,
}: {
  onSelect?: (path: string) => void;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();



  const handleNavigate = (path: string, action?: () => void) => {
   
    if (action) {
      action();
    } else {
      if (onSelect) {
        onSelect(path); // 🔑 for mobile / desktop
      } else {
        router.push(path); // fallback
      }
    }
  };

  return (
    <div className="flex flex-col overflow-y-auto sm:overflow-hidden bg-primary mb-28 sm:mb-0">
      {/* Saved Bookmark */}
      <SidebarOptionsButton
        iconSrc={
          pathname === "/setting"
            ? "/Setting/SavedBookmark.png"
            : "/Setting/B_Bookmark.png"
        }
        label="Saved Bookmark"
        isActive={pathname === "/setting"}
        onClickFunc={() => handleNavigate("/setting")}
      />

      {/* Blocked List */}
      <SidebarOptionsButton
        iconSrc={
          pathname === "/setting/blocked-list"
            ? "/Setting/BlockedList.png"
            : "/Setting/B_BlockedList.png"
        }
        label="Blocked List"
        isActive={pathname === "/setting/blocked-list"}
        onClickFunc={() => handleNavigate("/setting/blocked-list")}
      />

      {/* Add Bank Details */}
      <SidebarOptionsButton
        iconSrc={
          pathname === "/setting/bank-details"
            ? "/Setting/bankDetails.png"
            : "/Setting/B_bankDetails.png"
        }
        label="Bank Details"
        isActive={pathname === "/setting/bank-details"}
        onClickFunc={() => handleNavigate("/setting/bank-details")}
      />

      {/* Recharge */}
      <SidebarOptionsButton
        iconSrc={
          pathname === "/setting/recharge"
            ? "/Setting/Recharge.png"
            : "/Setting/B_Recharge.png"
        }
        label="Recharge"
        isActive={pathname === "/setting/recharge"}
        onClickFunc={() => handleNavigate("/setting/recharge")}
      />

      {/* Wallet */}
      <SidebarOptionsButton
        iconSrc={
          pathname === "/setting/wallet"
            ? "/Setting/Wallet.png"
            : "/Setting/B_Wallet.png"
        }
        label="Wallet"
        isActive={pathname === "/setting/wallet"}
        onClickFunc={() => handleNavigate("/setting/wallet")}
      />
      {/* Payment History */}
      <SidebarOptionsButton
        iconSrc={
          pathname === "/setting/payment-history"
            ? "/Setting/PaymentHistory.png"
            : "/Setting/B_PaymentHistory.png"
        }
        label="Payment History"
        isActive={pathname === "/setting/payment-history"}
        onClickFunc={() => handleNavigate("/setting/payment-history")}
      />

      {/* Coin History */}
      <SidebarOptionsButton
        iconSrc={
          pathname === "/setting/coin-history"
            ? "/Setting/CoinHistory.png"
            : "/Setting/B_CoinHistory.png"
        }
        label="Coin History"
        isActive={pathname === "/setting/coin-history"}
        onClickFunc={() => handleNavigate("/setting/coin-history")}
      />

      {/* Privacy Policy */}
      <SidebarOptionsButton
        iconSrc={
          pathname === "/setting/privacy-policy"
            ? "/Setting/PrivacyPolicy.png"
            : "/Setting/B_PrivacyPolicy.png"
        }
        label="Privacy Policy"
        isActive={pathname === "/setting/privacy-policy"}
        onClickFunc={() => handleNavigate("/setting/privacy-policy")}
      />

      {/* T&C */}
      <SidebarOptionsButton
        iconSrc={
          pathname === "/setting/terms&conditions"
            ? "/Setting/TermsConditions.png"
            : "/Setting/B_TermsConditions.png"
        }
        label="Terms & Conditions"
        isActive={pathname === "/setting/terms&conditions"}
        onClickFunc={() => handleNavigate("/setting/terms&conditions")}
      />

      {/* Logout */}
      <SidebarOptionsButton
        iconSrc="/SidebarIcons/logout.png"
        label="Logout"
        isActive={pathname === "Logout"}
        customClass="text-red font-medium"
        onClickFunc={() =>
          handleNavigate("Logout", () => dispatch(showModal("Logout")))
        }
      />

      {/* Delete Account */}
      <div className="flex justify-center items-center sm:mx-12 mx-20 absolute sm:bottom-2 -bottom-44">
        <button
          className="border cursor-pointer border-main-green bg-main-green text-sm rounded-xl w-52 py-2.5"
          onClick={() => dispatch(showModal("DeleteAccount"))}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default SettingSidebarOptions;
