"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";
import { PlayerView } from "@/components/player/PlayerView";
import { AudioSurface } from "./AudioSurface";
import { ThemeSync } from "@/components/theme/ThemeSync";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { SettingsSync } from "@/components/settings/SettingsSync";

const HIDE_NAV_PREFIXES = ["/", "/loading", "/get-started", "/choose-mode", "/sign-in", "/register", "/offline"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav = !HIDE_NAV_PREFIXES.some((p) => pathname === p || (p !== "/" && pathname?.startsWith(p)));

  return (
    <div className="relative flex-1 flex flex-col">
      <ThemeSync />
      <SettingsSync />
      <AudioSurface />
      <main className="flex-1 pb-[120px]">{children}</main>
      {showNav && (
        <>
          <PlayerView />
          <BottomNav />
        </>
      )}
      {showNav && <InstallPrompt />}
    </div>
  );
}
