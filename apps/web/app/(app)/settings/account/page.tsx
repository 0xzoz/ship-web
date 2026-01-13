import { SettingsTabs } from "../../../../components/settings/SettingsTabs";
import { AccountForm } from "../../../../components/settings/AccountForm";

export default function AccountSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Settings
        </p>
        <h1 className="font-display text-3xl font-semibold md:text-4xl">
          Account management
        </h1>
      </div>
      <SettingsTabs active="account" />
      <AccountForm />
    </div>
  );
}
