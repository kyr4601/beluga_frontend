import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
}

export function Input({
  className,
  errorMessage,
  id,
  label,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block w-full" htmlFor={inputId}>
      {label ? (
        <span className="mb-2 block text-sm font-semibold text-slate-800">
          {label}
        </span>
      ) : null}
      <input
        className={cn(
          "h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-base text-slate-950 outline-none transition",
          "placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100",
          "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
          errorMessage && "border-red-300 focus:border-red-400 focus:ring-red-100",
          className,
        )}
        id={inputId}
        {...props}
      />
      {errorMessage ? (
        <span className="mt-2 block text-sm font-medium text-red-500">
          {errorMessage}
        </span>
      ) : null}
    </label>
  );
}
