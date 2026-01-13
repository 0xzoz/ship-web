import { SettingsTabs } from "../../../../components/settings/SettingsTabs";

export default function AiConnectionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Settings
        </p>
        <h1 className="font-display text-3xl font-semibold md:text-4xl">
          AI Connections
        </h1>
      </div>
      <SettingsTabs active="ai" />
      <div className="rounded-3xl border border-slate-700 bg-slate-800/60 p-8 text-sm text-slate-400">
        AI connections will be available in Batch 4.
      </div>
    </div>
  );
}
