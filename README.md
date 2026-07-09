# MusArena

Spotify-аналог. Mobile-first web app на Next.js. Сделано KebiLab.

## Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (ЧБ-палитра, light/dark темы)
- Supabase (Auth + Postgres + Storage) — для загрузки треков
- Zustand (плеер), Framer Motion (анимации), lucide-react (иконки)

## Setup

```bash
npm install
cp .env.example .env.local
# заполни NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY
# в Supabase SQL Editor выполни supabase/schema.sql
npm run dev
```

## Deploy

```bash
vercel --prod
```

Деплой на Vercel: [musarena.vercel.app](https://musarena.vercel.app)

## Features
- Loading → Get Started → Choose Mode (Dark/Light) → Auth
- Главная: вкладки News/Video/Artists/Podcasts, hero-карточка, плейлист
- Плеер: мини + полноэкранный с обложкой, прогрессом, контролами
- Lyrics поверх блюра обложки
- Страница артиста с альбомами и треками
- Library: твои плейлисты и загруженные треки
- Upload: drag-and-drop, аудио уезжает в Supabase Storage
- Light/Dark тема (ЧБ-палитра, переключатель)
- Footer: "made by KebiLab"

## Branding
Логотип: `public/logo.jpg` (мусарналого.jpg, инвертируется на тёмной теме)
Везде: "MusArena" вместо "Spotify", "made by KebiLab" в футере.

made by KebiLab
