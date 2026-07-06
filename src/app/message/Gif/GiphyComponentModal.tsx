import { Dialog, DialogContent } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import GiphyComponent from "./GiphyComponent";
import { updateSendMessageData } from "@/app/store/Slice/SendMessageSlice";

export default function GiphyComponentModal() {
  const dispatch = useAppDispatch();

  const close = () => {
    dispatch(updateSendMessageData({ showGifPicker: false }));
  };

  const open = useAppSelector((state) => state.SendMessageData.showGifPicker) ?? false;

  return (
    <Dialog
      open={open}
      onClose={close}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className:
          "rounded-xl bg-modalBg backdrop-blur shadow-lg overflow-hidden",
        style: {
          maxHeight: '80vh',
        },
      }}
    >
      <DialogContent>
        <GiphyComponent />
      </DialogContent>
    </Dialog>
  );
}
