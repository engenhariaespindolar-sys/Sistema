"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { HistoricoEvento } from "@/types/database";

async function getOrCreate(operacaoId: string) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("desocupacao")
    .select("id, historico")
    .eq("operacao_id", operacaoId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return { supabase, existing };
}

export async function saveDesocupacao(operacaoId: string, formData: FormData) {
  const { supabase, existing } = await getOrCreate(operacaoId);

  const payload = {
    situacao: String(formData.get("situacao") ?? "") || null,
    custo_total: Number(formData.get("custo_total") ?? 0) || 0,
    data_inicio: String(formData.get("data_inicio") ?? "") || null,
    data_previsao: String(formData.get("data_previsao") ?? "") || null,
    data_conclusao: String(formData.get("data_conclusao") ?? "") || null,
    observacoes: String(formData.get("observacoes") ?? "") || null,
  };

  if (existing) {
    const { error } = await supabase.from("desocupacao").update(payload).eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("desocupacao")
      .insert({ operacao_id: operacaoId, ...payload });
    if (error) throw error;
  }

  revalidatePath(`/operacoes/${operacaoId}/desocupacao`);
}

export async function addEventoDesocupacao(operacaoId: string, formData: FormData) {
  const { supabase, existing } = await getOrCreate(operacaoId);
  const descricao = String(formData.get("descricao") ?? "").trim();
  if (!descricao) return;

  const evento: HistoricoEvento = { data: new Date().toISOString(), descricao };

  if (existing) {
    const historico = [...((existing.historico as HistoricoEvento[]) ?? []), evento];
    const { error } = await supabase.from("desocupacao").update({ historico }).eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("desocupacao")
      .insert({ operacao_id: operacaoId, historico: [evento] });
    if (error) throw error;
  }

  revalidatePath(`/operacoes/${operacaoId}/desocupacao`);
}
