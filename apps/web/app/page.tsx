export default function HomePage() {
  return (
    <main className="min-h-screen bg-deep-navy px-6 py-16 text-warm-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="flex items-center justify-between">
          <div className="font-display text-2xl font-semibold tracking-wide">
            Ship
          </div>
          <button className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-400 hover:border-beacon-amber hover:text-warm-white">
            Start your first voyage
          </button>
        </header>

        <section className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Your agents. Your rules.
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight md:text-6xl">
              Ship real software. Understand how.
            </h1>
            <p className="max-w-xl text-lg text-slate-400">
              An AI crew that builds alongside you, making every step of the
              voyage clear, deliberate, and entirely yours.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-full bg-beacon-amber px-6 py-3 text-sm font-semibold text-deep-navy shadow-[0_0_25px_rgba(245,158,11,0.35)]">
                Start your first voyage
              </button>
              <button className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-warm-white hover:border-beacon-amber">
                Meet the crew
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.45)]">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Voyage status</span>
                <span className="rounded-full bg-slate-700 px-2 py-1 text-xs text-warm-white">
                  Draft
                </span>
              </div>
              <div className="space-y-2">
                <p className="font-display text-2xl font-semibold">
                  Field Survey App
                </p>
                <p className="text-sm text-slate-400">
                  Discovery in progress. Claude is mapping your requirements.
                </p>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full rounded-full bg-slate-700">
                  <div className="h-2 w-2/3 rounded-full bg-beacon-amber" />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Discovery</span>
                  <span>66%</span>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-700/40 p-4 text-xs text-slate-400">
                "Before we build, tell me who will use this in the field?"
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
