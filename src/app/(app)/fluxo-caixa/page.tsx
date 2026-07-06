import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { KPICard } from "@/components/ui/KPICard";
import { CashFlowChart } from "@/components/financeiro/CashFlowChart";
import { getDashboardData } from "@/lib/data/dashboard";
import { formatCurrency } from "@/lib/format";

function mesLabel(anoMes: string) {
  const [ano, mes] = anoMes.split("-");
  const nomes = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${nomes[Number(mes) - 1]}/${ano}`;
}

export default async function FluxoCaixaPage() {
  const { operacoes, lancamentos } = await getDashboardData();

  const ordenados = [...lancamentos].sort((a, b) => a.data.localeCompare(b.data));
  const codigoPorOperacao = new Map(operacoes.map((o) => [o.id, o.codigo]));

  const entradas = lancamentos
    .filter((l) => l.tipo === "entrada")
    .reduce((s, l) => s + Number(l.valor), 0);
  const saidas = lancamentos
    .filter((l) => l.tipo === "saida")
    .reduce((s, l) => s + Number(l.valor), 0);
  const saldo = entradas - saidas;

  const porMes = new Map<string, { entradas: number; saidas: number }>();
  for (const l of ordenados) {
    const chave = l.data.slice(0, 7);
    const atual = porMes.get(chave) ?? { entradas: 0, saidas: 0 };
    if (l.tipo === "entrada") atual.entradas += Number(l.valor);
    else atual.saidas += Number(l.valor);
    porMes.set(chave, atual);
  }

  const porCategoria = new Map<string, number>();
  for (const l of lancamentos) {
    if (l.tipo !== "saida") continue;
    porCategoria.set(l.categoria, (porCategoria.get(l.categoria) ?? 0) + Number(l.valor));
  }
  const categorias = [...porCategoria.entries()].sort((a, b) => b[1] - a[1]);

  let acumulado = 0;
  const linhasMes = [...porMes.entries()].map(([mes, dados]) => {
    acumulado += dados.entradas - dados.saidas;
    return { mes, ...dados, saldoAcumulado: acumulado };
  });

  const ultimosLancamentos = [...ordenados].reverse().slice(0, 15);

  return (
    <div>
      <PageHeader title="Fluxo de caixa" />
      <p className="mb-4 text-sm text-foreground-secondary">
        Consolidado financeiro da empresa: todas as entradas e saídas de todas as operações.
      </p>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard label="Total de entradas" value={formatCurrency(entradas)} />
        <KPICard label="Total de saídas" value={formatCurrency(saidas)} />
        <KPICard
          label="Saldo"
          value={formatCurrency(saldo)}
          variationTone={saldo >= 0 ? "positive" : "negative"}
        />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Saldo acumulado</CardTitle>
        </CardHeader>
        <CardContent>
          {ordenados.length === 0 ? (
            <p className="text-sm text-foreground-secondary">Nenhum lançamento registrado ainda.</p>
          ) : (
            <CashFlowChart lancamentos={ordenados} />
          )}
        </CardContent>
      </Card>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Movimento por mês</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-left text-xs text-foreground-secondary">
                  <th className="py-2">Mês</th>
                  <th className="py-2 text-right">Entradas</th>
                  <th className="py-2 text-right">Saídas</th>
                  <th className="py-2 text-right">Saldo acumulado</th>
                </tr>
              </thead>
              <tbody>
                {linhasMes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-foreground-secondary">
                      Sem movimentações.
                    </td>
                  </tr>
                )}
                {linhasMes.map((l) => (
                  <tr key={l.mes} className="border-b border-border-subtle last:border-0">
                    <td className="py-2">{mesLabel(l.mes)}</td>
                    <td className="py-2 text-right text-success">{formatCurrency(l.entradas)}</td>
                    <td className="py-2 text-right text-danger">{formatCurrency(l.saidas)}</td>
                    <td className="py-2 text-right font-medium">
                      {formatCurrency(l.saldoAcumulado)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saídas por categoria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categorias.length === 0 && (
              <p className="text-sm text-foreground-secondary">Sem saídas registradas.</p>
            )}
            {categorias.map(([categoria, valor]) => (
              <div key={categoria} className="flex items-center justify-between text-sm">
                <span className="capitalize text-foreground-secondary">{categoria}</span>
                <span className="font-medium">{formatCurrency(valor)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimos lançamentos</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left text-xs text-foreground-secondary">
                <th className="py-2">Data</th>
                <th className="py-2">Operação</th>
                <th className="py-2">Categoria</th>
                <th className="py-2">Descrição</th>
                <th className="py-2 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {ultimosLancamentos.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-foreground-secondary">
                    Sem lançamentos.
                  </td>
                </tr>
              )}
              {ultimosLancamentos.map((l) => (
                <tr key={l.id} className="border-b border-border-subtle last:border-0">
                  <td className="py-2">{l.data.split("-").reverse().join("/")}</td>
                  <td className="py-2">{codigoPorOperacao.get(l.operacao_id) ?? "-"}</td>
                  <td className="py-2 capitalize">{l.categoria}</td>
                  <td className="py-2 text-foreground-secondary">{l.descricao ?? "-"}</td>
                  <td
                    className={`py-2 text-right ${l.tipo === "entrada" ? "text-success" : "text-danger"}`}
                  >
                    {l.tipo === "entrada" ? "+" : "-"}
                    {formatCurrency(l.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
