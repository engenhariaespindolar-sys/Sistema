import Link from "next/link";
import { Trash2, FileText, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { KPICard } from "@/components/ui/KPICard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import { listLances } from "@/lib/data/lances";
import { listLancamentos } from "@/lib/data/financeiro";
import { addLance, updateLanceResultado, deleteLance } from "./actions";
import type { BadgeTone } from "@/components/ui/StatusBadge";

const RESULTADO_INFO: Record<string, { label: string; tone: BadgeTone }> = {
  aguardando: { label: "Aguardando", tone: "warning" },
  vencedor: { label: "Vencedor", tone: "success" },
  perdido: { label: "Perdido", tone: "danger" },
  recusado: { label: "Recusado", tone: "neutral" },
};

const CATEGORIAS_COMPRA = new Set(["compra", "custas", "impostos", "juridico"]);

export default async function AquisicaoTabPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lances, lancamentos] = await Promise.all([listLances(id), listLancamentos(id)]);

  const addWithId = addLance.bind(null, id);
  const updateResultadoWithId = updateLanceResultado.bind(null, id);
  const deleteWithId = deleteLance.bind(null, id);

  const custosCompra = lancamentos
    .filter((l) => l.tipo === "saida" && CATEGORIAS_COMPRA.has(l.categoria))
    .reduce((s, l) => s + Number(l.valor), 0);

  const lanceVencedor = lances.find((l) => l.resultado === "vencedor");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard
          label="Lance/proposta vencedora"
          value={lanceVencedor ? formatCurrency(lanceVencedor.valor) : "-"}
        />
        <KPICard label="Custos reais da compra" value={formatCurrency(custosCompra)} />
        <KPICard label="Lances e propostas registrados" value={String(lances.length)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registrar lance ou proposta</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addWithId} className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">Tipo</label>
              <select
                name="tipo"
                defaultValue="lance"
                className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm"
              >
                <option value="lance">Lance (leilão)</option>
                <option value="proposta">Proposta (negociação)</option>
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
              <input
                name="valor"
                type="number"
                step="0.01"
                required
                className="w-36 rounded-lg border border-border-subtle px-3 py-2 text-sm"
              />
            </div>
            <div className="min-w-40 flex-1">
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                Observação
              </label>
              <input
                name="observacao"
                className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover"
            >
              Registrar
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5">
          {lances.length === 0 ? (
            <p className="text-sm text-foreground-secondary">
              Nenhum lance ou proposta registrado ainda.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-left text-xs text-foreground-secondary">
                  <th className="py-2">Data</th>
                  <th className="py-2">Tipo</th>
                  <th className="py-2 text-right">Valor</th>
                  <th className="py-2">Resultado</th>
                  <th className="py-2">Observação</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {lances.map((lance) => {
                  const info = RESULTADO_INFO[lance.resultado] ?? RESULTADO_INFO.aguardando;
                  return (
                    <tr key={lance.id} className="border-b border-border-subtle last:border-0">
                      <td className="py-2">{formatDate(lance.data)}</td>
                      <td className="py-2 capitalize">{lance.tipo}</td>
                      <td className="py-2 text-right">{formatCurrency(lance.valor)}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <StatusBadge label={info.label} tone={info.tone} />
                          <form action={updateResultadoWithId}>
                            <input type="hidden" name="id" value={lance.id} />
                            <select
                              name="resultado"
                              defaultValue={lance.resultado}
                              className="rounded-md border border-border-subtle bg-surface px-2 py-1 text-xs"
                            >
                              <option value="aguardando">Aguardando</option>
                              <option value="vencedor">Vencedor</option>
                              <option value="perdido">Perdido</option>
                              <option value="recusado">Recusado</option>
                            </select>
                            <button
                              type="submit"
                              className="ml-1 rounded-md border border-border-subtle px-2 py-1 text-xs text-foreground-secondary hover:bg-black/[0.03]"
                            >
                              Atualizar
                            </button>
                          </form>
                        </div>
                      </td>
                      <td className="py-2 text-foreground-secondary">{lance.observacao ?? "-"}</td>
                      <td className="py-2 text-right">
                        <form action={deleteWithId}>
                          <input type="hidden" name="id" value={lance.id} />
                          <button type="submit" className="text-foreground-secondary hover:text-danger">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Link
          href={`/operacoes/${id}/documentos`}
          className="flex items-center gap-1.5 rounded-lg border border-border-subtle px-4 py-2 text-sm text-foreground-secondary hover:bg-black/[0.03]"
        >
          <FileText className="h-4 w-4" /> Documentos da compra
        </Link>
        <Link
          href={`/operacoes/${id}/desocupacao`}
          className="flex items-center gap-1.5 rounded-lg border border-border-subtle px-4 py-2 text-sm text-foreground-secondary hover:bg-black/[0.03]"
        >
          <KeyRound className="h-4 w-4" /> Posse e desocupação
        </Link>
      </div>
    </div>
  );
}
