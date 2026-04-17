# Mave

Gerador de roteiros para vídeos curtos verticais (Instagram Reels, YouTube Shorts, TikTok) usando a Claude API.

Dado um tema, plataforma, tom e duração, o app devolve um pacote pronto para gravar: hook, roteiro cena-a-cena, legenda, CTA e hashtags.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS
- Anthropic SDK (`@anthropic-ai/sdk`) — modelo `claude-sonnet-4-6`
- Zod para validação de input/output
- Prompt caching via `cache_control: ephemeral` no system + tool

## Rodando localmente

```bash
npm install
cp .env.local.example .env.local
# edite .env.local e coloque sua ANTHROPIC_API_KEY
npm run dev
```

Abra http://localhost:3000.

## Estrutura

```
app/
  layout.tsx, page.tsx, globals.css
  api/generate/route.ts      # POST — chama Claude server-side
components/
  ContentForm.tsx            # formulário
  ContentOutput.tsx          # resultado + copiar
lib/
  anthropic.ts               # cliente singleton
  prompts.ts                 # system prompt + builder
  schemas.ts                 # zod + JSON schema da tool
```

## Como a integração funciona

O endpoint `/api/generate` recebe `{ topic, platform, tone, duration }`, monta uma mensagem e chama Claude com:

- **System prompt** longo com regras de hook, roteiro e plataforma — marcado com `cache_control: { type: "ephemeral" }` para reutilizar entre requests.
- **Tool `emit_content`** com `input_schema` = schema do output, forçada via `tool_choice: { type: "tool", name: "emit_content" }`. Isso garante JSON válido em vez de depender de parse frágil.
- Validação final do output com Zod antes de devolver ao cliente.

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run start` — serve o build
- `npm run lint` — ESLint
