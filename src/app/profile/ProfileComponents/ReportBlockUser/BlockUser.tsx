"use client";
import { hideModal } from "@/app/store/Slice/ModalsSlice";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import ClipLoader from "react-spinners/ClipLoader";
import { BlockUnblockResponse } from "@/app/types/ResTypes";
import useApiPost from "@/app/hooks/postData";
import { toast } from "react-toastify";
import CustomDialog from "@/app/components/CustomDialog";


function BlockUser() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.modals.BlockUser);


  const handleClose = () => {
    dispatch(hideModal("BlockUser"));
  };

  const activeUserId = useAppSelector((state) => state.userId.user_id);
  const {postData,loading} = useApiPost();

  const handleBlockUnblock = async() => {
    try{
        const response:BlockUnblockResponse = await postData ('/block/block-unblock',{user_id:activeUserId})
        if(response.status) {
            toast.success(response.message)
        } else {
            toast.error(response.message)
        }
            dispatch(hideModal("BlockUser"))

    } catch(error:unknown) {
    }
  }

  return (
    // <Dialog
    //   open={open}
    //   onClose={handleClose}
    //   fullWidth
    //   PaperProps={{
    //     sx: {
    //       p: 0,
    //       overflow: "visible",
    //       borderRadius: 3,
    //       maxHeight: "90vh",
    //       width: "100%",
    //       maxWidth: 400,
    //     },
    //   }}
    //   BackdropProps={{ sx: { background: "#000000BD" } }}
    // >
      <CustomDialog open={open} onClose={() => dispatch(hideModal("BlockUser"))} width="400px" title="Block Profile">
      <div className="bg-white py-6 px-6 rounded-xl text-center">
       

        <p className="text-center text-[#606060] max-w-xs mx-auto">
          Are you sure you want to block this user?
        </p>

        <div className="flex gap-6 mt-6 justify-center">
          <button
            className="px-10 py-2 rounded-xl text-[#3A3333] border border-main-green"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="w-[150px] py-2 text-primary font-medium text-base rounded-xl bg-main-green"
            onClick={handleBlockUnblock}
          >
            {loading ? (
              <ClipLoader size={15} color="#FFFFFF" loading={loading} />
            ) : (
              "Block"
            )}
          </button>
        </div>
      </div>
    </CustomDialog>
  );
}

export default BlockUser;
