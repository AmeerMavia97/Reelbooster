"use client";
import { setScreen } from "@/app/store/Slice/BankScreenSlice";
import { useAppDispatch } from "@/app/utils/hooks";
import Image from "next/image";
import Cookies from "js-cookie";
import { useUserProfile } from "@/app/store/api/updateUser";

function EditBankDetails() {
  const dispatch = useAppDispatch();
  const token = Cookies.get("Reelboost_auth_token");
    const { data } = useUserProfile(token ?? "");
    const userData = data?.data;
  
  return (
    <>
      <div
        style={{ boxShadow: "2px 4px 14.4px 0px #0000000F" }}
        className="bg-primary rounded-lg p-3 my-4"
      >
        <div className="flex justify-between place-items-start">
          <div className="flex gap-4 place-items-center">
            {/* Edit image */}
            <div className="border border-main-green rounded-lg p-3">
              <Image
                src="/gift/EditBank.png"
                alt="edit"
                width={30}
                height={30}
              />
            </div>

            {/* user bank details */}
            <div className="flex flex-col gap-1">
              <h3 className="text-sm text-dark">{userData?.bank_name}</h3>
              <p className="text-dark text-xs">{userData?.account_number.replace(/.(?=.{4})/g, "*")}</p>
            </div>
          </div>

          {/* Edit Button */}
          <button onClick={() => dispatch(setScreen("add"))} className="cursor-pointer">
            <Image
              src="/gift/EditButton.png"
              alt="edit"
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>
    </>
  );
}

export default EditBankDetails;
