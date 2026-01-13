import type { ReactNode } from "react";
import Link from "next/link";
import { QueryProvider } from "../../components/providers/QueryProvider";
import { AccountMenu } from "../../components/nav/AccountMenu";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-deep-navy text-warm-white">
        <header className="border-b border-slate-700/60 bg-slate-800/30">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="font-display text-2xl font-semibold tracking-wide"
              >
                Ship
              </Link>
              <span className="hidden text-xs uppercase tracking-[0.4em] text-slate-400 md:inline">
                Your harbor
              </span>
            </div>
            <AccountMenu />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      </div>
    </QueryProvider>
  );
}
