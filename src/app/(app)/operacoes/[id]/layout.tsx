import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OperacaoTabs } from "@/components/operacoes/OperacaoTabs";
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
        actions={<StatusBadge label={info.label} tone={info.tone} />}
      />
      <OperacaoTabs id={id} />
      {children}
    </div>
  );
}
