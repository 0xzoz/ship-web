import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-warm-white placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-beacon-amber ${className ?? ""}`}
      {...props}
    />
  );
});
