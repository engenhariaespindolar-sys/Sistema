import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EtapaLista } from "@/components/esteira/EtapaLista";
import { listOperacoesPorStatus } from "@/lib/data/operacoes";
import { ETAPAS } from "@/lib/status";

export default async function ProspeccaoPage() {
  const operacoes = await listOperacoesPorStatus(ETAPAS.prospeccao.statuses);

  return (
    <div>
      <PageHeader
        title="Prospecção"
        actions={
          <Link
            href="/prospeccao/novo"
            className="flex items-center gap-1.5 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover"
          >
            <Plus className="h-4 w-4" />
            Novo imóvel
          </Link>
        }
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
