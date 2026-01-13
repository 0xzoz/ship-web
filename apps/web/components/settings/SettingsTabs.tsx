import Link from "next/link";

type SettingsTabsProps = {
  active: "account" | "ai";
};

export function SettingsTabs({ active }: SettingsTabsProps) {
  const base =
    "rounded-full border px-4 py-2 text-sm font-semibold transition";

  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/settings/account"
        className={`${base} ${
          active === "account"
            ? "border-beacon-amber text-warm-white"
            : "border-slate-700 text-slate-400 hover:border-beacon-amber hover:text-warm-white"
        }`}
      >
        Account
      </Link>
      <Link
        href="/settings/ai"
        className={`${base} ${
          active === "ai"
            ? "border-beacon-amber text-warm-white"
            : "border-slate-700 text-slate-400 hover:border-beacon-amber hover:text-warm-white"
        }`}
      >
        AI Connections
      </Link>
    </div>
  );
}
