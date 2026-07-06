"use client";

import { useEffect, useState } from "react";
import type { Operacao, Profile } from "@/types/database";
import { ORIGEM_LABELS } from "@/lib/status";
import { ESTADOS_BR } from "@/lib/estados";

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
  statusInicial,
}: {
  action: (formData: FormData) => void;
  operacao?: Operacao;
  equipe: Pick<Profile, "id" | "nome">[];
  submitLabel?: string;
  statusInicial?: string;
}) {
  const [uf, setUf] = useState(operacao?.estado ?? "");
  const [cidades, setCidades] = useState<string[]>([]);

  useEffect(() => {
    if (!uf) return;
    let ativo = true;
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`)
      .then((r) => r.json())
      .then((data: { nome: string }[]) => {
        if (ativo) setCidades(data.map((m) => m.nome));
      })
      .catch(() => {
        if (ativo) setCidades([]);
      });
    return () => {
      ativo = false;
    };
  }, [uf]);

  return (
    <form action={action} className="space-y-4">
      {statusInicial && <input type="hidden" name="status" value={statusInicial} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-foreground-secondary">
            Nome do processo
          </label>
          <input
            name="nome_processo"
            defaultValue={operacao?.nome_processo ?? ""}
            placeholder="Ex: Apartamento Centro — Leilão Caixa"
            className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
        </div>

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
            Estado (UF)
          </label>
          <select
            name="estado"
            value={uf}
            onChange={(e) => {
              setUf(e.target.value);
              if (!e.target.value) setCidades([]);
            }}
            className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-brand-primary"
          >
            <option value="">Selecione o estado</option>
            {ESTADOS_BR.map((e) => (
              <option key={e.sigla} value={e.sigla}>
                {e.sigla} — {e.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-foreground-secondary">
            Cidade
          </label>
          <input
            name="cidade"
            list="lista-cidades"
            defaultValue={operacao?.cidade ?? ""}
            disabled={!uf}
            placeholder={uf ? "Digite para pesquisar..." : "Escolha o estado primeiro"}
            className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary disabled:bg-black/[0.03]"
          />
          <datalist id="lista-cidades">
            {cidades.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
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
            Nº do processo / edital
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

        <div>
          <label className="mb-1 block text-xs font-medium text-foreground-secondary">
            Valor anunciado / lance inicial
          </label>
          <input
            name="valor_anuncio"
            type="number"
            step="0.01"
            defaultValue={operacao?.valor_anuncio ?? ""}
            className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-foreground-secondary">
            Características (quartos, vagas, condição do imóvel...)
          </label>
          <textarea
            name="caracteristicas"
            rows={2}
            defaultValue={operacao?.caracteristicas ?? ""}
            className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
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
