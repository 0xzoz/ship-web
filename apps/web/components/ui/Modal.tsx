"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
};

export function Modal({ open, onOpenChange, title, description, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-deep-navy/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-700 bg-slate-800 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.55)]">
          <div className="space-y-2">
            <Dialog.Title className="font-display text-2xl font-semibold">
              {title}
            </Dialog.Title>
            {description && (
              <Dialog.Description className="text-sm text-slate-400">
                {description}
              </Dialog.Description>
            )}
          </div>
          <div className="mt-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
