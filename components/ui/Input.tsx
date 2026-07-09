"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, className, id, ...rest },
  ref,
) {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-fg/80 px-1"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "h-12 w-full rounded-xl bg-card border border-line px-4 text-fg placeholder:text-muted focus:outline-none focus:border-fg transition-colors",
          error ? "border-red-500" : "",
          className,
        )}
        {...rest}
      />
      {error && <span className="text-xs text-red-500 px-1">{error}</span>}
    </div>
  );
});
