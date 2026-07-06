import { Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/format";
import type { Fornecedor, ReformaItem } from "@/types/database";
import type { BadgeTone } from "@/components/ui/StatusBadge";

const ITEM_STATUS: Record<string, { label: string; tone: BadgeTone }> = {
  pendente: { label: "Pendente", tone: "neutral" },
  contratado: { label: "Contratado", tone: "info" },
  em_andamento: { label: "Em andamento", tone: "warning" },
  concluido: { label: "Concluído", tone: "success" },
};

export function ItensReforma({
  itens,
  fornecedores,
  orcamentoTotal,
  onAdd,
  onUpdate,
  onDelete,
}: {
  itens: ReformaItem[];
  fornecedores: Fornecedor[];
  orcamentoTotal: number;
  onAdd: (formData: FormData) => Promise<void>;
  onUpdate: (formData: FormData) => Promise<void>;
  onDelete: (formData: FormData) => Promise<void>;
}) {
  const fornecedorNome = new Map(fornecedores.map((f) => [f.id, f.nome]));
  const totalPrevisto = itens.reduce((s, i) => s + Number(i.valor_previsto), 0);
  const totalRealizado = itens.reduce((s, i) => s + Number(i.valor_realizado), 0);
  const desvio = totalRealizado - totalPrevisto;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços e materiais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={onAdd} className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground-secondary">Tipo</label>
            <select
              name="tipo"
              defaultValue="servico"
              className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm"
            >
              <option value="servico">Serviço</option>
              <option value="material">Material</option>
            </select>
          </div>
          <div className="min-w-44 flex-1">
            <label className="mb-1 block text-xs font-medium text-foreground-secondary">
              Descrição
            </label>
            <input
              name="descricao"
              required
              placeholder="Ex: pintura interna, piso porcelanato..."
              className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground-secondary">
              Fornecedor
            </label>
            <select
              name="fornecedor_id"
              defaultValue=""
              className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm"
            >
              <option value="">Sem fornecedor</option>
              {fornecedores.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground-secondary">Qtd</label>
            <input
              name="quantidade"
              type="number"
              step="0.01"
              className="w-20 rounded-lg border border-border-subtle px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground-secondary">Un</label>
            <input
              name="unidade"
              placeholder="m², un..."
              className="w-20 rounded-lg border border-border-subtle px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground-secondary">
              Valor previsto
            </label>
            <input
              name="valor_previsto"
              type="number"
              step="0.01"
              className="w-32 rounded-lg border border-border-subtle px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover"
          >
            Adicionar
          </button>
        </form>

        {itens.length === 0 ? (
          <p className="text-sm text-foreground-secondary">Nenhum item cadastrado ainda.</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-left text-xs text-foreground-secondary">
                  <th className="py-2">Item</th>
                  <th className="py-2">Fornecedor</th>
                  <th className="py-2 text-right">Previsto</th>
                  <th className="py-2 text-right">Realizado</th>
                  <th className="py-2">Status</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item) => {
                  const info = ITEM_STATUS[item.status] ?? ITEM_STATUS.pendente;
                  return (
                    <tr key={item.id} className="border-b border-border-subtle last:border-0 align-top">
                      <td className="py-2">
                        <span className="font-medium">{item.descricao}</span>
                        <span className="ml-2 text-xs text-foreground-secondary">
                          {item.tipo === "servico" ? "Serviço" : "Material"}
                          {item.quantidade ? ` · ${item.quantidade} ${item.unidade ?? ""}` : ""}
                        </span>
                      </td>
                      <td className="py-2 text-foreground-secondary">
                        {item.fornecedor_id ? fornecedorNome.get(item.fornecedor_id) ?? "-" : "-"}
                      </td>
                      <td className="py-2 text-right">{formatCurrency(item.valor_previsto)}</td>
                      <td className="py-2 text-right">
                        <form action={onUpdate} className="inline-flex items-center gap-1">
                          <input type="hidden" name="id" value={item.id} />
                          <input
                            name="valor_realizado"
                            type="number"
                            step="0.01"
                            defaultValue={item.valor_realizado || ""}
                            className="w-24 rounded-md border border-border-subtle px-2 py-1 text-right text-xs"
                          />
                          <select
                            name="status"
                            defaultValue={item.status}
                            className="rounded-md border border-border-subtle bg-surface px-2 py-1 text-xs"
                          >
                            {Object.entries(ITEM_STATUS).map(([value, s]) => (
                              <option key={value} value={value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            className="rounded-md border border-border-subtle px-2 py-1 text-xs text-foreground-secondary hover:bg-black/[0.03]"
                          >
                            Salvar
                          </button>
                        </form>
                      </td>
                      <td className="py-2">
                        <StatusBadge label={info.label} tone={info.tone} />
                      </td>
                      <td className="py-2 text-right">
                        <form action={onDelete}>
                          <input type="hidden" name="id" value={item.id} />
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

            <div className="flex flex-wrap gap-6 border-t border-border-subtle pt-3 text-sm">
              <div>
                <span className="text-foreground-secondary">Total previsto: </span>
                <span className="font-medium">{formatCurrency(totalPrevisto)}</span>
              </div>
              <div>
                <span className="text-foreground-secondary">Total realizado: </span>
                <span className="font-medium">{formatCurrency(totalRealizado)}</span>
              </div>
              <div>
                <span className="text-foreground-secondary">Desvio: </span>
                <span className={`font-medium ${desvio > 0 ? "text-danger" : "text-success"}`}>
                  {formatCurrency(desvio)}
                </span>
              </div>
              {orcamentoTotal > 0 && (
                <div>
                  <span className="text-foreground-secondary">Orçamento da obra: </span>
                  <span className="font-medium">{formatCurrency(orcamentoTotal)}</span>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
