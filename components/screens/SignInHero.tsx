"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useThemeStore } from "@/store/themeStore";

export function SignInHero() {
  const theme = useThemeStore((s) => s.theme);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative h-56 w-full shrink-0 overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&auto=format&fit=crop&q=70"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg" />
      <div className="absolute inset-x-0 top-10 flex items-center justify-center">
        <div className="flex items-center gap-3">
          {mounted && (
            <Image
              src="/logo.jpg"
              alt="MusArena"
              width={56}
              height={56}
              className={`rounded-2xl object-contain ${theme === "dark" ? "invert" : ""}`}
              priority
            />
          )}
          <span className="text-4xl font-extrabold tracking-tight">MusArena</span>
        </div>
      </div>
    </div>
  );
}
