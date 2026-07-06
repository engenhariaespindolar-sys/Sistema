import { PageHeader } from "@/components/ui/PageHeader";
import { EtapaLista } from "@/components/esteira/EtapaLista";
import { NovoProcessoButton } from "@/components/operacoes/NovoProcessoButton";
import { listOperacoesPorStatus, listEquipe } from "@/lib/data/operacoes";
import { ETAPAS } from "@/lib/status";

export default async function ProspeccaoPage() {
  const [operacoes, equipe] = await Promise.all([
    listOperacoesPorStatus(ETAPAS.prospeccao.statuses),
    listEquipe(),
  ]);

  return (
    <div>
      <PageHeader
        title="Prospecção"
        actions={<NovoProcessoButton equipe={equipe} statusInicial="prospeccao" />}
      />
      <p className="mb-4 text-sm text-foreground-secondary">
        Imóveis encontrados em leilões e anúncios, aguardando triagem. Abra um imóvel para enviar
        para análise ou descartar.
      </p>
      <EtapaLista
        operacoes={operacoes}
        tabDetalhe={ETAPAS.prospeccao.tabDetalhe}
        mostrarStatus={false}
        mostrarValorAnuncio
      />
    </div>
  );
}
