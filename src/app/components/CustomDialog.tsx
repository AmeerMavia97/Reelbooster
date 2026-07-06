"use client";
import React from "react";
import { Dialog } from "@mui/material";
import { RxCross2 } from "react-icons/rx";

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  width?: string;
}

export default function CustomDialog({
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
      sx={{ overflow: "visible" }}
      PaperProps={{
        sx: {
          p: 0,
          overflow: "visible",
          borderRadius: 3,
          position: "relative",
          ...(width ? { width } : {}),
          // ✅ responsive height handling
          maxHeight: "90vh",
          "@media (max-width:600px)": {
            maxHeight: "80vh", // smaller height on phones
            margin: "16px", // prevent edge overflow
          },
        },
      }}
    >
      {/* cross outside */}
      <button
        onClick={onClose}
        className="
          absolute -top-14 left-1/2 -translate-x-1/2
          w-11 h-11 rounded-full bg-primary flex items-center justify-center
          cursor-pointer shadow-md
        "
        style={{ zIndex: 1301 }} // higher than dialog paper
      >
        <RxCross2 className="w-6 h-6 text-dark-text font-semibold" />
      </button>

      <div className="relative w-full bg-primary rounded-xl overflow-hidden">
        {/* header / title bar */}
        {title && (
          <div className="place-items-center rounded-t-xl bg-main-green h-12 flex items-center justify-center">
            <p className="font-medium text-base text-center text-primary">
              {title}
            </p>
          </div>
        )}

        {/* dialog content */}
        <div className="">{children}</div>
      </div>
    </Dialog>
  );
}
