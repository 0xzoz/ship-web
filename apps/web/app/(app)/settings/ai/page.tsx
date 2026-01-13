import { SettingsTabs } from "../../../../components/settings/SettingsTabs";
import { ConnectionsPanel } from "../../../../components/settings/ConnectionsPanel";

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
      <ConnectionsPanel />
    </div>
  );
}
