"use client";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe, logout } from "../../lib/auth";
import { Dropdown, DropdownItem } from "../ui/Dropdown";

export function AccountMenu() {
  const router = useRouter();
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
    <Dropdown
      trigger={
        <button
          className="flex items-center gap-3 rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-400 hover:text-warm-white"
          type="button"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-warm-white">
            {initials}
          </span>
          <span className="hidden md:inline">{user?.email ?? "Account"}</span>
        </button>
      }
    >
      <div className="px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-400">
        Captain
      </div>
      <div className="px-3 py-2 text-sm text-warm-white">
        {user?.name ?? user?.email ?? "Signed in"}
      </div>
      <DropdownItem onSelect={() => router.push("/settings/account")}>
        Settings
      </DropdownItem>
      <DropdownItem onSelect={handleLogout}>Log out</DropdownItem>
    </Dropdown>
  );
}
