"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const STORAGE_KEY = "musarena-install-dismissed";

export function InstallPrompt() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [iosVisible, setIosVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY) === "1") {
      setDismissed(true);
      return;
    }

    // Android / Chrome / Edge — beforeinstallprompt
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // iOS Safari — нет события, нужен manual hint
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isIos && !isStandalone) {
      // Показываем подсказку через 2 сек после загрузки
      const t = setTimeout(() => setIosVisible(true), 2000);
      return () => clearTimeout(t);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    };
  }, []);

  if (dismissed) return null;

  const onInstall = async () => {
    if (!evt) return;
    await evt.prompt();
    const { outcome } = await evt.userChoice;
    if (outcome === "accepted") {
      setEvt(null);
    }
  };

  const onDismiss = () => {
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  if (iosVisible) {
    return (
      <div className="fixed inset-x-0 bottom-20 z-40 mx-auto max-w-md px-4">
        <div className="rounded-2xl border border-line bg-card p-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-fg text-bg">
              <Download size={18} />
            </div>
            <div className="flex-1 text-sm">
              <p className="font-semibold">Установи MusArena</p>
              <p className="mt-1 text-muted">
                Нажми{" "}
                <span className="inline-flex items-center rounded bg-hover px-1.5 py-0.5 font-mono text-xs">
                  ⬆
                </span>{" "}
                в Safari → <b>Add to Home Screen</b>
              </p>
            </div>
            <button
              onClick={onDismiss}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-hover"
              aria-label="Закрыть"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!evt) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 z-40 mx-auto max-w-md px-4">
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-card p-3 shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon-192.png" alt="" className="h-12 w-12 rounded-xl" />
        <div className="flex-1 min-w-0">
          <p className="truncate font-semibold text-sm">Установи MusArena</p>
          <p className="truncate text-xs text-muted">
            Быстрый доступ с домашнего экрана
          </p>
        </div>
        <Button size="sm" onClick={onInstall} className="rounded-xl">
          Установить
        </Button>
        <button
          onClick={onDismiss}
          className="grid h-8 w-8 place-items-center rounded-full hover:bg-hover"
          aria-label="Закрыть"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
