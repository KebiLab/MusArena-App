import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "MusArena — made by KebiLab",
  description:
    "MusArena — твой Spotify-аналог. Слушай музыку, загружай свои треки. made by KebiLab.",
  applicationName: "MusArena",
  authors: [{ name: "KebiLab" }],
  keywords: ["MusArena", "music", "streaming", "KebiLab"],
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "MusArena — made by KebiLab",
    description: "Твой Spotify-аналог. made by KebiLab.",
    type: "website",
    images: ["/logo.jpg"],
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
      </head>
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <AppShell>{children}</AppShell>
        <footer className="text-center text-xs text-muted py-4">
          made by KebiLab
        </footer>
      </body>
    </html>
  );
}
