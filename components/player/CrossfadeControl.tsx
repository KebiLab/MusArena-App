"use client";

import { useSettingsStore } from "@/store/settingsStore";
import { Sliders } from "lucide-react";

const OPTIONS = [0, 3, 5, 7, 10];

export function CrossfadeControl() {
  const value = useSettingsStore((s) => s.crossfadeDuration);
  const setCrossfade = useSettingsStore((s) => s.setCrossfade);

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Sliders size={14} className="text-muted" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          Crossfade
        </span>
        <span className="ml-auto text-xs text-muted">
          {value === 0 ? "выкл" : `${value}s`}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => setCrossfade(opt)}
            className={`h-9 rounded-xl text-xs font-semibold transition-colors ${
              value === opt
                ? "bg-fg text-bg"
                : "bg-card text-muted hover:bg-hover"
            }`}
          >
            {opt === 0 ? "0s" : `${opt}s`}
          </button>
        ))}
      </div>
    </div>
  );
}
