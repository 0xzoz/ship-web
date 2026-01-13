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
      spacing: {
        4: "4px",
        8: "8px",
        12: "12px",
        16: "16px",
        24: "24px",
        32: "32px",
        48: "48px",
        64: "64px",
        96: "96px"
      },
      height: {
        8: "32px",
        10: "40px",
        12: "48px"
      },
      width: {
        8: "32px",
        10: "40px",
        12: "48px"
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
