import { PageHeader } from "@/components/ui/PageHeader";
import { EtapaLista } from "@/components/esteira/EtapaLista";
import { NovoProcessoButton } from "@/components/operacoes/NovoProcessoButton";
import { listOperacoesPorStatus, listEquipe } from "@/lib/data/operacoes";
import { ETAPAS } from "@/lib/status";

export default async function ReformaEsteiraPage() {
  const [operacoes, equipe] = await Promise.all([
    listOperacoesPorStatus(ETAPAS.reforma.statuses),
    listEquipe(),
  ]);

  return (
    <div>
      <PageHeader
        title="Reforma"
        actions={<NovoProcessoButton equipe={equipe} statusInicial="reforma" />}
      />
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
