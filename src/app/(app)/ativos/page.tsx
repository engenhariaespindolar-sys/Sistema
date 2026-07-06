import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { KPICard } from "@/components/ui/KPICard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getDashboardData } from "@/lib/data/dashboard";
import { formatCurrency } from "@/lib/format";
import { operacaoStatusInfo } from "@/lib/status";

// Imóveis em posse da empresa: do arremate até a venda ser concluída.
const STATUS_EM_POSSE = new Set(["arrematado", "documentacao", "desocupacao", "reforma", "venda"]);

export default async function AtivosPage() {
  const { operacoes, viabilidades, lancamentos } = await getDashboardData();

  const viabPorOperacao = new Map(viabilidades.map((v) => [v.operacao_id, v]));
  const ativos = operacoes.filter((o) => STATUS_EM_POSSE.has(o.status));

  const linhas = ativos.map((o) => {
    const investido = lancamentos
      .filter((l) => l.operacao_id === o.id && l.tipo === "saida")
      .reduce((s, l) => s + Number(l.valor), 0);
    const viab = viabPorOperacao.get(o.id);
    return {
      operacao: o,
      investido,
      valorEsperado: viab?.valor_esperado ?? null,
    };
  });

  const totalInvestido = linhas.reduce((s, l) => s + l.investido, 0);
  const totalEsperado = linhas.reduce((s, l) => s + (l.valorEsperado ?? 0), 0);

  return (
    <div>
      <PageHeader title="Ativos" />
      <p className="mb-4 text-sm text-foreground-secondary">
        Patrimônio imobiliário em posse da empresa: imóveis arrematados que ainda não foram
        vendidos.
      </p>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard label="Imóveis em posse" value={String(ativos.length)} />
        <KPICard label="Capital investido no portfólio" value={formatCurrency(totalInvestido)} />
        <KPICard label="Valor esperado de venda" value={formatCurrency(totalEsperado)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfólio</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left text-xs text-foreground-secondary">
                <th className="py-2">Imóvel</th>
                <th className="py-2">Etapa</th>
                <th className="py-2 text-right">Capital investido</th>
                <th className="py-2 text-right">Valor esperado</th>
              </tr>
            </thead>
            <tbody>
              {linhas.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-foreground-secondary">
                    Nenhum imóvel em posse no momento.
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
                        {l.operacao.cidade ? ` — ${l.operacao.cidade}` : ""}
                      </Link>
                    </td>
                    <td className="py-2">
                      <StatusBadge label={info.label} tone={info.tone} />
                    </td>
                    <td className="py-2 text-right">{formatCurrency(l.investido)}</td>
                    <td className="py-2 text-right">
                      {l.valorEsperado !== null ? formatCurrency(l.valorEsperado) : "-"}
                    </td>
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
