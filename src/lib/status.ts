import type { BadgeTone } from "@/components/ui/StatusBadge";

export const OPERACAO_STATUS: Record<string, { label: string; tone: BadgeTone }> = {
  em_analise: { label: "Em análise", tone: "info" },
  aguardando_leilao: { label: "Aguardando leilão", tone: "warning" },
  arrematado: { label: "Arrematado", tone: "brand" },
  documentacao: { label: "Documentação", tone: "info" },
  desocupacao: { label: "Desocupação", tone: "warning" },
  reforma: { label: "Reforma", tone: "brand" },
  venda: { label: "Em venda", tone: "info" },
  vendido: { label: "Vendido", tone: "success" },
  encerrado: { label: "Encerrado", tone: "neutral" },
  descartado: { label: "Descartado", tone: "danger" },
};

export const OPERACAO_STATUS_ORDER = [
  "em_analise",
  "aguardando_leilao",
  "arrematado",
  "documentacao",
  "desocupacao",
  "reforma",
  "venda",
  "vendido",
  "encerrado",
  "descartado",
] as const;

export const OPERACAO_STATUS_CONCLUIDO = new Set(["vendido", "encerrado", "descartado"]);

export const ORIGEM_LABELS: Record<string, string> = {
  leilao: "Leilão",
  anuncio: "Anúncio",
  indicacao: "Indicação",
  corretor: "Corretor",
  outro: "Outro",
};

export function operacaoStatusInfo(status: string) {
  return OPERACAO_STATUS[status] ?? { label: status, tone: "neutral" as BadgeTone };
}
