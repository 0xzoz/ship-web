/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "beacon-amber": "#f59e0b",
        "deep-navy": "#0f172a",
        "warm-white": "#f8fafc",
        "slate-400": "#94a3b8",
        "slate-600": "#475569",
        "slate-700": "#334155",
        "slate-800": "#1e293b",
        "success": "#22c55e",
        "error": "#ef4444",
        "warning": "#eab308",
        "info": "#60a5fa"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-ui)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      }
    }
  },
  plugins: []
};
