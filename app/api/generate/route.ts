import { NextResponse } from "next/server";
import { getAnthropic, MODEL } from "@/lib/anthropic";
import {
  ContentSchema,
  ContentJsonSchema,
  RequestSchema,
} from "@/lib/schemas";
import { SYSTEM_PROMPT, buildUserMessage } from "@/lib/prompts";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parâmetros inválidos", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY não configurada no servidor." },
      { status: 500 },
    );
  }

  const client = getAnthropic();

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      tools: [
        {
          name: "emit_content",
          description:
            "Entrega o pacote final de conteúdo para vídeo curto vertical.",
          input_schema: ContentJsonSchema,
          cache_control: { type: "ephemeral" },
        },
      ],
      tool_choice: { type: "tool", name: "emit_content" },
      messages: [
        {
          role: "user",
          content: buildUserMessage(parsed.data),
        },
      ],
    });

    const toolUse = response.content.find((b) => b.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      return NextResponse.json(
        { error: "Resposta do modelo sem tool_use." },
        { status: 502 },
      );
    }

    const validated = ContentSchema.safeParse(toolUse.input);
    if (!validated.success) {
      return NextResponse.json(
        {
          error: "Saída do modelo fora do schema.",
          issues: validated.error.issues,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      content: validated.data,
      usage: response.usage,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Falha ao gerar conteúdo: ${message}` },
      { status: 500 },
    );
  }
}
