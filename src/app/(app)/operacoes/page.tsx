import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { OperacoesView } from "@/components/operacoes/OperacoesView";
import { listOperacoes, listEquipe } from "@/lib/data/operacoes";

export default async function OperacoesPage() {
  const [operacoes, equipe] = await Promise.all([listOperacoes(), listEquipe()]);
  const equipeMap = Object.fromEntries(equipe.map((p) => [p.id, p.nome ?? "Sem nome"]));

  return (
    <div>
      <PageHeader
        title="Operações"
        actions={
          <Link
            href="/operacoes/nova"
            className="flex items-center gap-1.5 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover"
          >
            <Plus className="h-4 w-4" />
            Nova operação
          </Link>
        }
      />
      <OperacoesView operacoes={operacoes} equipeMap={equipeMap} />
    </div>
  );
}
