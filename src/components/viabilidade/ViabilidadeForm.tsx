"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { AnaliseViabilidade } from "@/types/database";

const FIELDS: { key: keyof typeof INITIAL; label: string; grupo: "Compra" | "Reforma" | "Venda" }[] = [
  { key: "lance", label: "Lance", grupo: "Compra" },
  { key: "comissao_compra", label: "Comissão do leiloeiro", grupo: "Compra" },
  { key: "itbi", label: "ITBI", grupo: "Compra" },
  { key: "registro", label: "Registro", grupo: "Compra" },
  { key: "custas", label: "Custas", grupo: "Compra" },
  { key: "impostos_compra", label: "Impostos da compra", grupo: "Compra" },
  { key: "materiais", label: "Materiais", grupo: "Reforma" },
  { key: "mao_de_obra", label: "Mão de obra", grupo: "Reforma" },
  { key: "reserva_reforma", label: "Reserva de contingência", grupo: "Reforma" },
  { key: "valor_esperado", label: "Valor esperado de venda", grupo: "Venda" },
  { key: "comissao_venda", label: "Comissão de venda", grupo: "Venda" },
  { key: "impostos_venda", label: "Impostos da venda", grupo: "Venda" },
];

const INITIAL = {
  lance: 0,
  comissao_compra: 0,
  itbi: 0,
  registro: 0,
  custas: 0,
  impostos_compra: 0,
  materiais: 0,
  mao_de_obra: 0,
  reserva_reforma: 0,
  valor_esperado: 0,
  comissao_venda: 0,
  impostos_venda: 0,
};

function computeCapital(v: typeof INITIAL) {
  return (
    v.lance +
    v.comissao_compra +
    v.itbi +
    v.registro +
    v.custas +
    v.impostos_compra +
    v.materiais +
    v.mao_de_obra +
    v.reserva_reforma
  );
}

function cenario(valorEsperado: number, capital: number) {
  const lucro = valorEsperado - capital;
  const roi = capital > 0 ? (lucro / capital) * 100 : 0;
  return { valorEsperado, lucro, roi };
}

export function ViabilidadeForm({
  action,
  viabilidade,
}: {
  action: (formData: FormData) => void;
  viabilidade: AnaliseViabilidade | null;
}) {
  const [values, setValues] = useState<typeof INITIAL>(() => ({
    ...INITIAL,
    lance: viabilidade?.lance ?? 0,
    comissao_compra: viabilidade?.comissao_compra ?? 0,
    itbi: viabilidade?.itbi ?? 0,
    registro: viabilidade?.registro ?? 0,
    custas: viabilidade?.custas ?? 0,
    impostos_compra: viabilidade?.impostos_compra ?? 0,
    materiais: viabilidade?.materiais ?? 0,
    mao_de_obra: viabilidade?.mao_de_obra ?? 0,
    reserva_reforma: viabilidade?.reserva_reforma ?? 0,
    valor_esperado: viabilidade?.valor_esperado ?? 0,
    comissao_venda: viabilidade?.comissao_venda ?? 0,
    impostos_venda: viabilidade?.impostos_venda ?? 0,
  }));
  const [prazo, setPrazo] = useState(viabilidade?.prazo_estimado_meses ?? "");

  const capital = useMemo(() => computeCapital(values), [values]);
  const lucro = values.valor_esperado - capital;
  const roi = capital > 0 ? (lucro / capital) * 100 : 0;

  const cenarios = useMemo(
    () => ({
      otimista: cenario(values.valor_esperado * 1.1, capital),
      provavel: cenario(values.valor_esperado, capital),
      conservador: cenario(values.valor_esperado * 0.9, capital),
    }),
    [values, capital]
  );

  function update(key: keyof typeof INITIAL, value: string) {
    setValues((prev) => ({ ...prev, [key]: Number(value) || 0 }));
  }

  const grupos: (typeof FIELDS[number]["grupo"])[] = ["Compra", "Reforma", "Venda"];

  return (
    <div className="space-y-4">
      <form action={action} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {grupos.map((grupo) => (
            <Card key={grupo}>
              <CardHeader>
                <CardTitle>{grupo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {FIELDS.filter((f) => f.grupo === grupo).map((f) => (
                  <div key={f.key}>
                    <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                      {f.label}
                    </label>
                    <input
                      name={f.key}
                      type="number"
                      step="0.01"
                      value={values[f.key]}
                      onChange={(e) => update(f.key, e.target.value)}
                      className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                    />
                  </div>
                ))}
                {grupo === "Venda" && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                      Prazo estimado (meses)
                    </label>
                    <input
                      name="prazo_estimado_meses"
                      type="number"
                      value={prazo}
                      onChange={(e) => setPrazo(e.target.value)}
                      className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="flex flex-wrap items-center gap-8 pt-5">
            <div>
              <div className="text-xs text-foreground-secondary">Capital necessário</div>
              <div className="text-xl font-semibold text-foreground">{formatCurrency(capital)}</div>
            </div>
            <div>
              <div className="text-xs text-foreground-secondary">Lucro bruto estimado</div>
              <div className={`text-xl font-semibold ${lucro >= 0 ? "text-success" : "text-danger"}`}>
                {formatCurrency(lucro)}
              </div>
            </div>
            <div>
              <div className="text-xs text-foreground-secondary">ROI estimado</div>
              <div className={`text-xl font-semibold ${roi >= 0 ? "text-success" : "text-danger"}`}>
                {formatPercent(roi)}
              </div>
            </div>
            <button
              type="submit"
              className="ml-auto rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-primary-hover"
            >
              Salvar análise
            </button>
          </CardContent>
        </Card>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(
          [
            ["Otimista", cenarios.otimista, "success"],
            ["Provável", cenarios.provavel, "info"],
            ["Conservador", cenarios.conservador, "warning"],
          ] as const
        ).map(([label, dados, tone]) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle
                className={
                  tone === "success"
                    ? "text-success"
                    : tone === "warning"
                      ? "text-[#a15c00]"
                      : "text-info"
                }
              >
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground-secondary">Venda</span>
                <span>{formatCurrency(dados.valorEsperado)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-secondary">Lucro</span>
                <span>{formatCurrency(dados.lucro)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-secondary">ROI</span>
                <span>{formatPercent(dados.roi)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
