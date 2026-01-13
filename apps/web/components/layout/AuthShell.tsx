import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-deep-navy px-6 py-16 text-warm-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <header className="flex items-center justify-between">
          <span className="font-display text-2xl font-semibold tracking-wide">
            Ship
          </span>
          <span className="text-xs uppercase tracking-[0.4em] text-slate-400">
            Your crew is waiting
          </span>
        </header>

        <div className="grid gap-8 md:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Harbor access
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
              {title}
            </h1>
            <p className="max-w-md text-lg text-slate-400">{subtitle}</p>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-800 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.45)]">
            <div className="space-y-6">
              {children}
              <div className="border-t border-slate-700 pt-4 text-sm text-slate-400">
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
