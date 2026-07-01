import Anthropic from "@anthropic-ai/sdk";
import type { AnaliseViabilidade, Operacao } from "@/types/database";

const MODEL = "claude-sonnet-5";

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY não configurada. Adicione a chave no .env.local para habilitar os recursos de IA."
    );
  }
  return new Anthropic({ apiKey });
}

function extractJson<T>(text: string): T {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("A resposta da IA não veio em formato reconhecível.");
  return JSON.parse(match[0]) as T;
}

export async function analisarEdital(pdfBase64: string): Promise<{
  resumo: string;
  pendencias: string[];
  riscos: string[];
  custos_estimados: string;
  lance_maximo: string;
}> {
  const client = getClient();
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: pdfBase64 },
          },
          {
            type: "text",
            text: `Você é um especialista em leilões de imóveis no Brasil. Analise o edital em anexo e responda APENAS com um JSON no formato:
{"resumo": "...", "pendencias": ["..."], "riscos": ["..."], "custos_estimados": "...", "lance_maximo": "..."}`,
          },
        ],
      },
    ],
  });

  const text = message.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  return extractJson(text);
}

export async function gerarParecer(viabilidade: AnaliseViabilidade): Promise<string> {
  const client = getClient();
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: `Você é um consultor de investimentos imobiliários. Com base nos números abaixo, escreva um parecer curto (máx. 6 frases) em português, avaliando se a operação é atrativa, os principais riscos e uma recomendação objetiva.

Capital necessário: R$ ${viabilidade.capital_necessario}
Valor esperado de venda: R$ ${viabilidade.valor_esperado}
Lucro bruto estimado: R$ ${viabilidade.lucro_bruto}
Prazo estimado: ${viabilidade.prazo_estimado_meses ?? "não informado"} meses`,
      },
    ],
  });

  return message.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
}

export async function resumirDocumento(pdfBase64: string, tipo: string): Promise<string> {
  const client = getClient();
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 700,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: pdfBase64 },
          },
          {
            type: "text",
            text: `Resuma este documento do tipo "${tipo}" em português, em até 5 frases, destacando as informações mais relevantes para uma operação de compra e venda de imóvel.`,
          },
        ],
      },
    ],
  });

  return message.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
}

export async function sugerirReforma(
  tipo: string,
  area: number
): Promise<{ cronograma: { fase: string; duracao_dias: number }[]; materiais: string[]; sequencia: string[] }> {
  const client = getClient();
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1200,
    messages: [
      {
        role: "user",
        content: `Sugira um plano de reforma para um imóvel do tipo "${tipo}" com ${area} m², visando revenda. Responda APENAS com um JSON no formato:
{"cronograma": [{"fase": "...", "duracao_dias": 0}], "materiais": ["..."], "sequencia": ["..."]}`,
      },
    ],
  });

  const text = message.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  return extractJson(text);
}

export async function sugerirVenda(
  operacao: Operacao,
  viabilidade: AnaliseViabilidade | null
): Promise<{ valor: string; texto_anuncio: string; faixa_negociacao: string }> {
  const client = getClient();
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 900,
    messages: [
      {
        role: "user",
        content: `Sugira uma estratégia de venda para o imóvel abaixo. Responda APENAS com um JSON no formato:
{"valor": "...", "texto_anuncio": "...", "faixa_negociacao": "..."}

Endereço: ${operacao.endereco}, ${operacao.cidade ?? ""}/${operacao.estado ?? ""}
Tipo: ${operacao.tipo}
Área: ${operacao.area ?? "não informada"} m²
Valor esperado de venda cadastrado: R$ ${viabilidade?.valor_esperado ?? "não informado"}
Capital investido na operação: R$ ${viabilidade?.capital_necessario ?? "não informado"}`,
      },
    ],
  });

  const text = message.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  return extractJson(text);
}
