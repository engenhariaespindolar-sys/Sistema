"use client";

import { useState, useTransition } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { sugerirReformaAction } from "@/app/(app)/operacoes/[id]/reforma/actions";

export function SugestaoReformaIA({ tipo, area }: { tipo: string; area: number | null }) {
  const [sugestao, setSugestao] = useState<Awaited<ReturnType<typeof sugerirReformaAction>> | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function gerar() {
    setErro(null);
    startTransition(async () => {
      try {
        const resultado = await sugerirReformaAction(tipo, area ?? 0);
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
          <Sparkles className="h-4 w-4 text-brand-primary" /> Sugestão da IA (cronograma e materiais)
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
      <CardContent>
        {erro && <p className="text-sm text-danger">{erro}</p>}
        {!erro && !sugestao && !isPending && (
          <p className="text-sm text-foreground-secondary">
            Nenhuma sugestão gerada ainda. Essa ação é opcional e não é salva no banco.
          </p>
        )}
        {sugestao && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="mb-1 text-xs font-medium text-foreground-secondary">Cronograma</p>
              <ul className="space-y-1 text-sm">
                {sugestao.cronograma.map((fase, i) => (
                  <li key={i}>
                    {fase.fase} — {fase.duracao_dias} dias
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-foreground-secondary">Materiais</p>
              <ul className="list-inside list-disc space-y-1 text-sm">
                {sugestao.materiais.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-foreground-secondary">Sequência de execução</p>
              <ol className="list-inside list-decimal space-y-1 text-sm">
                {sugestao.sequencia.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
