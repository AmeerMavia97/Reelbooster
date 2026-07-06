"use client";
import React, { useState } from "react";
import SavedBookmarksPage from "./SavedBookmarksPage";
import { useRouter } from "next/navigation";
import SettingSidebar from "./SettingSidebar";
import { IoChevronBackOutline } from "react-icons/io5";
import BlockedListPage from "./blocked-list/page";
import PrivacyPage from "./privacy-policy/page";
import TermsConditionsPage from "./terms&conditions/page";
import RechargePage from "./recharge/page";
import Walletpage from "./wallet/page";
import BankDetailsPage from "./bank-details/page";
import CoinHistoryPage from "./coin-history/page";
import PaymentHistory from "./payment-history/page";

export default function SettingsMain() {
  const [activePage, setActivePage] = useState<string | null>("/setting"); // default SavedBookmark
  const router = useRouter();

  const pageTitles: Record<string, string> = {
    "/setting": "Saved Bookmarks",
    "/setting/blocked-list": "Blocked List",
    "/setting/privacy-policy": "Privacy Policy",
    "/setting/terms&conditions": "Terms & Conditions",
  };

  const renderContent = () => {
    switch (activePage) {
      case "/setting":
        return <SavedBookmarksPage />;
      case "/setting/blocked-list":
        return <BlockedListPage />;
      case "/setting/privacy-policy":
        return <PrivacyPage />;
      case "/setting/terms&conditions":
        return <TermsConditionsPage />;
      case "/setting/recharge":
        return <RechargePage />;
      case "/setting/wallet":
        return <Walletpage />;
      case "/setting/bank-details":
        return <BankDetailsPage />;
      case "/setting/coin-history":
        return <CoinHistoryPage />;
      case "/setting/payment-history":
        return <PaymentHistory />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex">
      {/* Desktop Layout */}
      <div className="hidden md:flex w-full">
        <div className="flex-1 p-4">
          {/* Header with Back + Title */}
          {activePage && (
            <div className="flex items-center gap-2 mb-4 sm:hidden">
              <button
                onClick={() => router.push("/profile")}
                className="text-xl"
              >
                <IoChevronBackOutline />
              </button>
              <h2 className="text-lg font-semibold">
                {pageTitles[activePage]}
              </h2>
            </div>
          )}
          {renderContent()}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex-1 block md:hidden">
        {!activePage ? (
          <SettingSidebar
            key="settings"
            onBack={() => router.push("/profile")}
            onSelect={setActivePage}
          />
        ) : (
          <div className="p-4">
            {/* Back to Sidebar */}
            <div className="flex items-center gap-2 mb-4 sm:hidden">
              <button onClick={() => setActivePage(null)} className="text-xl">
                <IoChevronBackOutline className="text-dark" />
              </button>
              <h2 className="text-lg font-semibold text-dark ">
                {pageTitles[activePage]}
              </h2>
            </div>
            {renderContent()}
          </div>
        )}
      </div>
    </div>
  );
}
