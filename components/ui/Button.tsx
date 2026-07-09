"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg" | "xl";

const variants: Record<Variant, string> = {
  primary: "bg-fg text-bg hover:opacity-90 active:opacity-80",
  secondary: "bg-card text-fg border border-line hover:bg-hover",
  ghost: "bg-transparent text-fg hover:bg-hover",
  outline: "bg-transparent text-fg border border-fg hover:bg-fg hover:text-bg",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-14 px-7 text-lg",
  xl: "h-16 px-8 text-xl font-semibold",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", fullWidth, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors duration-150 select-none disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
