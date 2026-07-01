import { ViabilidadeForm } from "@/components/viabilidade/ViabilidadeForm";
import { ParecerIA } from "@/components/viabilidade/ParecerIA";
import { getViabilidade } from "@/lib/data/viabilidade";
import { saveViabilidade } from "./actions";

export default async function ViabilidadePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const viabilidade = await getViabilidade(id);
  const saveWithId = saveViabilidade.bind(null, id);

  return (
    <div className="space-y-4">
      <ViabilidadeForm action={saveWithId} viabilidade={viabilidade} />
      <ParecerIA operacaoId={id} parecerInicial={viabilidade?.parecer_ia ?? null} />
    </div>
  );
}
