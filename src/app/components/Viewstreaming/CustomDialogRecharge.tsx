"use client";
import React from "react";
import { Dialog, Slide, DialogProps } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { TransitionProps } from "@mui/material/transitions";

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  width?: string;
}

// Slide transition from right
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function CustomDialogRecharge({
  open,
  onClose,
  children,
  title,
  maxWidth = "sm",
  fullWidth = true,
  width,
}: CustomDialogProps) {
  return (

<Dialog
  open={open}
  onClose={onClose}
  fullWidth={fullWidth}
  maxWidth={maxWidth}
  TransitionComponent={Transition}
  BackdropProps={{
    sx: {
      backgroundColor: "transparent",
    },
  }}
  PaperProps={{
    sx: {
      borderRadius: 3,
      position: "fixed",
      top: { xs: "50%", md: "10%" },
      left: { xs: "50%", md: "auto" },
      right: { md: "1.5%" },
      transform: {
        xs: "translate(-50%, -50%)",
        md: "none",
      },
      width: {
        xs: "95%",
        sm: "500px",
        md: "420px",
        lg: "480px",
      },
      maxHeight: {
        xs: "85vh",
        md: "80vh",
      },
      overflow: "visible", // 🔥 IMPORTANT
    },
  }}
>



      {/* Close Button */}
      <button
        onClick={onClose}
        className="
          absolute    top-[-3rem] z-50   left-[53%]  md:-translate-x-full
          w-10 h-10 rounded-full bg-primary flex items-center justify-center
          cursor-pointer shadow-md
        "
        style={{ zIndex: 1400 }}
      >
        <RxCross2 className="w-6 h-6 text-dark-text font-semibold" />
      </button>

      <div className="relative w-full bg-primary rounded-xl overflow-hidden flex flex-col">

        {/* Header (fixed height, no scroll) */}
        {title && (
          <div className="bg-main-green h-12 flex items-center justify-center shrink-0">
            <p className="font-medium text-base text-primary">{title}</p>
          </div>
        )}

        {/* Scrollable content */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            maxHeight: "calc(80vh - 3rem)", // adjust if header height changes
          }}
        >
          {children}
        </div>

      </div>

    </Dialog>
  );
}
