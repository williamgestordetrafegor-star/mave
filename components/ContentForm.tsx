"use client";

import { useState } from "react";
import type { GenerateRequest } from "@/lib/schemas";

type Props = {
  loading: boolean;
  onSubmit: (req: GenerateRequest) => void;
};

export default function ContentForm({ loading, onSubmit }: Props) {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] =
    useState<GenerateRequest["platform"]>("reels");
  const [tone, setTone] = useState<GenerateRequest["tone"]>("educativo");
  const [duration, setDuration] =
    useState<GenerateRequest["duration"]>(30);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (topic.trim().length < 3) return;
    onSubmit({ topic: topic.trim(), platform, tone, duration });
  }

  return (
    <form onSubmit={handleSubmit} className="panel p-6 space-y-5">
      <div>
        <label className="block text-sm font-medium mb-2 text-muted">
          Tema / nicho
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="ex: receita fitness de 5 minutos para quem acorda sem tempo"
          rows={3}
          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/60"
          required
          minLength={3}
          maxLength={500}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-2 text-muted">
            Plataforma
          </label>
          <select
            value={platform}
            onChange={(e) =>
              setPlatform(e.target.value as GenerateRequest["platform"])
            }
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/60"
          >
            <option value="reels">Instagram Reels</option>
            <option value="shorts">YouTube Shorts</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-muted">
            Duração
          </label>
          <select
            value={duration}
            onChange={(e) =>
              setDuration(Number(e.target.value) as GenerateRequest["duration"])
            }
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/60"
          >
            <option value={15}>15 segundos</option>
            <option value={30}>30 segundos</option>
            <option value={60}>60 segundos</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-muted">Tom</label>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { value: "educativo", label: "Educativo" },
              { value: "humor", label: "Humor" },
              { value: "inspirador", label: "Inspirador" },
              { value: "vendas", label: "Vendas" },
            ] as const
          ).map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTone(t.value)}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                tone === t.value
                  ? "border-accent bg-accent/15 text-white"
                  : "border-border bg-bg text-muted hover:text-white hover:border-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || topic.trim().length < 3}
        className="w-full rounded-lg bg-gradient-to-r from-accent to-accent2 px-4 py-3 font-medium text-white shadow-lg shadow-accent/20 transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Gerando..." : "Gerar roteiro"}
      </button>
    </form>
  );
}
