import { OPERACAO_STATUS_ORDER, operacaoStatusInfo } from "@/lib/status";
import type { Operacao, AnaliseViabilidade, FinanceiroLancamento } from "@/types/database";

const STATUS_FINAL = new Set(["vendido", "encerrado"]);

export function computeKPIs(
  operacoes: Operacao[],
  viabilidades: AnaliseViabilidade[],
  lancamentos: FinanceiroLancamento[]
) {
  const capitalInvestido = lancamentos
    .filter((l) => l.tipo === "saida")
    .reduce((sum, l) => sum + Number(l.valor), 0);

  const totalEntradas = lancamentos
    .filter((l) => l.tipo === "entrada")
    .reduce((sum, l) => sum + Number(l.valor), 0);

  const saldoFinanceiro = totalEntradas - capitalInvestido;

  const emAndamento = operacoes.filter((o) => !STATUS_FINAL.has(o.status));
  const concluidas = operacoes.filter((o) => STATUS_FINAL.has(o.status));

  const viabPorOperacao = new Map(viabilidades.map((v) => [v.operacao_id, v]));

  const lucroPrevisto = emAndamento.reduce((sum, o) => {
    const v = viabPorOperacao.get(o.id);
    return sum + (v?.lucro_bruto ?? 0);
  }, 0);

  const lucroRealizado = concluidas.reduce((sum, o) => {
    const opLancamentos = lancamentos.filter((l) => l.operacao_id === o.id);
    const entradas = opLancamentos
      .filter((l) => l.tipo === "entrada")
      .reduce((a, l) => a + Number(l.valor), 0);
    const saidas = opLancamentos
      .filter((l) => l.tipo === "saida")
      .reduce((a, l) => a + Number(l.valor), 0);
    return sum + (entradas - saidas);
  }, 0);

  const roiValues = viabilidades
    .filter((v) => v.capital_necessario > 0)
    .map((v) => (v.lucro_bruto / v.capital_necessario) * 100);
  const roiMedio = roiValues.length ? roiValues.reduce((a, b) => a + b, 0) / roiValues.length : 0;

  const now = Date.now();
  const tempoValues = emAndamento.map(
    (o) => (now - new Date(o.created_at).getTime()) / 86_400_000
  );
  const tempoMedioDias = tempoValues.length
    ? tempoValues.reduce((a, b) => a + b, 0) / tempoValues.length
    : 0;

  const porStatus = OPERACAO_STATUS_ORDER.map((status) => ({
    status,
    label: operacaoStatusInfo(status).label,
    total: operacoes.filter((o) => o.status === status).length,
  }));

  return {
    capitalInvestido,
    saldoFinanceiro,
    lucroPrevisto,
    lucroRealizado,
    roiMedio,
    tempoMedioDias,
    porStatus,
    totalOperacoes: operacoes.length,
    emAndamentoCount: emAndamento.length,
  };
}
