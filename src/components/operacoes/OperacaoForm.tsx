import type { Operacao, Profile } from "@/types/database";
import { ORIGEM_LABELS } from "@/lib/status";

const TIPOS: { value: Operacao["tipo"]; label: string }[] = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "terreno", label: "Terreno" },
  { value: "comercial", label: "Comercial" },
  { value: "outro", label: "Outro" },
];

export function OperacaoForm({
  action,
  operacao,
  equipe,
  submitLabel = "Salvar",
}: {
  action: (formData: FormData) => void;
  operacao?: Operacao;
  equipe: Pick<Profile, "id" | "nome">[];
  submitLabel?: string;
}) {
  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-foreground-secondary">
            Endereço
          </label>
          <input
            name="endereco"
            required
            defaultValue={operacao?.endereco}
            className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-foreground-secondary">
            Cidade
          </label>
          <input
            name="cidade"
            defaultValue={operacao?.cidade ?? ""}
            className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-foreground-secondary">
            Estado (UF)
          </label>
          <input
            name="estado"
            maxLength={2}
            defaultValue={operacao?.estado ?? ""}
            className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm uppercase outline-none focus:border-brand-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-foreground-secondary">
            Tipo do imóvel
          </label>
          <select
            name="tipo"
            defaultValue={operacao?.tipo ?? "apartamento"}
            className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-brand-primary"
          >
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-foreground-secondary">
            Área (m²)
          </label>
          <input
            name="area"
            type="number"
            step="0.01"
            defaultValue={operacao?.area ?? ""}
            className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-foreground-secondary">
            Matrícula
          </label>
          <input
            name="matricula"
            defaultValue={operacao?.matricula ?? ""}
            className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-foreground-secondary">
            Processo / edital
          </label>
          <input
            name="processo"
            defaultValue={operacao?.processo ?? ""}
            className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-foreground-secondary">
            Origem
          </label>
          <select
            name="origem"
            defaultValue={operacao?.origem ?? ""}
            className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-brand-primary"
          >
            <option value="">Não informado</option>
            {Object.entries(ORIGEM_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-foreground-secondary">
            Link do edital
          </label>
          <input
            name="edital_url"
            type="url"
            defaultValue={operacao?.edital_url ?? ""}
            placeholder="https://..."
            className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-foreground-secondary">
            Responsável
          </label>
          <select
            name="responsavel_id"
            defaultValue={operacao?.responsavel_id ?? ""}
            className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-brand-primary"
          >
            <option value="">Sem responsável definido</option>
            {equipe.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome ?? "Sem nome"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-primary-hover"
      >
        {submitLabel}
      </button>
    </form>
  );
}
