"use client";
import useApiPost from "@/app/hooks/postData";
import { CoinHistoryRes, CoinHistoryRecord } from "@/app/types/Gift";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import RoundedShimmer from "@/app/components/Shimmer/RoundedShimmer";

interface Sender {
  sender_id: number;
  user_name: string;
  profile_pic: string;
}

function LatestGiftSender() {
  const { postData } = useApiPost();
  const myUserId = Cookies.get("Reelboost_user_id");
  const [senders, setSenders] = useState<Sender[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const handleFetchLatestSender = async () => {
      try {
        const res: CoinHistoryRes = await postData("/transaction/history", {
          page: 1,
          reciever_id: myUserId,
          transaction_table: "coin",
        });

        if (res.status && res.data?.Records) {
          const uniqueSenders = new Map<number, Sender>();

          res.data.Records.forEach((record: CoinHistoryRecord) => {
            const s = record.sender;
            if (s?.user_id) {
              uniqueSenders.set(s.user_id, {
                sender_id: s.user_id,
                user_name: s.user_name || "Unknown",
                profile_pic: s.profile_pic || "/extra/profilePic.png",
              });
            }
          });

          setSenders(Array.from(uniqueSenders.values()));
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    handleFetchLatestSender();
  }, [myUserId]);

  return (
    <div className="border border-main-green/[0.36] rounded-md px-4 py-4">
      <h2 className="text-dark text-base font-semibold">Latest Gift Sender</h2>

      {isLoading ? (
        <div className="flex overflow-x-auto gap-4 py-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 px-2 items-center flex-shrink-0"
            >
              <div className="w-10 h-10 rounded-full">
              <RoundedShimmer /> 

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex overflow-x-auto gap-2 py-4">
          {senders.length >  0 ? (
            senders.map((sender) => (
              <div
                key={sender.sender_id}
                className="flex flex-col gap-1 px-2 items-center flex-shrink-0"
              >
                <Image
                  src={sender.profile_pic}
                  alt={sender.user_name}
                  width={45}
                  height={45}
                  className="rounded-full"
                />
                <p className="text-xs text-dark truncate w-14 text-center">
                  {sender.user_name}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray text-center mx-auto">
              You didn’t recieved any Gift
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default LatestGiftSender;
