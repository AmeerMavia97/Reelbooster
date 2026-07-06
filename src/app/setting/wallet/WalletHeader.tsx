"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTransactionConfQuery } from "@/app/store/api/getTransactionConf";
import Cookies from "js-cookie";
import { useUserProfile } from "@/app/store/api/updateUser";

function WalletHeader() {
  const token = Cookies.get("Reelboost_auth_token");
  const { data } = useUserProfile(token ?? "");

  // to fetch the 1 coin value to calculate balance ==================
  const { data: confData } = useTransactionConfQuery();
  const [dollarValue, setDollarValue] = useState(0);
  const coinValuePer1Currency = parseFloat(
    confData?.data?.Records[0]?.coin_value_per_1_currency
  );

  const coinsPerDollar = coinValuePer1Currency;
  const dollarPerCoin = coinsPerDollar ? (1 / coinsPerDollar).toFixed(3) : "0";

  useEffect(() => {
    if (confData?.data?.Records?.length && data?.data?.available_coins) {
      // usually only 1 config record, but picking first
      const coinValuePer1Currency = parseFloat(
        confData.data.Records[0].coin_value_per_1_currency
      );

      // Convert coins to dollars
      const calculatedDollar = (
        Number(data.data.available_coins) / coinValuePer1Currency
      ).toFixed(2);

      setDollarValue(Number(calculatedDollar));
    }
  }, [confData, data]);
  return (
    <>
      <div
        className="border border-main-green rounded-xl px-4 py-3 flex-shrink-0  relative overflow-hidden"
        style={{
          background:
            "linear-gradient(141.72deg, #239C57 -1.01%, #019FC8 103.86%)",
        }}
      >
        {/* Background image */}
        <div className="absolute inset-0 opacity-90 pointer-events-none">
          {/* <Image
            src="/gift/BalanceBackground.png"
            alt="coin-bg"
            fill
            className="object-cover rounded-xl"
            // style={{ objectPosition: "center" }}
          /> */}
          <Image
            src="/gift/TopRightEllipse.png"
            alt="ellipse"
            width={60}
            height={60}
            className="absolute -top-2 right-0"
          />
          <Image
            src="/gift/LeftBottom.png"
            alt="ellipse"
            width={100}
            height={100}
            className="absolute bottom-0 left-8"
          />
          <Image
            src="/gift/LeftTop.png"
            alt="ellipse"
            width={80}
            height={80}
            className="absolute top-0 left-0"
          />
        </div>

        {/* total available balance and coins  */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <h3 className="text-primary text-xs sm:text-sm font-semibold">
              Total Available Coins
            </h3>
            {/* note for coin */}
            <div className="flex gap-2 place-items-center">
              <Image
                src="/gift/information.png"
                alt="info"
                width={16}
                height={16}
              />
              <p className="text-dark sm:text-[13px] text-xs font-medium ">
                Note: 1 coin = $ {dollarPerCoin}
              </p>
            </div>
          </div>

          <div className="flex gap-1.5 items-center">
            <Image src="/profile/coin.png" alt="coin" width={40} height={40} />
            <p className="text-primary text-lg">
              {data?.data.available_coins} Coins
            </p>
          </div>

          {/* available amount */}
          <div className="bg-[#FCD227] rounded-xl sm:max-w-13/20">
            <h2 className="text-dark font-semibold px-4 sm:text-sm text-xs py-0.5 text-center">
              Available Amount is {confData?.data?.Records[0]?.currency_symbol}
              {dollarValue} = {data?.data.available_coins} coins
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}

export default WalletHeader;
