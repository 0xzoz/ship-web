"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import type { ReactNode } from "react";

type ToastProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: "success" | "error";
};

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {children}
      <ToastPrimitive.Viewport className="fixed bottom-6 right-6 z-50 flex w-[360px] max-w-[90vw] flex-col gap-3" />
    </ToastPrimitive.Provider>
  );
}

export function Toast({ open, onOpenChange, title, description, variant }: ToastProps) {
  const tone =
    variant === "error"
      ? "border-error/60 bg-error/10 text-error"
      : "border-success/60 bg-success/10 text-success";

  return (
    <ToastPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      className={`rounded-2xl border px-4 py-3 shadow-[0_20px_40px_rgba(15,23,42,0.35)] ${tone}`}
    >
      <ToastPrimitive.Title className="text-sm font-semibold">
        {title}
      </ToastPrimitive.Title>
      {description && (
        <ToastPrimitive.Description className="text-sm opacity-80">
          {description}
        </ToastPrimitive.Description>
      )}
    </ToastPrimitive.Root>
  );
}
