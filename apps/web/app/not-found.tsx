import Link from "next/link";
import { Button } from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-deep-navy px-6 py-16 text-warm-white">
      <div className="mx-auto flex max-w-xl flex-col gap-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Lost at sea
        </p>
        <h1 className="font-display text-4xl font-semibold">
          We can&apos;t find that page
        </h1>
        <p className="text-sm text-slate-400">
          The page you requested sailed away. Let&apos;s return to the harbor.
        </p>
        <Link href="/dashboard">
          <Button>Back to dashboard</Button>
        </Link>
      </div>
    </main>
  );
}
