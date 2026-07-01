import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { KPICard } from "@/components/ui/KPICard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getDashboardData } from "@/lib/data/dashboard";
import { computeKPIs } from "@/lib/kpi";
import { formatCurrency, formatPercent } from "@/lib/format";
import { operacaoStatusInfo } from "@/lib/status";

export default async function IndicadoresPage() {
  const { operacoes, viabilidades, lancamentos } = await getDashboardData();
  const kpi = computeKPIs(operacoes, viabilidades, lancamentos);

  const viabPorOperacao = new Map(viabilidades.map((v) => [v.operacao_id, v]));

  const linhas = operacoes.map((o) => {
    const v = viabPorOperacao.get(o.id);
    const roi = v && v.capital_necessario > 0 ? (v.lucro_bruto / v.capital_necessario) * 100 : null;
    return {
      operacao: o,
      lucro: v?.lucro_bruto ?? null,
      capital: v?.capital_necessario ?? null,
      prazo: v?.prazo_estimado_meses ?? null,
      roi,
    };
  });

  const ranking = [...linhas]
    .filter((l) => l.roi !== null)
    .sort((a, b) => (b.roi ?? 0) - (a.roi ?? 0))
    .slice(0, 5);

  const ticketMedio = kpi.totalOperacoes > 0 ? kpi.capitalInvestido / kpi.totalOperacoes : 0;

  return (
    <div>
      <PageHeader title="Indicadores" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Total investido" value={formatCurrency(kpi.capitalInvestido)} />
        <KPICard label="Lucro realizado" value={formatCurrency(kpi.lucroRealizado)} />
        <KPICard label="Ticket médio por operação" value={formatCurrency(ticketMedio)} />
        <KPICard label="ROI médio da carteira" value={formatPercent(kpi.roiMedio)} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ranking das melhores operações (por ROI)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {ranking.length === 0 && (
              <p className="text-sm text-foreground-secondary">
                Cadastre análises de viabilidade para gerar o ranking.
              </p>
            )}
            {ranking.map((l, i) => (
              <Link
                key={l.operacao.id}
                href={`/operacoes/${l.operacao.id}`}
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
            {kpi.porStatus.map((s) => (
              <div key={s.status} className="flex items-center justify-between text-sm">
                <StatusBadge label={s.label} tone={operacaoStatusInfo(s.status).tone} />
                <span className="font-medium text-foreground">{s.total}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Indicadores por operação</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left text-xs text-foreground-secondary">
                <th className="py-2">Operação</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Capital necessário</th>
                <th className="py-2 text-right">Lucro bruto</th>
                <th className="py-2 text-right">Prazo (meses)</th>
                <th className="py-2 text-right">ROI</th>
              </tr>
            </thead>
            <tbody>
              {linhas.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-foreground-secondary">
                    Nenhuma operação cadastrada ainda.
                  </td>
                </tr>
              )}
              {linhas.map((l) => {
                const info = operacaoStatusInfo(l.operacao.status);
                return (
                  <tr key={l.operacao.id} className="border-b border-border-subtle last:border-0">
                    <td className="py-2">
                      <Link href={`/operacoes/${l.operacao.id}`} className="hover:underline">
                        {l.operacao.codigo} · {l.operacao.endereco}
                      </Link>
                    </td>
                    <td className="py-2">
                      <StatusBadge label={info.label} tone={info.tone} />
                    </td>
                    <td className="py-2 text-right">{l.capital !== null ? formatCurrency(l.capital) : "-"}</td>
                    <td className="py-2 text-right">{l.lucro !== null ? formatCurrency(l.lucro) : "-"}</td>
                    <td className="py-2 text-right">{l.prazo ?? "-"}</td>
                    <td className="py-2 text-right">{l.roi !== null ? formatPercent(l.roi) : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
