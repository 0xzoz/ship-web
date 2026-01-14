import { DiscoveryChat } from "../../../../../components/discovery/DiscoveryChat";

export default function DiscoveryPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Discovery Phase
        </p>
        <h1 className="font-display text-3xl font-semibold md:text-4xl">
          Clarify the voyage
        </h1>
      </div>
      <DiscoveryChat />
    </div>
  );
}
