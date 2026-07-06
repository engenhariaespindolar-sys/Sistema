"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sugerirVenda } from "@/lib/anthropic";

function parseLista(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

async function getOrCreate(operacaoId: string) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("venda")
    .select("id, visitas, propostas")
    .eq("operacao_id", operacaoId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return { supabase, existing };
}

export async function saveVenda(operacaoId: string, formData: FormData) {
  const { supabase, existing } = await getOrCreate(operacaoId);

  const payload = {
    valor_anunciado: Number(formData.get("valor_anunciado") ?? 0) || null,
    valor_negociado: Number(formData.get("valor_negociado") ?? 0) || null,
    corretores: parseLista(formData.get("corretores")),
    portais: parseLista(formData.get("portais")),
    data_contrato: String(formData.get("data_contrato") ?? "") || null,
    data_escritura: String(formData.get("data_escritura") ?? "") || null,
    status: String(formData.get("status") ?? "anunciado"),
    financiamento_mcmv: formData.get("financiamento_mcmv") === "on",
    status_financiamento: String(formData.get("status_financiamento") ?? "") || null,
  };

  if (existing) {
    const { error } = await supabase.from("venda").update(payload).eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("venda").insert({ operacao_id: operacaoId, ...payload });
    if (error) throw error;
  }

  revalidatePath(`/operacoes/${operacaoId}/venda`);
}

export async function addVisita(operacaoId: string, formData: FormData) {
  const { supabase, existing } = await getOrCreate(operacaoId);
  const observacao = String(formData.get("observacao") ?? "").trim();
  if (!observacao) return;

  const visita = { data: new Date().toISOString(), observacao };

  if (existing) {
    const visitas = [...((existing.visitas as unknown[]) ?? []), visita];
    const { error } = await supabase.from("venda").update({ visitas }).eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("venda").insert({ operacao_id: operacaoId, visitas: [visita] });
    if (error) throw error;
  }

  revalidatePath(`/operacoes/${operacaoId}/venda`);
}

export async function addProposta(operacaoId: string, formData: FormData) {
  const { supabase, existing } = await getOrCreate(operacaoId);
  const valor = Number(formData.get("valor") ?? 0) || 0;
  if (!valor) return;

  const proposta = { data: new Date().toISOString(), valor };

  if (existing) {
    const propostas = [...((existing.propostas as unknown[]) ?? []), proposta];
    const { error } = await supabase.from("venda").update({ propostas }).eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("venda")
      .insert({ operacao_id: operacaoId, propostas: [proposta] });
    if (error) throw error;
  }

  revalidatePath(`/operacoes/${operacaoId}/venda`);
}

export async function sugerirVendaAction(operacaoId: string) {
  const supabase = await createClient();
  const { data: operacao, error: opError } = await supabase
    .from("operacoes")
    .select("*")
    .eq("id", operacaoId)
    .single();
  if (opError) throw opError;

  const { data: viabilidade } = await supabase
    .from("analise_viabilidade")
    .select("*")
    .eq("operacao_id", operacaoId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return sugerirVenda(operacao, viabilidade);
}
