import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { OperacaoForm } from "@/components/operacoes/OperacaoForm";
import { listEquipe } from "@/lib/data/operacoes";
import { createOperacao } from "../actions";

export default async function NovaOperacaoPage() {
  const equipe = await listEquipe();

  return (
    <div>
      <PageHeader title="Nova operação" breadcrumb={["Operações", "Nova"]} />
      <Card className="max-w-2xl">
        <CardContent className="pt-5">
          <OperacaoForm action={createOperacao} equipe={equipe} submitLabel="Criar operação" />
        </CardContent>
      </Card>
    </div>
  );
}
