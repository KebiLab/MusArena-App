"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toggleLikeAction } from "@/lib/api/likes";

export function LikeButton({
  trackId,
  size = 22,
  showLabel = false,
}: {
  trackId: string;
  size?: number;
  showLabel?: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cache = JSON.parse(
      localStorage.getItem("musarena-likes") || "[]",
    ) as string[];
    setLiked(cache.includes(trackId));
  }, [trackId]);

  const onClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    const next = !liked;
    setLiked(next);
    setPulse(true);
    setTimeout(() => setPulse(false), 350);

    // optimistic cache
    const cache = JSON.parse(
      localStorage.getItem("musarena-likes") || "[]",
    ) as string[];
    const newCache = next
      ? [...new Set([...cache, trackId])]
      : cache.filter((id) => id !== trackId);
    localStorage.setItem("musarena-likes", JSON.stringify(newCache));

    const res = await toggleLikeAction(trackId, next);
    if (res.error) {
      // rollback
      setLiked(!next);
      const rollback = next
        ? cache.filter((id) => id !== trackId)
        : [...new Set([...cache, trackId])];
      localStorage.setItem("musarena-likes", JSON.stringify(rollback));
    }
    setBusy(false);
  };

  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={`grid h-10 w-10 place-items-center rounded-full transition-transform ${
        liked ? "text-fg" : "text-muted hover:text-fg"
      } ${pulse ? "scale-125" : "scale-100"}`}
      aria-label={liked ? "Убрать из понравившихся" : "В понравившиеся"}
    >
      <Heart
        size={size}
        fill={liked ? "currentColor" : "none"}
        strokeWidth={liked ? 1.5 : 2}
      />
      {showLabel && (
        <span className="ml-2 text-sm font-semibold">
          {liked ? "В понравившихся" : "В понравившиеся"}
        </span>
      )}
    </button>
  );
}
