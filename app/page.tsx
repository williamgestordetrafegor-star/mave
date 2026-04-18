"use client";

import { useState } from "react";
import ContentForm from "@/components/ContentForm";
import ContentOutput from "@/components/ContentOutput";
import { ContentSchema } from "@/lib/schemas";
import type { GenerateRequest, GeneratedContent } from "@/lib/schemas";

const REQUEST_TIMEOUT_MS = 90_000;

export default function Home() {
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(req: GenerateRequest) {
    setLoading(true);
    setError(null);
    setContent(null);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
        signal: controller.signal,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Erro ao gerar conteúdo.");
        return;
      }
      const validated = ContentSchema.safeParse(data.content);
      if (!validated.success) {
        setError("Resposta inválida do servidor.");
        return;
      }
      setContent(validated.data);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        setError("Tempo esgotado. Tente novamente.");
      } else {
        setError(e instanceof Error ? e.message : "Erro de rede.");
      }
    } finally {
      clearTimeout(timeoutId);
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
