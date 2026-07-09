"use client";

import { useEffect, useState } from "react";
import { Plus, Check, X, Music, ListMusic } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  createPlaylistAction,
  addTrackToPlaylistAction,
  type Playlist,
} from "@/lib/api/playlists";

export function AddToPlaylistMenu({
  trackId,
  open,
  onClose,
}: {
  trackId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [addedTo, setAddedTo] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    (async () => {
      try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setPlaylists([]);
          setLoading(false);
          return;
        }
        const { data } = await supabase
          .from("playlists")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        setPlaylists((data ?? []) as Playlist[]);
      } catch {
        setPlaylists([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  if (!open) return null;

  const onCreate = async () => {
    setCreating(true);
    const res = await createPlaylistAction(newName);
    setCreating(false);
    if (res.playlist) {
      setPlaylists([res.playlist, ...playlists]);
      setNewName("");
      await onAdd(res.playlist.id);
    }
  };

  const onAdd = async (playlistId: string) => {
    setAdding(playlistId);
    const res = await addTrackToPlaylistAction(
      playlistId,
      trackId,
      Date.now(),
    );
    setAdding(null);
    if (!res.error) {
      setAddedTo(playlistId);
      setTimeout(() => {
        setAddedTo(null);
        onClose();
      }, 800);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-end bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-auto rounded-t-3xl bg-bg p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto h-1 w-12 rounded-full bg-muted" />
        <div className="mt-3 flex items-center justify-between">
          <h3 className="text-lg font-bold">Добавить в плейлист</h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-hover"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Новый плейлист..."
            className="flex-1 rounded-2xl border border-line bg-card px-4 h-11 text-sm outline-none placeholder:text-muted focus:border-fg"
          />
          <button
            onClick={onCreate}
            disabled={!newName.trim() || creating}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-fg text-bg disabled:opacity-40"
          >
            <Plus size={18} />
          </button>
        </div>

        <ul className="mt-4 max-h-80 overflow-y-auto space-y-1">
          {loading ? (
            <li className="text-center text-sm text-muted py-6">Загрузка…</li>
          ) : playlists.length === 0 ? (
            <li className="text-center text-sm text-muted py-6">
              Пока нет плейлистов
            </li>
          ) : (
            playlists.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => onAdd(p.id)}
                  disabled={adding === p.id}
                  className="flex w-full items-center gap-3 rounded-2xl p-2 text-left hover:bg-hover"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-card">
                    {p.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.cover_url}
                        alt=""
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : (
                      <ListMusic size={18} className="text-muted" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{p.name}</p>
                    <p className="truncate text-xs text-muted">Плейлист</p>
                  </div>
                  {adding === p.id ? (
                    <Music size={18} className="text-muted animate-pulse" />
                  ) : addedTo === p.id ? (
                    <Check size={20} className="text-fg" />
                  ) : (
                    <Plus size={18} className="text-muted" />
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
