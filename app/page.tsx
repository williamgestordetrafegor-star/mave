"use client";

import { useState } from "react";
import ContentForm from "@/components/ContentForm";
import ContentOutput from "@/components/ContentOutput";
import type { GenerateRequest, GeneratedContent } from "@/lib/schemas";

export default function Home() {
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(req: GenerateRequest) {
    setLoading(true);
    setError(null);
    setContent(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Erro ao gerar conteúdo.");
        return;
      }
      setContent(data.content as GeneratedContent);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro de rede.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="gradient-text">Mave</span>
          </h1>
          <p className="text-muted mt-2 text-sm md:text-base">
            Roteiros prontos para Reels, Shorts e TikTok, gerados com Claude.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-[minmax(0,420px)_1fr]">
          <div className="md:sticky md:top-6 md:self-start">
            <ContentForm loading={loading} onSubmit={handleGenerate} />
          </div>
          <ContentOutput
            content={content}
            loading={loading}
            error={error}
          />
        </div>

        <footer className="mt-16 text-center text-xs text-muted">
          Feito com Next.js + Claude API
        </footer>
      </div>
    </main>
  );
}
