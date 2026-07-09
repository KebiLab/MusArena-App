"use client";

export default function OfflinePage() {
  return (
    <div className="grid min-h-screen place-items-center bg-bg p-6 text-center">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.jpg"
          alt="MusArena"
          className="mx-auto h-20 w-20 rounded-2xl"
        />
        <h1 className="mt-4 text-2xl font-bold">Нет соединения</h1>
        <p className="mt-2 text-sm text-muted max-w-sm">
          MusArena нужен интернет для поиска и стриминга. Подключись к сети и
          попробуй снова.
        </p>
        <button
          onClick={() => location.reload()}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-fg px-6 font-semibold text-bg"
        >
          Повторить
        </button>
        <p className="mt-8 text-xs text-muted">made by KebiLab</p>
      </div>
    </div>
  );
}
