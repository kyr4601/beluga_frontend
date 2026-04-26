import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const LOADING_LABEL = "처리 중";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-sky-500 text-white shadow-sm shadow-sky-200 hover:bg-sky-600 active:bg-sky-700",
  secondary:
    "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 active:bg-slate-100",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200",
  danger: "bg-red-500 text-white shadow-sm hover:bg-red-600 active:bg-red-700",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export function Button({
  className,
  disabled,
  isLoading = false,
  size = "md",
  type = "button",
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? LOADING_LABEL : children}
    </button>
  );
}
