import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { AppShell } from "@/components/layout/AppShell";
import { RegisterSW } from "@/components/pwa/RegisterSW";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://musarena.vercel.app"),
  title: "MusArena — made by KebiLab",
  description:
    "MusArena — твой Spotify-аналог. Слушай музыку, загружай свои треки. made by KebiLab.",
  applicationName: "MusArena",
  authors: [{ name: "KebiLab" }],
  keywords: ["MusArena", "music", "streaming", "KebiLab"],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MusArena",
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "MusArena — made by KebiLab",
    description: "Твой Spotify-аналог. made by KebiLab.",
    type: "website",
    images: ["/icon-512.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className="min-h-full flex flex-col bg-bg text-fg"
        suppressHydrationWarning
      >
        <AppShell>{children}</AppShell>
        <RegisterSW />
        <footer className="text-center text-xs text-muted py-4">
          made by KebiLab
        </footer>
      </body>
    </html>
  );
}
