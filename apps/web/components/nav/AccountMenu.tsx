"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe, logout } from "../../lib/auth";

export function AccountMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const initials =
    user?.name?.trim()?.[0] ??
    user?.email?.trim()?.[0]?.toUpperCase() ??
    "S";

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-3 rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-400 hover:text-warm-white"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-warm-white">
          {initials}
        </span>
        <span className="hidden md:inline">{user?.email ?? "Account"}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-700 bg-slate-800 p-3 shadow-[0_20px_40px_rgba(15,23,42,0.55)]">
          <p className="px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-400">
            Captain
          </p>
          <div className="px-3 py-2 text-sm text-warm-white">
            {user?.name ?? user?.email ?? "Signed in"}
          </div>
          <button
            className="mt-2 w-full rounded-xl border border-slate-700 px-3 py-2 text-left text-sm text-slate-400 hover:border-beacon-amber hover:text-warm-white"
            onClick={handleLogout}
            type="button"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
