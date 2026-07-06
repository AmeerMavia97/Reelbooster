"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import useApiPost from "@/app/hooks/postData";

interface GiftItem {
    gift_id: number;
    name: string;
    gift_thumbnail: string;
    gift_value: number;
    is_new?: boolean;
}

function GiftModal() {
    const { postData, loading } = useApiPost();
    const [giftList, setGiftList] = useState<GiftItem[]>([]);
    const [open, setOpen] = useState(false);

    // Fetch Gifts
    useEffect(() => {
        const fetchGifts = async () => {
            try {
                const response = await postData("/gift/get-gift", { all: true });
                const records = response?.data?.Records || [];
                setGiftList(records);
            } catch (err) {
                console.error("Failed to fetch gifts:", err);
            }
        };

        fetchGifts();
    }, []);

    return (
        <>
            {/* Floating Gift Button */}
            <div className="absolute bottom-4 right-5 z-50">
                <button
                    onClick={() => setOpen(true)}
                    className="w-12 h-12 rounded-full cursor-pointer bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm flex items-center justify-center"
                >
                    🎁
                </button>
            </div>

            {/* Modal + Overlay */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Background Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                        />

                        {/* Main Modal */}
                        <motion.div
                            className="fixed top-1/2 right-0 -translate-y-1/2 h-[70vh] w-[90%] max-w-[420px]
              bg-white rounded-3xl z-50 shadow-2xl flex flex-col overflow-hidden border border-purple-200"
                            initial={{ x: "100%" }}
                            animate={{ x: "0%" }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            {/* HEADER */}
                            <div className="px-5 pt-5 pb-3 bg-gradient-to-r from-[#a97af8] to-[#6A39F8] rounded-t-3xl flex justify-between items-center">
                                {/* Coin Balance */}
                                <div className="flex items-center gap-2 bg-white/30 px-3 py-1 rounded-full text-white font-semibold">
                                    🟡 <span>5000</span>
                                </div>

                                <h2 className="text-white text-lg font-semibold">Send Gift</h2>

                                <button
                                    onClick={() => setOpen(false)}
                                    className="text-white text-xl hover:opacity-70"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* CONTENT: Gift List */}
                            <div className="flex-1 overflow-y-auto px-4 pb-24 bg-white">
                                <div className="grid grid-cols-3 gap-4">
                                    {loading && (
                                        <p className="text-center col-span-3 text-[#6A39F8]">
                                            Loading gifts...
                                        </p>
                                    )}

                                    {!loading &&
                                        giftList.map((gift) => (
                                            <div
                                                key={gift.gift_id}
                                                className="rounded-2xl border border-purple-300 bg-purple-50/50 shadow 
                        flex flex-col items-center justify-center py-3 relative"
                                            >
                                                {/* HOT TAG */}
                                                {gift.is_new && (
                                                    <span className="absolute top-1 right-1 text-[10px] bg-red-500 text-white px-1 rounded">
                                                        HOT
                                                    </span>
                                                )}

                                                {/* IMAGE */}
                                                <Image
                                                    src={gift.gift_thumbnail}
                                                    alt={gift.name}
                                                    width={60}
                                                    height={60}
                                                    unoptimized
                                                    className="object-contain"
                                                />

                                                {/* PRICE */}
                                                <p className="text-xs font-semibold text-[#6A39F8] mt-1">
                                                    {gift.gift_value} Coin
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* BOTTOM RECHARGE */}
                            <div className="absolute bottom-0 left-0 w-full bg-[#7C4DFF] px-4 py-3 rounded-t-2xl flex justify-center shadow-inner">
                                <button className="bg-white text-[#6A39F8] flex items-center gap-2 px-6 py-2 rounded-full font-semibold shadow">
                                    🪙 Recharge →
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default GiftModal;
