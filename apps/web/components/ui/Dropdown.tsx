"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";

type DropdownProps = {
  trigger: ReactNode;
  children: ReactNode;
};

export function Dropdown({ trigger, children }: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={10}
          className="rounded-2xl border border-slate-700 bg-slate-800 p-2 shadow-[0_20px_40px_rgba(15,23,42,0.55)]"
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function DropdownItem({
  onSelect,
  children,
}: {
  onSelect?: () => void;
  children: ReactNode;
}) {
  return (
    <DropdownMenu.Item
      onSelect={(event) => {
        event.preventDefault();
        onSelect?.();
      }}
      className="cursor-pointer rounded-xl px-3 py-2 text-sm text-slate-400 outline-none transition hover:bg-slate-700/60 hover:text-warm-white"
    >
      {children}
    </DropdownMenu.Item>
  );
}
