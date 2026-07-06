import { OPERACAO_STATUS_CONCLUIDO, OPERACAO_STATUS_ORDER, operacaoStatusInfo } from "@/lib/status";
import type { Operacao, AnaliseViabilidade, FinanceiroLancamento } from "@/types/database";

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

  const ativas = operacoes.filter((o) => o.status !== "descartado");
  const emAndamento = ativas.filter((o) => !OPERACAO_STATUS_CONCLUIDO.has(o.status));
  const concluidas = ativas.filter((o) => OPERACAO_STATUS_CONCLUIDO.has(o.status));

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

  const ativasIds = new Set(ativas.map((o) => o.id));
  const roiValues = viabilidades
    .filter((v) => v.capital_necessario > 0 && ativasIds.has(v.operacao_id))
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
