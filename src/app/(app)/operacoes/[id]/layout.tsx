import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OperacaoTabs } from "@/components/operacoes/OperacaoTabs";
import { EtapaAcoes } from "@/components/esteira/EtapaAcoes";
import { getOperacao } from "@/lib/data/operacoes";
import { operacaoStatusInfo } from "@/lib/status";

export default async function OperacaoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const operacao = await getOperacao(id);

  if (!operacao) notFound();

  const info = operacaoStatusInfo(operacao.status);

  return (
    <div>
      <PageHeader
        title={operacao.endereco}
        breadcrumb={["Operações", operacao.codigo]}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge label={info.label} tone={info.tone} />
            <EtapaAcoes operacao={operacao} />
          </div>
        }
      />
      <OperacaoTabs id={id} />
      {children}
    </div>
  );
}
