"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { OperacaoForm } from "./OperacaoForm";
import { createOperacao } from "@/app/(app)/operacoes/actions";
import type { Profile } from "@/types/database";

export function NovoProcessoButton({
  equipe,
  statusInicial = "prospeccao",
}: {
  equipe: Pick<Profile, "id" | "nome">[];
  statusInicial?: string;
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="flex items-center gap-1.5 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover"
      >
        <Plus className="h-4 w-4" />
        Novo processo
      </button>

      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4"
          onClick={() => setAberto(false)}
        >
          <div
            className="my-8 w-full max-w-2xl rounded-xl bg-surface shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
              <h2 className="text-base font-medium text-foreground">Novo processo</h2>
              <button
                onClick={() => setAberto(false)}
                className="rounded-full p-1 text-foreground-secondary hover:bg-black/[0.04]"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-5 py-5">
              <OperacaoForm
                action={createOperacao}
                equipe={equipe}
                statusInicial={statusInicial}
                submitLabel="Cadastrar processo"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
