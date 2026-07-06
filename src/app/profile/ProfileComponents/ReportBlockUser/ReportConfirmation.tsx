"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import { clearSelectedReport } from "@/app/store/Slice/SetReportTextIdSlice";
import ClipLoader from "react-spinners/ClipLoader";
import useApiPost from "@/app/hooks/postData";
import { toast } from "react-toastify";
import { hideModal } from "@/app/store/Slice/ModalsSlice";
import { SendReportRes } from "@/app/types/ResTypes";
import CustomDialog from "@/app/components/CustomDialog";

function ReportConfirmation() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.modals.ReportConfirmation);
  const selectedReport = useAppSelector((state) => state.ReportType.selectedReport);
  const currentUserId = useAppSelector((state) => state.userId.user_id)
  const [loading, setLoading] = React.useState(false);

  const handleClose = () => {
    dispatch(hideModal("ReportConfirmation"));
    dispatch(clearSelectedReport());
  };
      const { postData } = useApiPost();

  const handleReport = async () => {
    if (!selectedReport) return;
    setLoading(true);

    try {
      const res:SendReportRes = await postData("/report/report-user", {
        report_type_id: selectedReport.id,
        user_id: currentUserId, // Replace with actual user id
      });
      if(res.status) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }

      handleClose();
    } catch (err) {
      toast.error("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <Dialog open={open} onClose={handleClose} fullWidth PaperProps={{ sx: { borderRadius: 3, maxWidth: 400 } }}>
      <CustomDialog open={open} onClose={() => handleClose()} width="420px" title="Confirm Report">
      <div className="bg-primary py-6 px-6 rounded-xl text-center">
        {/* <p className="font-semibold text-base">Confirm Report</p> */}
        <p className="text-gray-600 mt-2">
          Are you sure you want to report user ? 
        </p>

        <div className="flex gap-4 mt-8 justify-center">
          <button
            className="w-36 rounded-xl border border-gray-400"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="w-36 py-2 rounded-xl bg-main-green text-primary"
            onClick={handleReport}
            disabled={loading}
          >
            {loading ? <ClipLoader size={15} color="#fff" /> : "Report"}
          </button>
        </div>
      </div>
    </CustomDialog>
  );
}

export default ReportConfirmation;
