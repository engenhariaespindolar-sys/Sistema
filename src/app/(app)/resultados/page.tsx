import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { KPICard } from "@/components/ui/KPICard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getDashboardData } from "@/lib/data/dashboard";
import { computeKPIs } from "@/lib/kpi";
import { formatCurrency, formatDate, formatPercent } from "@/lib/format";
import { operacaoStatusInfo, OPERACAO_STATUS_CONCLUIDO } from "@/lib/status";

export default async function ResultadosPage() {
  const { operacoes, viabilidades, lancamentos } = await getDashboardData();
  const kpi = computeKPIs(operacoes, viabilidades, lancamentos);

  const viabPorOperacao = new Map(viabilidades.map((v) => [v.operacao_id, v]));

  const concluidas = operacoes.filter(
    (o) => OPERACAO_STATUS_CONCLUIDO.has(o.status) && o.status !== "descartado"
  );
  const descartadas = operacoes.filter((o) => o.status === "descartado");

  const linhas = concluidas.map((o) => {
    const opLanc = lancamentos.filter((l) => l.operacao_id === o.id);
    const entradas = opLanc.filter((l) => l.tipo === "entrada").reduce((s, l) => s + Number(l.valor), 0);
    const saidas = opLanc.filter((l) => l.tipo === "saida").reduce((s, l) => s + Number(l.valor), 0);
    const lucro = entradas - saidas;
    const roi = saidas > 0 ? (lucro / saidas) * 100 : null;
    return { operacao: o, investido: saidas, lucro, roi };
  });

  const ranking = [...linhas]
    .filter((l) => l.roi !== null)
    .sort((a, b) => (b.roi ?? 0) - (a.roi ?? 0))
    .slice(0, 5);

  const ticketMedio = linhas.length
    ? linhas.reduce((s, l) => s + l.investido, 0) / linhas.length
    : 0;

  return (
    <div>
      <PageHeader title="Resultados" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Total investido" value={formatCurrency(kpi.capitalInvestido)} />
        <KPICard label="Lucro realizado" value={formatCurrency(kpi.lucroRealizado)} />
        <KPICard label="Ticket médio (concluídas)" value={formatCurrency(ticketMedio)} />
        <KPICard label="ROI médio da carteira" value={formatPercent(kpi.roiMedio)} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ranking das melhores operações (por ROI realizado)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {ranking.length === 0 && (
              <p className="text-sm text-foreground-secondary">
                Nenhuma operação concluída com lançamentos financeiros ainda.
              </p>
            )}
            {ranking.map((l, i) => (
              <Link
                key={l.operacao.id}
                href={`/operacoes/${l.operacao.id}/resultado`}
                className="flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-black/[0.02]"
              >
                <span>
                  <span className="mr-2 text-foreground-secondary">#{i + 1}</span>
                  {l.operacao.codigo} · {l.operacao.endereco}
                </span>
                <span className="font-medium text-success">{formatPercent(l.roi)}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operações por status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {kpi.porStatus
              .filter((s) => s.total > 0)
              .map((s) => (
                <div key={s.status} className="flex items-center justify-between text-sm">
                  <StatusBadge label={s.label} tone={operacaoStatusInfo(s.status).tone} />
                  <span className="font-medium text-foreground">{s.total}</span>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Operações concluídas</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left text-xs text-foreground-secondary">
                <th className="py-2">Operação</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Investido</th>
                <th className="py-2 text-right">Lucro líquido</th>
                <th className="py-2 text-right">ROI</th>
                <th className="py-2 text-right">Lucro previsto</th>
              </tr>
            </thead>
            <tbody>
              {linhas.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-foreground-secondary">
                    Nenhuma operação concluída ainda.
                  </td>
                </tr>
              )}
              {linhas.map((l) => {
                const info = operacaoStatusInfo(l.operacao.status);
                const viab = viabPorOperacao.get(l.operacao.id);
                return (
                  <tr key={l.operacao.id} className="border-b border-border-subtle last:border-0">
                    <td className="py-2">
                      <Link
                        href={`/operacoes/${l.operacao.id}/resultado`}
                        className="hover:underline"
                      >
                        {l.operacao.codigo} · {l.operacao.endereco}
                      </Link>
                    </td>
                    <td className="py-2">
                      <StatusBadge label={info.label} tone={info.tone} />
                    </td>
                    <td className="py-2 text-right">{formatCurrency(l.investido)}</td>
                    <td
                      className={`py-2 text-right font-medium ${l.lucro >= 0 ? "text-success" : "text-danger"}`}
                    >
                      {formatCurrency(l.lucro)}
                    </td>
                    <td className="py-2 text-right">{l.roi !== null ? formatPercent(l.roi) : "-"}</td>
                    <td className="py-2 text-right text-foreground-secondary">
                      {viab ? formatCurrency(viab.lucro_bruto) : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Oportunidades descartadas</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {descartadas.length === 0 ? (
            <p className="py-2 text-sm text-foreground-secondary">Nenhuma oportunidade descartada.</p>
          ) : (
            <div className="divide-y divide-border-subtle">
              {descartadas.map((o) => (
                <Link
                  key={o.id}
                  href={`/operacoes/${o.id}`}
                  className="flex items-center justify-between py-2.5 text-sm hover:bg-black/[0.02]"
                >
                  <span>
                    {o.codigo} · {o.endereco}
                  </span>
                  <span className="text-xs text-foreground-secondary">
                    {formatDate(o.updated_at)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
