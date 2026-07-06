import { PageHeader } from "@/components/ui/PageHeader";
import { EtapaLista } from "@/components/esteira/EtapaLista";
import { NovoProcessoButton } from "@/components/operacoes/NovoProcessoButton";
import { listOperacoesPorStatus, listEquipe } from "@/lib/data/operacoes";
import { ETAPAS } from "@/lib/status";

export default async function VendaEsteiraPage() {
  const [operacoes, equipe] = await Promise.all([
    listOperacoesPorStatus(ETAPAS.venda.statuses),
    listEquipe(),
  ]);

  return (
    <div>
      <PageHeader
        title="Venda"
        actions={<NovoProcessoButton equipe={equipe} statusInicial="venda" />}
      />
      <p className="mb-4 text-sm text-foreground-secondary">
        Imóveis anunciados: preço, corretores, visitas, propostas e financiamento do comprador.
      </p>
      <EtapaLista
        operacoes={operacoes}
        tabDetalhe={ETAPAS.venda.tabDetalhe}
        mostrarStatus={false}
      />
    </div>
  );
}
