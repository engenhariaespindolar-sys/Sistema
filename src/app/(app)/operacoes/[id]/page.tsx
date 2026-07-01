import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { OperacaoForm } from "@/components/operacoes/OperacaoForm";
import { getOperacao, listEquipe } from "@/lib/data/operacoes";
import { createClient } from "@/lib/supabase/server";
import { updateOperacao, deleteOperacao } from "../actions";

export default async function OperacaoOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [operacao, equipe] = await Promise.all([getOperacao(id), listEquipe()]);
  if (!operacao) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id ?? "")
    .maybeSingle();
  const isAdmin = profile?.role === "admin";

  const updateWithId = updateOperacao.bind(null, id);
  const deleteWithId = deleteOperacao.bind(null, id);

  return (
    <div className="space-y-4">
      <Card className="max-w-2xl">
        <CardContent className="pt-5">
          <OperacaoForm action={updateWithId} operacao={operacao} equipe={equipe} />
        </CardContent>
      </Card>

      {isAdmin && (
        <Card className="max-w-2xl border-danger/30">
          <CardContent className="flex items-center justify-between pt-5">
            <div>
              <p className="text-sm font-medium text-foreground">Excluir operação</p>
              <p className="text-xs text-foreground-secondary">
                Remove a operação e todos os dados vinculados a ela. Essa ação não pode ser desfeita.
              </p>
            </div>
            <form action={deleteWithId}>
              <button
                type="submit"
                className="rounded-lg border border-danger px-4 py-2 text-sm font-medium text-danger hover:bg-danger-light"
              >
                Excluir
              </button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
