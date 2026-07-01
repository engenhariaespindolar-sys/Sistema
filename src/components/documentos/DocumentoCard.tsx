"use client";

import { useState, useTransition } from "react";
import { FileText, Sparkles, Trash2, Loader2, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import type { Documento } from "@/types/database";

export function DocumentoCard({
  documento,
  signedUrl,
  onResumir,
  onExcluir,
}: {
  documento: Documento;
  signedUrl: string | null;
  onResumir: (id: string) => Promise<string>;
  onExcluir: (id: string, path: string) => Promise<void>;
}) {
  const [resumo, setResumo] = useState(documento.resumo_ia);
  const [erro, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function resumir() {
    setErro(null);
    startTransition(async () => {
      try {
        const texto = await onResumir(documento.id);
        setResumo(texto);
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Não foi possível resumir agora.");
      }
    });
  }

  function excluir() {
    startTransition(async () => {
      await onExcluir(documento.id, documento.url);
    });
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">{documento.nome}</p>
              <p className="text-xs text-foreground-secondary">
                {documento.tipo} · {formatDate(documento.created_at)}
              </p>
            </div>
          </div>
          <button onClick={excluir} disabled={isPending} className="text-foreground-secondary hover:text-danger">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {signedUrl && (
          <a
            href={signedUrl}
            target="_blank"
            rel="noreferrer"
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-brand-primary hover:underline"
          >
            Abrir arquivo <ExternalLink className="h-3 w-3" />
          </a>
        )}

        {erro && <p className="text-xs text-danger">{erro}</p>}
        {resumo && <p className="mt-1 rounded-lg bg-black/[0.03] p-2 text-xs text-foreground">{resumo}</p>}

        <button
          onClick={resumir}
          disabled={isPending}
          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-brand-primary hover:underline disabled:opacity-50"
        >
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
          {resumo ? "Resumir novamente com IA" : "Resumir com IA"}
        </button>
      </CardContent>
    </Card>
  );
}
