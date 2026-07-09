"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useThemeStore } from "@/store/themeStore";
import { useEffect, useState } from "react";

export function GetStartedScreen() {
  const router = useRouter();
  const theme = useThemeStore((s) => s.theme);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="fixed inset-0 w-full overflow-hidden bg-bg">
      <Image
        src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=70"
        alt=""
        fill
        priority
        sizes="100vw"
        className={`object-cover ${mounted && theme === "dark" ? "opacity-30" : "opacity-40"}`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/40 to-bg" />

      <div className="relative z-10 flex h-full flex-col">
        <header className="flex items-center justify-center pt-14">
          <div className="flex items-center gap-3">
            {mounted && (
              <Image
                src="/logo.jpg"
                alt="MusArena"
                width={44}
                height={44}
                className={`rounded-2xl object-contain ${theme === "dark" ? "invert" : ""}`}
                priority
              />
            )}
            <span className="text-3xl font-extrabold tracking-tight">MusArena</span>
          </div>
        </header>

        <div className="mt-auto px-6 pb-10">
          <h1 className="text-3xl font-bold leading-tight">Enjoy Listening To Music</h1>
          <p className="mt-3 text-base text-muted max-w-sm">
            MusArena — твой личный музыкальный стриминг. Слушай, открывай, загружай своё.
          </p>
          <Button
            size="xl"
            fullWidth
            className="mt-8 rounded-2xl"
            onClick={() => router.push("/choose-mode")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
