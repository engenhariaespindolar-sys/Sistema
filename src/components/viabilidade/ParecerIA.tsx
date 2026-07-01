"use client";

import { useState, useTransition } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { gerarParecerAction } from "@/app/(app)/operacoes/[id]/viabilidade/actions";

export function ParecerIA({ operacaoId, parecerInicial }: { operacaoId: string; parecerInicial: string | null }) {
  const [parecer, setParecer] = useState(parecerInicial);
  const [erro, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function gerar() {
    setErro(null);
    startTransition(async () => {
      try {
        const resultado = await gerarParecerAction(operacaoId);
        setParecer(resultado);
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Não foi possível gerar o parecer agora.");
      }
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-primary" /> Parecer da IA
        </CardTitle>
        <button
          onClick={gerar}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-lg border border-brand-primary px-3 py-1.5 text-xs font-medium text-brand-primary hover:bg-brand-primary-light disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {parecer ? "Regenerar" : "Gerar parecer"}
        </button>
      </CardHeader>
      <CardContent>
        {erro && <p className="text-sm text-danger">{erro}</p>}
        {!erro && parecer && <p className="text-sm text-foreground whitespace-pre-wrap">{parecer}</p>}
        {!erro && !parecer && !isPending && (
          <p className="text-sm text-foreground-secondary">
            Nenhum parecer gerado ainda. Essa ação é opcional.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
