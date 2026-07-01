"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { gerarParecer } from "@/lib/anthropic";

const NUMERIC_FIELDS = [
  "lance",
  "comissao_compra",
  "itbi",
  "registro",
  "custas",
  "impostos_compra",
  "materiais",
  "mao_de_obra",
  "reserva_reforma",
  "valor_esperado",
  "comissao_venda",
  "impostos_venda",
] as const;

export async function saveViabilidade(operacaoId: string, formData: FormData) {
  const supabase = await createClient();

  const values = Object.fromEntries(
    NUMERIC_FIELDS.map((field) => [field, Number(formData.get(field) ?? 0) || 0])
  );
  const prazoRaw = String(formData.get("prazo_estimado_meses") ?? "");

  const { data: existing } = await supabase
    .from("analise_viabilidade")
    .select("id")
    .eq("operacao_id", operacaoId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const payload = {
    ...values,
    prazo_estimado_meses: prazoRaw ? Number(prazoRaw) : null,
  };

  if (existing) {
    const { error } = await supabase
      .from("analise_viabilidade")
      .update(payload)
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("analise_viabilidade")
      .insert({ operacao_id: operacaoId, ...payload });
    if (error) throw error;
  }

  revalidatePath(`/operacoes/${operacaoId}/viabilidade`);
}

export async function gerarParecerAction(operacaoId: string) {
  const supabase = await createClient();

  const { data: viabilidade, error } = await supabase
    .from("analise_viabilidade")
    .select("*")
    .eq("operacao_id", operacaoId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!viabilidade) throw new Error("Preencha e salve a análise antes de gerar o parecer.");

  const parecer = await gerarParecer(viabilidade);

  const { error: updateError } = await supabase
    .from("analise_viabilidade")
    .update({ parecer_ia: parecer })
    .eq("id", viabilidade.id);
  if (updateError) throw updateError;

  revalidatePath(`/operacoes/${operacaoId}/viabilidade`);
  return parecer;
}
