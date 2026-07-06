import { PageHeader } from "@/components/ui/PageHeader";
import { EtapaLista } from "@/components/esteira/EtapaLista";
import { listOperacoesPorStatus } from "@/lib/data/operacoes";
import { ETAPAS } from "@/lib/status";

export default async function ReformaEsteiraPage() {
  const operacoes = await listOperacoesPorStatus(ETAPAS.reforma.statuses);

  return (
    <div>
      <PageHeader title="Reforma" />
      <p className="mb-4 text-sm text-foreground-secondary">
        Imóveis em obra: orçamento, serviços e materiais, fornecedores, diário de obra e custo
        previsto x realizado.
      </p>
      <EtapaLista
        operacoes={operacoes}
        tabDetalhe={ETAPAS.reforma.tabDetalhe}
        mostrarStatus={false}
      />
    </div>
  );
}
