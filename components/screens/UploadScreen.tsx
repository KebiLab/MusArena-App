"use client";

import { useState, useRef, useEffect } from "react";
import { Upload as UploadIcon, X, Music, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { usePlayer } from "@/store/playerStore";
import { useRouter } from "next/navigation";

export function UploadScreen() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [duration, setDuration] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSupabase, setHasSupabase] = useState(false);
  const setQueue = usePlayer((s) => s.setQueue);

  useEffect(() => {
    setHasSupabase(
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  }, []);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setDuration(0);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    const a = new Audio(url);
    a.addEventListener("loadedmetadata", () => setDuration(a.duration));
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onPick = (f: File | null) => {
    if (!f) return;
    if (!/^audio\//.test(f.type) && !/\.(mp3|wav|ogg|m4a|flac)$/i.test(f.name)) {
      setError("Выбери аудио-файл (mp3, wav, ogg, m4a, flac).");
      return;
    }
    setError(null);
    setFile(f);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      let publicUrl: string;
      if (hasSupabase) {
        const supabase = await createClient();
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;
        if (!user) throw new Error("Необходимо войти, чтобы загружать треки");
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("tracks")
          .upload(path, file, { upsert: false });
        if (upErr) throw new Error(upErr.message);
        const { data: urlData } = supabase.storage.from("tracks").getPublicUrl(path);
        publicUrl = urlData.publicUrl;
        const { error: dbErr } = await supabase.from("tracks").insert({
          title,
          artist_name: artist,
          album_title: album || null,
          audio_url: publicUrl,
          duration,
          cover_url: null,
          uploaded_by: user.id,
        });
        if (dbErr) throw new Error(dbErr.message);
      } else {
        publicUrl = URL.createObjectURL(file);
      }

      setQueue([
        {
          id: `local-${Date.now()}`,
          title: title || file.name,
          artist: artist || "Unknown",
          album: album || null,
          cover_url: null,
          audio_url: publicUrl,
          duration: duration || 0,
          lyrics_lrc: null,
        },
      ]);

      router.push("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 pt-6">
      <h1 className="text-2xl font-extrabold">Upload track</h1>
      <p className="mt-1 text-sm text-muted">
        {hasSupabase
          ? "Файл уйдёт в Supabase Storage и появится в твоей библиотеке."
          : "Supabase не настроен — файл будет доступен только локально (blob URL)."}
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            onPick(e.dataTransfer.files[0] ?? null);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`flex h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-colors ${
            dragOver ? "border-fg bg-hover" : "border-line bg-card"
          }`}
        >
          {file ? (
            <div className="flex items-center gap-3 px-4">
              <Music size={28} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{file.name}</p>
                <p className="text-xs text-muted">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                  {duration > 0 && ` · ${Math.round(duration)}s`}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-hover"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <UploadIcon size={32} className="text-muted" />
              <p className="text-sm font-semibold">Перетащи файл сюда</p>
              <p className="text-xs text-muted">или нажми, чтобы выбрать</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => onPick(e.target.files?.[0] ?? null)}
          />
        </div>

        {previewUrl && (
          <audio src={previewUrl} controls className="w-full" />
        )}

        <Input
          label="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My track"
          required
        />
        <Input
          label="Артист"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Unknown"
        />
        <Input
          label="Альбом (опц.)"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          placeholder="Single"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" size="lg" fullWidth disabled={!file || uploading}>
          {uploading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Загружаем…
            </>
          ) : (
            "Загрузить"
          )}
        </Button>
      </form>
    </div>
  );
}
