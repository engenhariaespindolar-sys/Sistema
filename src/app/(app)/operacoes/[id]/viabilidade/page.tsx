import { ViabilidadeForm } from "@/components/viabilidade/ViabilidadeForm";
import { ParecerIA } from "@/components/viabilidade/ParecerIA";
import { DecisaoPanel } from "@/components/viabilidade/DecisaoPanel";
import { getViabilidade } from "@/lib/data/viabilidade";
import { getOperacao } from "@/lib/data/operacoes";
import { saveViabilidade } from "./actions";

export default async function ViabilidadePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [viabilidade, operacao] = await Promise.all([getViabilidade(id), getOperacao(id)]);
  const saveWithId = saveViabilidade.bind(null, id);

  return (
    <div className="space-y-4">
      <ViabilidadeForm action={saveWithId} viabilidade={viabilidade} />
      <ParecerIA operacaoId={id} parecerInicial={viabilidade?.parecer_ia ?? null} />
      {operacao && <DecisaoPanel operacaoId={id} status={operacao.status} />}
    </div>
  );
}
