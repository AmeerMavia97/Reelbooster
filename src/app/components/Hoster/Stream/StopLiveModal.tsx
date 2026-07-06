import React, { useCallback, useEffect, useRef } from "react";
import CustomDialog from "../../CustomDialog";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import { hideModal } from "@/app/store/Slice/ModalsSlice";
import { FiAlertTriangle } from "react-icons/fi";
import { useLiveStream } from "@/app/context/LiveStreamContext";
import { socketInstance } from "@/app/socket/socket";
import { useRouter } from "next/navigation";

function StopLiveModal() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.modals.StopLiveModal);
  const router = useRouter();


  const socket = socketInstance();
  const { leaveStream } = useLiveStream();

  const socketRoomId = useAppSelector(
    (state) => state.live.lives?.[0]?.socket_room_id
  );

  const currentUser = useAppSelector(
    (state) => state.live.joinLiveResponse
  );

  const hasStoppedRef = useRef(false);

  const stopLive = useCallback(() => {
    if (hasStoppedRef.current || !socketRoomId) return;

    socket.emit("stop_live", {
      socket_room_id: socketRoomId,
    });

    hasStoppedRef.current = true;
    console.log("🛑 stop_live emitted");
  }, [socketRoomId, socket]);

  // Safety cleanup if tab closed
  useEffect(() => {
    const handleUnload = () => stopLive();
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [stopLive]);


  const handleStopLive = () => {
    stopLive();     // ✅ socket event
    leaveStream();
    dispatch(hideModal("StopLiveModal"));
    router.push("/")
  };

  return (
    <CustomDialog
      open={open}
      onClose={() => dispatch(hideModal("StopLiveModal"))}
      title="Stop Live Stream"
      maxWidth="xs"
      fullWidth
    >
      <div className="flex flex-col items-center text-center gap-5 py-5">
        {/* Warning Icon */}
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
          <FiAlertTriangle className="text-red-600 text-2xl" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Are you sure you want to stop the live stream?
          </h3>
          <p className="text-sm text-gray-500">
            Stopping the stream will immediately disconnect all viewers. This
            action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="w-full flex gap-3 px-2 pt-4">
          <button
            onClick={() => dispatch(hideModal("StopLiveModal"))}
            className="w-1/2 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleStopLive}
            className="w-1/2 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Stop Live
          </button>
        </div>
      </div>
    </CustomDialog>
  );
}

export default StopLiveModal;
