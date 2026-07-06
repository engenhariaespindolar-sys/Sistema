import { PageHeader } from "@/components/ui/PageHeader";
import { EtapaLista } from "@/components/esteira/EtapaLista";
import { NovoProcessoButton } from "@/components/operacoes/NovoProcessoButton";
import { listOperacoesPorStatus, listEquipe } from "@/lib/data/operacoes";
import { ETAPAS } from "@/lib/status";

export default async function AnalisePage() {
  const [operacoes, equipe] = await Promise.all([
    listOperacoesPorStatus(ETAPAS.analise.statuses),
    listEquipe(),
  ]);

  return (
    <div>
      <PageHeader
        title="Análise"
        actions={<NovoProcessoButton equipe={equipe} statusInicial="em_analise" />}
      />
      <p className="mb-4 text-sm text-foreground-secondary">
        Oportunidades em estudo de viabilidade. Abra um imóvel para preencher os custos, ver a
        margem estimada e decidir: descartar, acompanhar ou aprovar a compra.
      </p>
      <EtapaLista
        operacoes={operacoes}
        tabDetalhe={ETAPAS.analise.tabDetalhe}
        mostrarStatus={false}
        mostrarValorAnuncio
      />
    </div>
  );
}
