"use client";

import { useEffect } from "react";
import { Button } from "../components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-deep-navy px-6 py-16 text-warm-white">
      <div className="mx-auto flex max-w-xl flex-col gap-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Rough seas
        </p>
        <h1 className="font-display text-4xl font-semibold">Something broke</h1>
        <p className="text-sm text-slate-400">
          We hit unexpected turbulence. Try again or return to the harbor.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => reset()}>Retry</Button>
          <Button variant="secondary" onClick={() => (window.location.href = "/dashboard")}>
            Back to dashboard
          </Button>
        </div>
      </div>
    </main>
  );
}
