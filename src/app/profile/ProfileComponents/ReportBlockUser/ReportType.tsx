"use client";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import { useReportTypes } from "@/app/store/api/getReportTypes";
import { hideModal, showModal } from "@/app/store/Slice/ModalsSlice";
import { setSelectedReport } from "@/app/store/Slice/SetReportTextIdSlice";
import CustomDialog from "@/app/components/CustomDialog";

function ReportType() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.modals.ReportUser);
  const selectedReport = useAppSelector((state) => state.ReportType.selectedReport);


  const { data, isFetching } = useReportTypes();
  const reportList = data?.data.ReportTypes;

  const handleSelect = (reportId: number, reportText: string) => {
    dispatch(setSelectedReport({ id: reportId, text: reportText }));
    dispatch(hideModal("ReportUser"));
    dispatch(showModal("ReportConfirmation"));
  };

  return (
    // <Dialog
    //   open={open}
    //   onClose={handleClose}
    //   fullWidth
    //   PaperProps={{
    //     sx: { borderRadius: 3, maxWidth: 400, p: 0 },
    //   }}
    // >
      <CustomDialog open={open} onClose={() => dispatch(hideModal("ReportUser"))} width="400px">
      <div className="bg-primary py-6 rounded-xl text-center">
        <p className="font-semibold text-base pb-2">Report Profile</p>

        {isFetching ? (
          <p className="text-center text-gray-500 mt-4">Loading...</p>
        ) : (
          reportList?.map((report) => {
            const isSelected = selectedReport?.id === report.report_type_id;
            return (
              <button
                key={report.report_type_id}
                className="w-full py-3 px-6 text-left hover:bg-gray-100 border-b border-gray-200 flex items-center gap-3"
                onClick={() => handleSelect(report.report_type_id, report.report_text)}
              >
                {/* Radio Button */}
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? "border-main-green" : "border-gray-400"
                  }`}
                >
                  {isSelected && <span className="w-3 h-3 bg-main-green rounded-full"></span>}
                </span>

                {/* Report Text */}
                <span className="text-sm text-dark-gray">{report.report_text}</span>
              </button>
            );
          })
        )}
      </div>
    </CustomDialog>
  );
}

export default ReportType;
