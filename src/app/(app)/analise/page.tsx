import { PageHeader } from "@/components/ui/PageHeader";
import { EtapaLista } from "@/components/esteira/EtapaLista";
import { listOperacoesPorStatus } from "@/lib/data/operacoes";
import { ETAPAS } from "@/lib/status";

export default async function AnalisePage() {
  const operacoes = await listOperacoesPorStatus(ETAPAS.analise.statuses);

  return (
    <div>
      <PageHeader title="Análise" />
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
