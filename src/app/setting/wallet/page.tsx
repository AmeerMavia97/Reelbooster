import React from "react";
import WalletHeader from "./WalletHeader";
import RechargeWithdrawButton from "./RechargeWithdrawButton";
import LatestSender from "./LatestGiftSender";
import PaymentHistory from "./PaymentHistory";

function Walletpage() {
  return (
    <>
      <h2 className="text-dark px-6 pt-6 font-semibold text-lg">Wallet</h2>
      <div className="sm:px-6 space-y-6 py-4">
      <WalletHeader />
      <RechargeWithdrawButton />
      <LatestSender />
      <PaymentHistory />
      </div>
    </>
  );
}

export default Walletpage;
