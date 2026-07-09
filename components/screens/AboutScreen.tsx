"use client";

import { LogOut, Moon, Sun, User } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { signOutAction } from "@/lib/actions/auth";
import { useEffect, useState } from "react";
import { LogoPlain } from "@/components/branding/Logo";

type Props = {
  user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> };
};

export function AboutScreen({ user }: Props) {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const username =
    (user.user_metadata?.username as string | undefined) ??
    user.email?.split("@")[0] ??
    "user";

  return (
    <div className="mx-auto max-w-md px-4 pt-6">
      <header className="flex flex-col items-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-card">
          <User size={36} />
        </div>
        <h1 className="mt-3 text-xl font-bold">{username}</h1>
        <p className="text-sm text-muted">{user.email}</p>
      </header>

      <section className="mt-6 space-y-2">
        <button
          onClick={toggle}
          className="flex w-full items-center justify-between rounded-xl border border-line bg-card p-4 hover:bg-hover"
        >
          <span className="flex items-center gap-3 font-semibold">
            {mounted && (theme === "dark" ? <Moon size={18} /> : <Sun size={18} />)}
            Тема: {mounted ? (theme === "dark" ? "Тёмная" : "Светлая") : "—"}
          </span>
          <span className="text-sm text-muted">Переключить</span>
        </button>

        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center justify-between rounded-xl border border-line bg-card p-4 hover:bg-hover"
          >
            <span className="flex items-center gap-3 font-semibold">
              <LogOut size={18} /> Выйти
            </span>
          </button>
        </form>
      </section>

      <footer className="mt-12 flex flex-col items-center gap-2 pb-6">
        {mounted && <LogoPlain size={48} invert={theme === "dark"} />}
        <p className="text-sm font-semibold">MusArena</p>
        <p className="text-xs text-muted">made by KebiLab</p>
      </footer>
    </div>
  );
}
