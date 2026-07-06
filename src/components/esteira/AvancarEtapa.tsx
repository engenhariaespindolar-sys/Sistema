"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateOperacaoStatus } from "@/app/(app)/operacoes/actions";

export function AvancarEtapa({
  operacaoId,
  novoStatus,
  label,
  icon: Icon = ArrowRight,
  variante = "primario",
  redirecionarPara,
}: {
  operacaoId: string;
  novoStatus: string;
  label: string;
  icon?: LucideIcon;
  variante?: "primario" | "secundario" | "perigo";
  redirecionarPara?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function avancar() {
    startTransition(async () => {
      await updateOperacaoStatus(operacaoId, novoStatus);
      if (redirecionarPara) {
        router.push(redirecionarPara);
      }
      router.refresh();
    });
  }

  return (
    <button
      onClick={avancar}
      disabled={isPending}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50",
        variante === "primario" && "bg-brand-primary text-white hover:bg-brand-primary-hover",
        variante === "secundario" &&
          "border border-border-subtle text-foreground-secondary hover:bg-black/[0.03]",
        variante === "perigo" && "border border-danger text-danger hover:bg-danger-light"
      )}
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {label}
    </button>
  );
}
