"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CircleX, Eye, CircleCheck, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { updateOperacaoStatus } from "@/app/(app)/operacoes/actions";
import type { OperacaoStatus } from "@/types/database";

export function DecisaoPanel({ operacaoId, status }: { operacaoId: string; status: OperacaoStatus }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function decidir(novoStatus: string) {
    startTransition(async () => {
      await updateOperacaoStatus(operacaoId, novoStatus);
      router.refresh();
    });
  }

  const jaDecidiu = status !== "em_analise";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Decisão</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm text-foreground-secondary">
          Com base na análise acima, o que fazemos com essa oportunidade?
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => decidir("descartado")}
            disabled={isPending}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50",
              status === "descartado"
                ? "border-danger bg-danger-light text-danger"
                : "border-border-subtle text-foreground-secondary hover:bg-black/[0.03]"
            )}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CircleX className="h-4 w-4" />}
            Descartar
          </button>

          <button
            onClick={() => decidir("em_analise")}
            disabled={isPending}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50",
              status === "em_analise"
                ? "border-info bg-info-light text-info"
                : "border-border-subtle text-foreground-secondary hover:bg-black/[0.03]"
            )}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
            Continuar acompanhando
          </button>

          <button
            onClick={() => decidir("aguardando_leilao")}
            disabled={isPending}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50",
              jaDecidiu && status !== "descartado"
                ? "border-success bg-success-light text-success"
                : "border-border-subtle text-foreground-secondary hover:bg-black/[0.03]"
            )}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CircleCheck className="h-4 w-4" />}
            Aprovar compra
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
