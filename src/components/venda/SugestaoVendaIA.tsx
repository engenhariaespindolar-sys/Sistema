"use client";

import { useState, useTransition } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { sugerirVendaAction } from "@/app/(app)/operacoes/[id]/venda/actions";

export function SugestaoVendaIA({ operacaoId }: { operacaoId: string }) {
  const [sugestao, setSugestao] = useState<Awaited<ReturnType<typeof sugerirVendaAction>> | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function gerar() {
    setErro(null);
    startTransition(async () => {
      try {
        const resultado = await sugerirVendaAction(operacaoId);
        setSugestao(resultado);
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Não foi possível gerar a sugestão agora.");
      }
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-primary" /> Sugestão da IA (valor e anúncio)
        </CardTitle>
        <button
          onClick={gerar}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-lg border border-brand-primary px-3 py-1.5 text-xs font-medium text-brand-primary hover:bg-brand-primary-light disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {sugestao ? "Regenerar" : "Gerar sugestão"}
        </button>
      </CardHeader>
      <CardContent className="space-y-2">
        {erro && <p className="text-sm text-danger">{erro}</p>}
        {!erro && !sugestao && !isPending && (
          <p className="text-sm text-foreground-secondary">
            Nenhuma sugestão gerada ainda. Essa ação é opcional e não é salva no banco.
          </p>
        )}
        {sugestao && (
          <>
            <p className="text-sm">
              <span className="font-medium text-foreground-secondary">Valor sugerido: </span>
              {sugestao.valor}
            </p>
            <p className="text-sm">
              <span className="font-medium text-foreground-secondary">Faixa de negociação: </span>
              {sugestao.faixa_negociacao}
            </p>
            <p className="whitespace-pre-wrap rounded-lg bg-black/[0.03] p-3 text-sm">
              {sugestao.texto_anuncio}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
