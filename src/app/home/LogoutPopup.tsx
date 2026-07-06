"use client";
import React from "react";
import Cookies from "js-cookie";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { hideModal } from "../store/Slice/ModalsSlice";
import CustomDialog from "../components/CustomDialog";

function LogoutPopup() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.modals.Logout)

  const handleLogout = () => {
    Cookies.remove("Reelboost_auth_token");
    Cookies.remove("Reelboost_user_id");
    window.location.replace("/");
  };
  return (
  
          <CustomDialog open={open} onClose={() => dispatch(hideModal("Logout"))} width="420px" title="Logout">
        {/* Title */}
        <div className="py-4 xl:py-4">
        {/* <div className="place-items-center mb-4">
          <p className=" font-semibold text-base text-center font-gilroy_semibold text-dark">
            Logout
          </p>
        </div> */}
        <p className="text-gray text-center text-sm max-w-xs mx-auto">
          Çıkmak istiyor musunuz?
        </p>
        <div className="flex gap-6 mt-6 justify-center">
          <button
            className="px-10 py-2 rounded-xl text-sm border cursor-pointer border-main-green "
            
            onClick={() => dispatch(hideModal("Logout"))}
          >
            {" "}
            Cancel
          </button>
          <button
            className="px-12 py-2 text-primary cursor-pointer font-medium text-sm rounded-xl bg-main-green"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        </div>
        </CustomDialog>
   
  );
}

export default LogoutPopup;
