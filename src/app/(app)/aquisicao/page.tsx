import { PageHeader } from "@/components/ui/PageHeader";
import { EtapaLista } from "@/components/esteira/EtapaLista";
import { NovoProcessoButton } from "@/components/operacoes/NovoProcessoButton";
import { listOperacoesPorStatus, listEquipe } from "@/lib/data/operacoes";
import { ETAPAS } from "@/lib/status";

export default async function AquisicaoPage() {
  const [operacoes, equipe] = await Promise.all([
    listOperacoesPorStatus(ETAPAS.aquisicao.statuses),
    listEquipe(),
  ]);

  return (
    <div>
      <PageHeader
        title="Aquisição"
        actions={<NovoProcessoButton equipe={equipe} statusInicial="aguardando_leilao" />}
      />
      <p className="mb-4 text-sm text-foreground-secondary">
        Compras aprovadas: lances e propostas, documentação, pagamentos e desocupação. O status
        de cada imóvel indica em que ponto da aquisição ele está.
      </p>
      <EtapaLista operacoes={operacoes} tabDetalhe={ETAPAS.aquisicao.tabDetalhe} />
    </div>
  );
}
