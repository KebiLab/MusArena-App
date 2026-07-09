import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: number;
  className?: string;
  showWordmark?: boolean;
  variant?: "auto" | "light" | "dark";
};

export function Logo({
  size = 64,
  className,
  showWordmark = false,
  variant = "auto",
}: LogoProps) {
  const isDark =
    variant === "auto"
      ? typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark")
      : variant === "dark";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src="/logo.jpg"
        alt="MusArena"
        width={size}
        height={size}
        className={cn(
          "rounded-md object-contain",
          isDark ? "invert" : "",
        )}
        priority
      />
      {showWordmark && (
        <span className="text-2xl font-bold tracking-tight">MusArena</span>
      )}
    </div>
  );
}

export function LogoPlain({
  size = 64,
  className,
  invert = false,
}: {
  size?: number;
  className?: string;
  invert?: boolean;
}) {
  return (
    <Image
      src="/logo.jpg"
      alt="MusArena"
      width={size}
      height={size}
      className={cn(
        "rounded-md object-contain",
        invert ? "invert" : "",
        className,
      )}
      priority
    />
  );
}
