"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sugerirReforma } from "@/lib/anthropic";

export async function saveReforma(operacaoId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("reforma")
    .select("id")
    .eq("operacao_id", operacaoId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const payload = {
    orcamento_total: Number(formData.get("orcamento_total") ?? 0) || 0,
    data_inicio: String(formData.get("data_inicio") ?? "") || null,
    data_previsao_fim: String(formData.get("data_previsao_fim") ?? "") || null,
    data_conclusao: String(formData.get("data_conclusao") ?? "") || null,
    status: String(formData.get("status") ?? "planejamento"),
  };

  if (existing) {
    const { error } = await supabase.from("reforma").update(payload).eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("reforma").insert({ operacao_id: operacaoId, ...payload });
    if (error) throw error;
  }

  revalidatePath(`/operacoes/${operacaoId}/reforma`);
}

export async function addDiario(reformaId: string, operacaoId: string, formData: FormData) {
  const supabase = await createClient();
  const fotos = String(formData.get("fotos_urls") ?? "")
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);

  const { error } = await supabase.from("reforma_diario").insert({
    reforma_id: reformaId,
    data: String(formData.get("data") ?? "") || new Date().toISOString().slice(0, 10),
    descricao: String(formData.get("descricao") ?? "") || null,
    custo_dia: Number(formData.get("custo_dia") ?? 0) || 0,
    fotos_urls: fotos,
  });
  if (error) throw error;

  revalidatePath(`/operacoes/${operacaoId}/reforma`);
}

export async function addItem(reformaId: string, operacaoId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("reforma_itens").insert({
    reforma_id: reformaId,
    tipo: String(formData.get("tipo") ?? "servico"),
    descricao: String(formData.get("descricao") ?? ""),
    fornecedor_id: String(formData.get("fornecedor_id") ?? "") || null,
    quantidade: Number(formData.get("quantidade") ?? 0) || null,
    unidade: String(formData.get("unidade") ?? "") || null,
    valor_previsto: Number(formData.get("valor_previsto") ?? 0) || 0,
  });
  if (error) throw error;

  revalidatePath(`/operacoes/${operacaoId}/reforma`);
}

export async function updateItem(operacaoId: string, formData: FormData) {
  const supabase = await createClient();
  const itemId = String(formData.get("id") ?? "");

  const { error } = await supabase
    .from("reforma_itens")
    .update({
      valor_realizado: Number(formData.get("valor_realizado") ?? 0) || 0,
      status: String(formData.get("status") ?? "pendente"),
    })
    .eq("id", itemId);
  if (error) throw error;

  revalidatePath(`/operacoes/${operacaoId}/reforma`);
}

export async function deleteItem(operacaoId: string, formData: FormData) {
  const supabase = await createClient();
  const itemId = String(formData.get("id") ?? "");

  const { error } = await supabase.from("reforma_itens").delete().eq("id", itemId);
  if (error) throw error;

  revalidatePath(`/operacoes/${operacaoId}/reforma`);
}

export async function sugerirReformaAction(tipo: string, area: number) {
  return sugerirReforma(tipo, area || 0);
}
