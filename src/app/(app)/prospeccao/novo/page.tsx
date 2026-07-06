import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { OperacaoForm } from "@/components/operacoes/OperacaoForm";
import { listEquipe } from "@/lib/data/operacoes";
import { createOperacao } from "@/app/(app)/operacoes/actions";

export default async function NovoImovelPage() {
  const equipe = await listEquipe();

  return (
    <div>
      <PageHeader title="Novo imóvel" breadcrumb={["Prospecção", "Novo"]} />
      <Card className="max-w-2xl">
        <CardContent className="pt-5">
          <OperacaoForm action={createOperacao} equipe={equipe} submitLabel="Cadastrar imóvel" />
        </CardContent>
      </Card>
    </div>
  );
}
