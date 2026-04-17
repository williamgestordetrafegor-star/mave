import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mave — Roteiros para Reels, Shorts e TikTok",
  description:
    "Gere hooks, roteiros, legendas e hashtags para vídeos verticais curtos com IA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
