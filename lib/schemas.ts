import { z } from "zod";

export const PlatformEnum = z.enum(["reels", "shorts", "tiktok"]);
export const ToneEnum = z.enum(["educativo", "humor", "inspirador", "vendas"]);
export const DurationEnum = z.union([
  z.literal(15),
  z.literal(30),
  z.literal(60),
]);

export const RequestSchema = z.object({
  topic: z.string().min(3).max(500),
  platform: PlatformEnum,
  tone: ToneEnum,
  duration: DurationEnum,
});

export type GenerateRequest = z.infer<typeof RequestSchema>;

export const SceneSchema = z.object({
  scene: z.number().int().positive(),
  visual: z.string(),
  voiceover: z.string(),
  onScreenText: z.string().optional().default(""),
});

export const ContentSchema = z.object({
  hook: z.string(),
  script: z.array(SceneSchema).min(1),
  caption: z.string(),
  cta: z.string(),
  hashtags: z.array(z.string()).min(8).max(20),
});

export type GeneratedContent = z.infer<typeof ContentSchema>;

import type Anthropic from "@anthropic-ai/sdk";

export const ContentJsonSchema: Anthropic.Tool.InputSchema = {
  type: "object",
  properties: {
    hook: {
      type: "string",
      description:
        "Gancho dos primeiros 3 segundos. Curto, intrigante, gera parada de scroll.",
    },
    script: {
      type: "array",
      description:
        "Roteiro cena-a-cena. Cada cena com visual, voz e texto na tela.",
      items: {
        type: "object",
        properties: {
          scene: {
            type: "number",
            description: "Número da cena, começando em 1.",
          },
          visual: {
            type: "string",
            description:
              "Descrição do que aparece na tela (câmera, ação, enquadramento).",
          },
          voiceover: {
            type: "string",
            description: "Fala/narração dessa cena.",
          },
          onScreenText: {
            type: "string",
            description:
              "Texto curto sobreposto na tela (legenda queimada). Pode ser vazio.",
          },
        },
        required: ["scene", "visual", "voiceover"],
      },
    },
    caption: {
      type: "string",
      description:
        "Legenda do post, com quebras de linha. Usa emojis com moderação.",
    },
    cta: {
      type: "string",
      description:
        "Call-to-action final curto e direto (salvar, comentar, seguir, etc).",
    },
    hashtags: {
      type: "array",
      description: "10 a 15 hashtags relevantes, sem o símbolo # no texto.",
      items: { type: "string" },
    },
  },
  required: ["hook", "script", "caption", "cta", "hashtags"],
};
