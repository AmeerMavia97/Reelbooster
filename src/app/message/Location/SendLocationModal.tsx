
import { updateMessageOptions } from "@/app/store/Slice/MessageOptionsSlice";
import { Dialog } from "@mui/material";
import { useAppDispatch,useAppSelector } from "@/app/utils/hooks";
import SearchLocationDropdown from "./SearchLocationDropdown";

export default function SendLocationModal() {
  const dispatch = useAppDispatch();
  const MessageOptionsData = useAppSelector((state) => state.MessageOptions);

  const close = () => {
    dispatch(updateMessageOptions({ show_send_location_modal: false }));
  };

  return (
    <Dialog
      open={MessageOptionsData.show_send_location_modal}
      className="relative z-10"
      onClose={close}
    >
      <div className=" z-10 flex min-h-full items-center justify-center p-4 backdrop-blur-sm">
        <div className="data-[closed]:transform-[scale(95%)] max-h-[80vh] w-full max-w-lg rounded-xl bg-modalBg overflow-hidden shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out data-[closed]:opacity-0">
          <SearchLocationDropdown />
        </div>
      </div>
    </Dialog>
  );
}


