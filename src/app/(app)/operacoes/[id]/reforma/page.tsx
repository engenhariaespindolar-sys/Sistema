import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SugestaoReformaIA } from "@/components/reforma/SugestaoReformaIA";
import { ItensReforma } from "@/components/reforma/ItensReforma";
import { formatCurrency, formatDate } from "@/lib/format";
import { getOperacao } from "@/lib/data/operacoes";
import { getReforma, listDiario, listItens, listFornecedores } from "@/lib/data/reforma";
import { saveReforma, addDiario, addItem, updateItem, deleteItem } from "./actions";

const STATUS_TONE = {
  planejamento: "info",
  em_andamento: "warning",
  concluida: "success",
  pausada: "neutral",
} as const;

const STATUS_LABEL = {
  planejamento: "Planejamento",
  em_andamento: "Em andamento",
  concluida: "Concluída",
  pausada: "Pausada",
} as const;

export default async function ReformaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [operacao, reforma, fornecedores] = await Promise.all([
    getOperacao(id),
    getReforma(id),
    listFornecedores(),
  ]);
  const [diario, itens] = reforma
    ? await Promise.all([listDiario(reforma.id), listItens(reforma.id)])
    : [[], []];

  const saveWithId = saveReforma.bind(null, id);
  const addDiarioWithId = reforma ? addDiario.bind(null, reforma.id, id) : null;
  const addItemWithId = reforma ? addItem.bind(null, reforma.id, id) : null;
  const updateItemWithId = updateItem.bind(null, id);
  const deleteItemWithId = deleteItem.bind(null, id);
  const custoAcumulado = diario.reduce((sum, d) => sum + Number(d.custo_dia), 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Orçamento e cronograma</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={saveWithId} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                  Orçamento total
                </label>
                <input
                  name="orcamento_total"
                  type="number"
                  step="0.01"
                  defaultValue={reforma?.orcamento_total ?? 0}
                  className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground-secondary">Início</label>
                  <input
                    name="data_inicio"
                    type="date"
                    defaultValue={reforma?.data_inicio ?? ""}
                    className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                    Previsão fim
                  </label>
                  <input
                    name="data_previsao_fim"
                    type="date"
                    defaultValue={reforma?.data_previsao_fim ?? ""}
                    className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                    Conclusão
                  </label>
                  <input
                    name="data_conclusao"
                    type="date"
                    defaultValue={reforma?.data_conclusao ?? ""}
                    className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground-secondary">Status</label>
                <select
                  name="status"
                  defaultValue={reforma?.status ?? "planejamento"}
                  className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-brand-primary"
                >
                  {Object.entries(STATUS_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-primary-hover"
              >
                Salvar
              </button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diário de obra</CardTitle>
          </CardHeader>
          <CardContent>
            {!reforma ? (
              <p className="text-sm text-foreground-secondary">
                Salve o orçamento e cronograma primeiro para começar o diário de obra.
              </p>
            ) : (
              <>
                <form action={addDiarioWithId!} className="mb-4 space-y-2">
                  <div className="flex gap-2">
                    <input
                      name="data"
                      type="date"
                      defaultValue={new Date().toISOString().slice(0, 10)}
                      className="rounded-lg border border-border-subtle px-3 py-2 text-sm"
                    />
                    <input
                      name="custo_dia"
                      type="number"
                      step="0.01"
                      placeholder="Custo do dia"
                      className="w-32 rounded-lg border border-border-subtle px-3 py-2 text-sm"
                    />
                  </div>
                  <textarea
                    name="descricao"
                    placeholder="O que foi feito hoje?"
                    rows={2}
                    className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    className="rounded-lg border border-brand-primary px-4 py-1.5 text-sm font-medium text-brand-primary hover:bg-brand-primary-light"
                  >
                    Adicionar registro
                  </button>
                </form>

                <p className="mb-2 text-xs text-foreground-secondary">
                  Custo acumulado no diário: {formatCurrency(custoAcumulado)}
                </p>

                {diario.length === 0 ? (
                  <p className="text-sm text-foreground-secondary">Nenhum registro ainda.</p>
                ) : (
                  <ul className="max-h-80 space-y-2 overflow-y-auto">
                    {diario.map((d) => (
                      <li key={d.id} className="rounded-lg border border-border-subtle p-2 text-sm">
                        <div className="flex justify-between text-xs text-foreground-secondary">
                          <span>{formatDate(d.data)}</span>
                          <span>{formatCurrency(d.custo_dia)}</span>
                        </div>
                        {d.descricao && <p className="mt-1">{d.descricao}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {reforma && (
        <div className="flex items-center gap-2 text-sm text-foreground-secondary">
          Status atual:
          <StatusBadge label={STATUS_LABEL[reforma.status]} tone={STATUS_TONE[reforma.status]} />
        </div>
      )}

      {reforma && addItemWithId && (
        <ItensReforma
          itens={itens}
          fornecedores={fornecedores}
          orcamentoTotal={reforma.orcamento_total}
          onAdd={addItemWithId}
          onUpdate={updateItemWithId}
          onDelete={deleteItemWithId}
        />
      )}

      <SugestaoReformaIA tipo={operacao?.tipo ?? "outro"} area={operacao?.area ?? null} />
    </div>
  );
}
