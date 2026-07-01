import { Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { KPICard } from "@/components/ui/KPICard";
import { CashFlowChart } from "@/components/financeiro/CashFlowChart";
import { formatCurrency, formatDate } from "@/lib/format";
import { listLancamentos } from "@/lib/data/financeiro";
import { addLancamento, deleteLancamento } from "./actions";

const CATEGORIAS = [
  "compra",
  "custas",
  "reforma",
  "honorarios",
  "impostos",
  "juridico",
  "venda",
  "receita",
  "outro",
];

export default async function FinanceiroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lancamentos = await listLancamentos(id);

  const addWithId = addLancamento.bind(null, id);
  const deleteWithId = deleteLancamento.bind(null, id);

  const entradas = lancamentos.filter((l) => l.tipo === "entrada").reduce((s, l) => s + Number(l.valor), 0);
  const saidas = lancamentos.filter((l) => l.tipo === "saida").reduce((s, l) => s + Number(l.valor), 0);
  const saldo = entradas - saidas;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard label="Capital investido (saídas)" value={formatCurrency(saidas)} />
        <KPICard label="Receitas (entradas)" value={formatCurrency(entradas)} />
        <KPICard
          label="Saldo atual"
          value={formatCurrency(saldo)}
          variationTone={saldo >= 0 ? "positive" : "negative"}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fluxo de caixa</CardTitle>
        </CardHeader>
        <CardContent>
          {lancamentos.length === 0 ? (
            <p className="text-sm text-foreground-secondary">Nenhum lançamento ainda.</p>
          ) : (
            <CashFlowChart lancamentos={lancamentos} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Novo lançamento</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addWithId} className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">Tipo</label>
              <select name="tipo" defaultValue="saida" className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm">
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">Categoria</label>
              <select name="categoria" defaultValue="outro" className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm">
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">Data</label>
              <input
                name="data"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                className="rounded-lg border border-border-subtle px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">Valor</label>
              <input name="valor" type="number" step="0.01" className="w-32 rounded-lg border border-border-subtle px-3 py-2 text-sm" />
            </div>
            <div className="min-w-40 flex-1">
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">Descrição</label>
              <input name="descricao" className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm" />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover"
            >
              Adicionar
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5">
          {lancamentos.length === 0 ? (
            <p className="text-sm text-foreground-secondary">Nenhum lançamento cadastrado.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-left text-xs text-foreground-secondary">
                  <th className="py-2">Data</th>
                  <th className="py-2">Tipo</th>
                  <th className="py-2">Categoria</th>
                  <th className="py-2">Descrição</th>
                  <th className="py-2 text-right">Valor</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {[...lancamentos].reverse().map((l) => (
                  <tr key={l.id} className="border-b border-border-subtle last:border-0">
                    <td className="py-2">{formatDate(l.data)}</td>
                    <td className="py-2 capitalize">{l.tipo}</td>
                    <td className="py-2 capitalize">{l.categoria}</td>
                    <td className="py-2">{l.descricao ?? "-"}</td>
                    <td className={`py-2 text-right ${l.tipo === "entrada" ? "text-success" : "text-danger"}`}>
                      {l.tipo === "entrada" ? "+" : "-"}
                      {formatCurrency(l.valor)}
                    </td>
                    <td className="py-2 text-right">
                      <form action={deleteWithId}>
                        <input type="hidden" name="id" value={l.id} />
                        <button type="submit" className="text-foreground-secondary hover:text-danger">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
