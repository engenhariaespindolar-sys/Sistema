import { PageHeader } from "@/components/ui/PageHeader";
import { EtapaLista } from "@/components/esteira/EtapaLista";
import { listOperacoesPorStatus } from "@/lib/data/operacoes";
import { ETAPAS } from "@/lib/status";

export default async function AquisicaoPage() {
  const operacoes = await listOperacoesPorStatus(ETAPAS.aquisicao.statuses);

  return (
    <div>
      <PageHeader title="Aquisição" />
      <p className="mb-4 text-sm text-foreground-secondary">
        Compras aprovadas: lances e propostas, documentação, pagamentos e desocupação. O status
        de cada imóvel indica em que ponto da aquisição ele está.
      </p>
      <EtapaLista operacoes={operacoes} tabDetalhe={ETAPAS.aquisicao.tabDetalhe} />
    </div>
  );
}
