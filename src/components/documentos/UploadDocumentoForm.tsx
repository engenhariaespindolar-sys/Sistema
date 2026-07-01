"use client";

import { useRef, useState, useTransition } from "react";
import { Upload, Loader2 } from "lucide-react";

const TIPOS = [
  { value: "edital", label: "Edital" },
  { value: "matricula", label: "Matrícula" },
  { value: "foto", label: "Foto" },
  { value: "contrato", label: "Contrato" },
  { value: "procuracao", label: "Procuração" },
  { value: "laudo", label: "Laudo" },
  { value: "escritura", label: "Escritura" },
  { value: "comprovante", label: "Comprovante" },
  { value: "outro", label: "Outro" },
];

export function UploadDocumentoForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setErro(null);
    startTransition(async () => {
      try {
        await action(formData);
        formRef.current?.reset();
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Não foi possível enviar o documento.");
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-foreground-secondary">Tipo</label>
        <select
          name="tipo"
          defaultValue="outro"
          className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm"
        >
          {TIPOS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-foreground-secondary">Nome</label>
        <input
          name="nome"
          placeholder="Opcional"
          className="rounded-lg border border-border-subtle px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-foreground-secondary">Arquivo</label>
        <input name="arquivo" type="file" required className="text-sm" />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover disabled:opacity-50"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        Enviar
      </button>
      {erro && <p className="w-full text-sm text-danger">{erro}</p>}
    </form>
  );
}
