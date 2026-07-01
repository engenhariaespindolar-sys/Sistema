import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SugestaoVendaIA } from "@/components/venda/SugestaoVendaIA";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { getVenda } from "@/lib/data/venda";
import { saveVenda, addVisita, addProposta } from "./actions";

const FUNIL = [
  { value: "anunciado", label: "Anunciado" },
  { value: "em_negociacao", label: "Em negociação" },
  { value: "contrato", label: "Contrato" },
  { value: "escritura", label: "Escritura" },
  { value: "concluido", label: "Concluído" },
];

export default async function VendaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const venda = await getVenda(id);

  const saveWithId = saveVenda.bind(null, id);
  const addVisitaWithId = addVisita.bind(null, id);
  const addPropostaWithId = addProposta.bind(null, id);

  const currentIndex = FUNIL.findIndex((f) => f.value === (venda?.status ?? "anunciado"));
  const visitas = (venda?.visitas ?? []) as { data: string; observacao: string }[];
  const propostas = (venda?.propostas ?? []) as { data: string; valor: number }[];

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center">
            {FUNIL.map((etapa, i) => (
              <div key={etapa.value} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                      i <= currentIndex ? "bg-brand-primary text-white" : "bg-black/5 text-foreground-secondary"
                    )}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs text-foreground-secondary">{etapa.label}</span>
                </div>
                {i < FUNIL.length - 1 && (
                  <div className={cn("mx-2 h-0.5 flex-1", i < currentIndex ? "bg-brand-primary" : "bg-black/10")} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Anúncio</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={saveWithId} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                    Valor anunciado
                  </label>
                  <input
                    name="valor_anunciado"
                    type="number"
                    step="0.01"
                    defaultValue={venda?.valor_anunciado ?? ""}
                    className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                    Valor negociado
                  </label>
                  <input
                    name="valor_negociado"
                    type="number"
                    step="0.01"
                    defaultValue={venda?.valor_negociado ?? ""}
                    className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                  Corretores (separados por vírgula)
                </label>
                <input
                  name="corretores"
                  defaultValue={(venda?.corretores as string[])?.join(", ") ?? ""}
                  className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                  Portais (separados por vírgula)
                </label>
                <input
                  name="portais"
                  defaultValue={(venda?.portais as string[])?.join(", ") ?? ""}
                  placeholder="Ex: OLX, Zap Imóveis, VivaReal"
                  className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                    Data do contrato
                  </label>
                  <input
                    name="data_contrato"
                    type="date"
                    defaultValue={venda?.data_contrato ?? ""}
                    className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                    Data da escritura
                  </label>
                  <input
                    name="data_escritura"
                    type="date"
                    defaultValue={venda?.data_escritura ?? ""}
                    className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                  Etapa do funil
                </label>
                <select
                  name="status"
                  defaultValue={venda?.status ?? "anunciado"}
                  className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-brand-primary"
                >
                  {FUNIL.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
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

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visitas</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={addVisitaWithId} className="mb-3 flex gap-2">
                <input
                  name="observacao"
                  required
                  placeholder="Registrar visita..."
                  className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-lg border border-brand-primary px-3 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary-light"
                >
                  Adicionar
                </button>
              </form>
              {visitas.length === 0 ? (
                <p className="text-sm text-foreground-secondary">Nenhuma visita registrada.</p>
              ) : (
                <ul className="space-y-1 text-sm">
                  {[...visitas].reverse().map((v, i) => (
                    <li key={i}>
                      <span className="text-xs text-foreground-secondary">{formatDate(v.data)}</span> — {v.observacao}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Propostas</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={addPropostaWithId} className="mb-3 flex gap-2">
                <input
                  name="valor"
                  type="number"
                  step="0.01"
                  required
                  placeholder="Valor da proposta"
                  className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-lg border border-brand-primary px-3 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary-light"
                >
                  Adicionar
                </button>
              </form>
              {propostas.length === 0 ? (
                <p className="text-sm text-foreground-secondary">Nenhuma proposta registrada.</p>
              ) : (
                <ul className="space-y-1 text-sm">
                  {[...propostas].reverse().map((p, i) => (
                    <li key={i}>
                      <span className="text-xs text-foreground-secondary">{formatDate(p.data)}</span> —{" "}
                      {formatCurrency(p.valor)}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <SugestaoVendaIA operacaoId={id} />
    </div>
  );
}
