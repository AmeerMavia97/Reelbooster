import React from "react";
import Image from "next/image";
import Coins from "../../../../public/gift/coin-removebg-preview.png";
import Cookies from "js-cookie";
import { useUserProfile } from "@/app/store/api/updateUser";
import { useAppDispatch } from "@/app/utils/hooks";
import { showModal } from "@/app/store/Slice/ModalsSlice";

function ViewstreamingrightsideAvaivlecoins() {
    const token = Cookies.get("Reelboost_auth_token");
    const { data: userData } = useUserProfile(token ?? "");

    console.log("User Data in Available Coins:@@", userData?.data?.available_coins);

    const dispatch = useAppDispatch();

    return (
        <div className="absolute bottom-1 left-3 right-3 z-50">
            <div
                className="flex items-center justify-between 
                      bg-black/70 backdrop-blur-xl 
                      rounded-2xl px-4 py-3 shadow-2xl"
            >
                {/* Available Coins */}
                <button
                    className="flex items-center gap-2   cursor-pointer
                     bg-white/10 hover:bg-white/15
                     transition rounded-full px-3 py-2"
                >
                    <Image src={Coins} width={26} height={26} alt="Coins" className="object-contain" />

                    <span className="text-xs text-gray-200">Available Coins</span>

                    <span
                        className="ml-1 bg-gradient-to-r from-yellow-400 to-yellow-500
                       text-black font-semibold text-sm px-3 py-0.5 rounded-full"
                    >
                        {userData?.data?.available_coins ?? 0}
                    </span>
                </button>

                {/* Recharge Button */}
                <button
                    className="flex items-center gap-1 cursor-pointer
                     bgcolor
                     active:scale-95 transition
                     text-white font-semibold text-sm
                     px-5 py-2.5 rounded-xl shadow-md"
                    onClick={() => {
                        dispatch(showModal("RechargePlan"));
                    }}
                >
                    + Recharge
                </button>
            </div>
        </div>
    );
}

export default ViewstreamingrightsideAvaivlecoins;
