"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { hideModal } from "../store/Slice/ModalsSlice";
import CustomDialog from "../components/CustomDialog";
import useApiPost from "../hooks/postData";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie'

function DeleteAccountPopup() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.modals.DeleteAccount);
  const {postData} = useApiPost();
  const router = useRouter();

  const handleDeleteAccount = async() => {
    try {
      const res = await postData("/users/updateUser",{
        delete:true,
      })
      if(res.status) {
        dispatch(hideModal("DeleteAccount"))
        toast.success("Account Deleted Successfully");
        Cookies.remove("Reelboost_auth_token")
        window.location.replace("/")
        router.push('/')
      } else {
        toast.error("Error deleting Account")
      }
    } catch(error) {

    }
  }

  return (
    <CustomDialog open={open} onClose={() => dispatch(hideModal("DeleteAccount"))} width="420px" title="Delete Account">
      {/* Title */}
      <div className="py-4">
        <p className="text-gray text-center text-sm max-w-xs mx-auto">
          Are you sure you want to Delete
        </p>
        <p className="text-center text-gray text-sm">your Account?</p>
        <div className="flex gap-6 mt-10 justify-center">
          <button
            className="px-10 py-2 rounded-xl text-sm border cursor-pointer border-main-green "
            onClick={() => dispatch(hideModal("DeleteAccount"))}
          >
            {" "}
            Cancel
          </button>
          <button
            className="px-12 py-2 text-primary cursor-pointer font-medium text-sm rounded-xl bg-main-green"
            onClick={() => handleDeleteAccount()}
          >
            Delete
          </button>
        </div>
      </div>
    </CustomDialog>
  );
}

export default DeleteAccountPopup;
