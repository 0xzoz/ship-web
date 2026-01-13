import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-beacon-amber focus-visible:ring-offset-2 focus-visible:ring-offset-deep-navy disabled:cursor-not-allowed disabled:opacity-60";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-beacon-amber text-deep-navy shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:brightness-110",
  secondary:
    "border border-slate-700 text-warm-white hover:border-beacon-amber",
  ghost: "text-slate-400 hover:text-warm-white",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-7 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className ?? ""}`}
      {...props}
      disabled={props.disabled || isLoading}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-deep-navy border-t-transparent" />
      )}
      {children}
    </button>
  );
}
