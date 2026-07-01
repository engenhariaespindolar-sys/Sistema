import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/format";
import { getDesocupacao } from "@/lib/data/desocupacao";
import { saveDesocupacao, addEventoDesocupacao } from "./actions";
import type { HistoricoEvento } from "@/types/database";

export default async function DesocupacaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const desocupacao = await getDesocupacao(id);
  const saveWithId = saveDesocupacao.bind(null, id);
  const addEventoWithId = addEventoDesocupacao.bind(null, id);
  const historico = (desocupacao?.historico ?? []) as HistoricoEvento[];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Controle de desocupação</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={saveWithId} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">Situação</label>
              <input
                name="situacao"
                defaultValue={desocupacao?.situacao ?? ""}
                placeholder="Ex: imóvel ocupado, aguardando notificação"
                className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground-secondary">Início</label>
                <input
                  name="data_inicio"
                  type="date"
                  defaultValue={desocupacao?.data_inicio ?? ""}
                  className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground-secondary">Previsão</label>
                <input
                  name="data_previsao"
                  type="date"
                  defaultValue={desocupacao?.data_previsao ?? ""}
                  className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground-secondary">Conclusão</label>
                <input
                  name="data_conclusao"
                  type="date"
                  defaultValue={desocupacao?.data_conclusao ?? ""}
                  className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                Custo total acumulado
              </label>
              <input
                name="custo_total"
                type="number"
                step="0.01"
                defaultValue={desocupacao?.custo_total ?? 0}
                className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">Observações</label>
              <textarea
                name="observacoes"
                defaultValue={desocupacao?.observacoes ?? ""}
                rows={3}
                className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
              />
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
          <CardTitle>Histórico ({formatCurrency(desocupacao?.custo_total ?? 0)} acumulados)</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addEventoWithId} className="mb-4 flex gap-2">
            <input
              name="descricao"
              required
              placeholder="Adicionar evento ao histórico..."
              className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg border border-brand-primary px-4 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary-light"
            >
              Adicionar
            </button>
          </form>

          {historico.length === 0 ? (
            <p className="text-sm text-foreground-secondary">Nenhum evento registrado ainda.</p>
          ) : (
            <ul className="space-y-3 border-l border-border-subtle pl-4">
              {[...historico].reverse().map((evento, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-brand-primary" />
                  <p className="text-xs text-foreground-secondary">{formatDate(evento.data)}</p>
                  <p className="text-sm text-foreground">{evento.descricao}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
