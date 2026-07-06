import { PageHeader } from "@/components/ui/PageHeader";
import { EtapaLista } from "@/components/esteira/EtapaLista";
import { listOperacoesPorStatus } from "@/lib/data/operacoes";
import { ETAPAS } from "@/lib/status";

export default async function VendaEsteiraPage() {
  const operacoes = await listOperacoesPorStatus(ETAPAS.venda.statuses);

  return (
    <div>
      <PageHeader title="Venda" />
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
