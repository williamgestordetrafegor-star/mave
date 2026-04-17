"use client";

import { useState } from "react";
import type { GeneratedContent } from "@/lib/schemas";

type Props = {
  content: GeneratedContent | null;
  loading: boolean;
  error: string | null;
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="text-xs text-muted hover:text-white transition px-2 py-1 rounded border border-border hover:border-muted"
    >
      {copied ? "copiado" : "copiar"}
    </button>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="panel p-5 space-y-3">
      <header className="flex items-center justify-between">
        <h3 className="font-semibold tracking-wide uppercase text-xs text-muted">
          {title}
        </h3>
        {action}
      </header>
      {children}
    </section>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="panel p-5 space-y-3">
          <div className="h-3 w-24 bg-border rounded animate-pulse" />
          <div className="h-4 w-full bg-border rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-border rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function ContentOutput({ content, loading, error }: Props) {
  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="panel p-5 border-red-500/40 bg-red-500/10 text-red-200 text-sm">
        {error}
      </div>
    );
  }

  if (!content) {
    return (
      <div className="panel p-8 text-center text-muted text-sm">
        Preencha o formulário ao lado e clique em{" "}
        <span className="text-white">Gerar roteiro</span> para começar.
      </div>
    );
  }

  const hashtagsText = content.hashtags.map((h) => `#${h}`).join(" ");
  const scriptText = content.script
    .map(
      (s) =>
        `Cena ${s.scene}\nVisual: ${s.visual}\nVoz: ${s.voiceover}${
          s.onScreenText ? `\nTexto na tela: ${s.onScreenText}` : ""
        }`,
    )
    .join("\n\n");
  const fullText = [
    `HOOK\n${content.hook}`,
    `ROTEIRO\n${scriptText}`,
    `LEGENDA\n${content.caption}`,
    `CTA\n${content.cta}`,
    `HASHTAGS\n${hashtagsText}`,
  ].join("\n\n");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CopyButton text={fullText} />
      </div>

      <Section title="Hook" action={<CopyButton text={content.hook} />}>
        <p className="text-lg font-medium leading-snug">{content.hook}</p>
      </Section>

      <Section title="Roteiro" action={<CopyButton text={scriptText} />}>
        <ol className="space-y-4">
          {content.script.map((s) => (
            <li
              key={s.scene}
              className="border-l-2 border-accent/60 pl-4 space-y-1"
            >
              <div className="text-xs uppercase text-muted">
                Cena {s.scene}
              </div>
              <div>
                <span className="text-muted text-sm">Visual: </span>
                <span className="text-sm">{s.visual}</span>
              </div>
              <div>
                <span className="text-muted text-sm">Voz: </span>
                <span className="text-sm">{s.voiceover}</span>
              </div>
              {s.onScreenText ? (
                <div>
                  <span className="text-muted text-sm">Texto na tela: </span>
                  <span className="text-sm">{s.onScreenText}</span>
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Legenda" action={<CopyButton text={content.caption} />}>
        <p className="text-sm whitespace-pre-wrap leading-relaxed">
          {content.caption}
        </p>
      </Section>

      <Section title="CTA" action={<CopyButton text={content.cta} />}>
        <p className="text-sm">{content.cta}</p>
      </Section>

      <Section title="Hashtags" action={<CopyButton text={hashtagsText} />}>
        <div className="flex flex-wrap gap-2">
          {content.hashtags.map((h) => (
            <span
              key={h}
              className="text-xs bg-bg border border-border rounded-full px-2.5 py-1 text-muted"
            >
              #{h}
            </span>
          ))}
        </div>
      </Section>
    </div>
  );
}
