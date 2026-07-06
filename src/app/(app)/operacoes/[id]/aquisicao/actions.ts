"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addLance(operacaoId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("lances").insert({
    operacao_id: operacaoId,
    data: String(formData.get("data") ?? "") || new Date().toISOString().slice(0, 10),
    tipo: String(formData.get("tipo") ?? "lance"),
    valor: Number(formData.get("valor") ?? 0) || 0,
    resultado: String(formData.get("resultado") ?? "aguardando"),
    observacao: String(formData.get("observacao") ?? "") || null,
  });
  if (error) throw error;

  revalidatePath(`/operacoes/${operacaoId}/aquisicao`);
}

export async function updateLanceResultado(operacaoId: string, formData: FormData) {
  const supabase = await createClient();
  const lanceId = String(formData.get("id") ?? "");
  const resultado = String(formData.get("resultado") ?? "aguardando");

  const { error } = await supabase.from("lances").update({ resultado }).eq("id", lanceId);
  if (error) throw error;

  revalidatePath(`/operacoes/${operacaoId}/aquisicao`);
}

export async function deleteLance(operacaoId: string, formData: FormData) {
  const supabase = await createClient();
  const lanceId = String(formData.get("id") ?? "");

  const { error } = await supabase.from("lances").delete().eq("id", lanceId);
  if (error) throw error;

  revalidatePath(`/operacoes/${operacaoId}/aquisicao`);
}
