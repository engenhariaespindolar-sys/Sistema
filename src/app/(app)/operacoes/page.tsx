import { PageHeader } from "@/components/ui/PageHeader";
import { OperacoesView } from "@/components/operacoes/OperacoesView";
import { NovoProcessoButton } from "@/components/operacoes/NovoProcessoButton";
import { listOperacoes, listEquipe } from "@/lib/data/operacoes";

export default async function OperacoesPage() {
  const [operacoes, equipe] = await Promise.all([listOperacoes(), listEquipe()]);
  const equipeMap = Object.fromEntries(equipe.map((p) => [p.id, p.nome ?? "Sem nome"]));

  return (
    <div>
      <PageHeader
        title="Operações"
        actions={<NovoProcessoButton equipe={equipe} statusInicial="prospeccao" />}
      />
      <OperacoesView operacoes={operacoes} equipeMap={equipeMap} />
    </div>
  );
}
