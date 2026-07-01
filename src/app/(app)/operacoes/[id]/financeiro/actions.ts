"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addLancamento(operacaoId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("financeiro_lancamentos").insert({
    operacao_id: operacaoId,
    tipo: String(formData.get("tipo") ?? "saida"),
    categoria: String(formData.get("categoria") ?? "outro"),
    descricao: String(formData.get("descricao") ?? "") || null,
    valor: Number(formData.get("valor") ?? 0) || 0,
    data: String(formData.get("data") ?? "") || new Date().toISOString().slice(0, 10),
  });
  if (error) throw error;

  revalidatePath(`/operacoes/${operacaoId}/financeiro`);
}

export async function deleteLancamento(operacaoId: string, formData: FormData) {
  const supabase = await createClient();
  const lancamentoId = String(formData.get("id") ?? "");
  const { error } = await supabase.from("financeiro_lancamentos").delete().eq("id", lancamentoId);
  if (error) throw error;

  revalidatePath(`/operacoes/${operacaoId}/financeiro`);
}
