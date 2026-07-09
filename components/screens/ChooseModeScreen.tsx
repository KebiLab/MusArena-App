"use client";

import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useEffect, useState } from "react";
import { LogoPlain } from "@/components/branding/Logo";
import { Button } from "@/components/ui/Button";

export function ChooseModeScreen() {
  const router = useRouter();
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-bg">
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-center pt-14">
          {mounted ? (
            <LogoPlain size={56} invert={theme === "dark"} />
          ) : (
            <div className="h-14 w-14 rounded-md bg-hover" />
          )}
          <span className="ml-3 text-3xl font-extrabold tracking-tight">MusArena</span>
        </header>

        <div className="mt-auto px-6 pb-10">
          <h2 className="text-center text-2xl font-bold">Choose Mode</h2>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <button
              onClick={() => setTheme("dark")}
              className={`flex flex-col items-center gap-3 rounded-2xl p-6 transition-colors ${
                theme === "dark" ? "bg-fg text-bg" : "bg-card border border-line"
              }`}
            >
              <Moon size={28} />
              <span className="font-semibold">Dark Mode</span>
            </button>
            <button
              onClick={() => setTheme("light")}
              className={`flex flex-col items-center gap-3 rounded-2xl p-6 transition-colors ${
                theme === "light" ? "bg-fg text-bg" : "bg-card border border-line"
              }`}
            >
              <Sun size={28} />
              <span className="font-semibold">Light Mode</span>
            </button>
          </div>

          <Button
            size="xl"
            fullWidth
            className="mt-8"
            onClick={() => router.push("/sign-in")}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
