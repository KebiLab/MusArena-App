"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoPlain } from "@/components/branding/Logo";
import { useThemeStore } from "@/store/themeStore";

export function LoadingScreen() {
  const router = useRouter();
  const theme = useThemeStore((s) => s.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const t = setTimeout(() => router.replace("/get-started"), 1400);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="fixed inset-0 grid place-items-center bg-bg">
      <div className="animate-pulse-logo">
        {mounted ? (
          <LogoPlain size={96} invert={theme === "dark"} />
        ) : (
          <div className="h-24 w-24 rounded-md bg-hover" />
        )}
      </div>
    </div>
  );
}
