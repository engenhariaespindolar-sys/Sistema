import Link from "next/link";
import { Wallet, TrendingUp, TrendingDown, Percent, Clock, Building2, Bell } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { KPICard } from "@/components/ui/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatusBarChart } from "@/components/dashboard/StatusBarChart";
import { getDashboardData } from "@/lib/data/dashboard";
import { computeKPIs } from "@/lib/kpi";
import { formatCurrency, formatDate } from "@/lib/format";
import { operacaoStatusInfo } from "@/lib/status";

export default async function DashboardPage() {
  const { operacoes, viabilidades, lancamentos, notificacoes } = await getDashboardData();
  const kpi = computeKPIs(operacoes, viabilidades, lancamentos);

  const semResponsavel = operacoes.filter(
    (o) => !o.responsavel_id && o.status !== "vendido" && o.status !== "encerrado"
  );

  const ultimasAtualizadas = operacoes.slice(0, 6);

  return (
    <div>
      <PageHeader title="Dashboard" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Capital investido" value={formatCurrency(kpi.capitalInvestido)} icon={Wallet} />
        <KPICard
          label="Saldo financeiro (caixa)"
          value={formatCurrency(kpi.saldoFinanceiro)}
          icon={kpi.saldoFinanceiro >= 0 ? TrendingUp : TrendingDown}
          variationTone={kpi.saldoFinanceiro >= 0 ? "positive" : "negative"}
        />
        <KPICard label="Lucro previsto (em andamento)" value={formatCurrency(kpi.lucroPrevisto)} icon={TrendingUp} />
        <KPICard label="Lucro realizado (concluídas)" value={formatCurrency(kpi.lucroRealizado)} icon={TrendingUp} />
        <KPICard label="ROI médio" value={`${kpi.roiMedio.toFixed(1)}%`} icon={Percent} />
        <KPICard
          label="Tempo médio em andamento"
          value={`${kpi.tempoMedioDias.toFixed(0)} dias`}
          icon={Clock}
        />
        <KPICard label="Operações em andamento" value={String(kpi.emAndamentoCount)} icon={Building2} />
        <KPICard label="Total de operações" value={String(kpi.totalOperacoes)} icon={Building2} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Operações por status</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBarChart data={kpi.porStatus} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Alertas e pendências
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {notificacoes.length === 0 && semResponsavel.length === 0 && (
              <p className="text-sm text-foreground-secondary">Nenhuma pendência no momento.</p>
            )}

            {notificacoes.map((n) => (
              <div key={n.id} className="rounded-lg bg-warning-light px-3 py-2 text-sm text-[#7a4b00]">
                {n.titulo}
              </div>
            ))}

            {semResponsavel.map((o) => (
              <Link
                key={o.id}
                href={`/operacoes/${o.id}`}
                className="block rounded-lg bg-danger-light px-3 py-2 text-sm text-danger hover:opacity-80"
              >
                {o.codigo} sem responsável definido
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimas operações atualizadas</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-border-subtle">
            {ultimasAtualizadas.length === 0 && (
              <p className="py-4 text-sm text-foreground-secondary">Nenhuma operação cadastrada ainda.</p>
            )}
            {ultimasAtualizadas.map((o) => {
              const info = operacaoStatusInfo(o.status);
              return (
                <Link
                  key={o.id}
                  href={`/operacoes/${o.id}`}
                  className="flex items-center justify-between gap-4 py-3 text-sm hover:bg-black/[0.02]"
                >
                  <div>
                    <div className="font-medium text-foreground">{o.codigo} · {o.endereco}</div>
                    <div className="text-xs text-foreground-secondary">
                      Atualizado em {formatDate(o.updated_at)}
                    </div>
                  </div>
                  <StatusBadge label={info.label} tone={info.tone} />
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
