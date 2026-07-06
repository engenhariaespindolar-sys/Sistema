"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OPERACAO_STATUS_ORDER } from "@/lib/status";

export async function createOperacao(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("empresa_id")
    .eq("id", user.id)
    .single();

  if (!profile) throw new Error("Perfil não encontrado.");

  const responsavel_id = String(formData.get("responsavel_id") ?? "") || null;
  const area = String(formData.get("area") ?? "");

  const { data, error } = await supabase
    .from("operacoes")
    .insert({
      empresa_id: profile.empresa_id,
      endereco: String(formData.get("endereco") ?? ""),
      cidade: String(formData.get("cidade") ?? "") || null,
      estado: String(formData.get("estado") ?? "") || null,
      tipo: String(formData.get("tipo") ?? "outro"),
      area: area ? Number(area) : null,
      matricula: String(formData.get("matricula") ?? "") || null,
      processo: String(formData.get("processo") ?? "") || null,
      edital_url: String(formData.get("edital_url") ?? "") || null,
      origem: String(formData.get("origem") ?? "") || null,
      valor_anuncio: Number(formData.get("valor_anuncio") ?? 0) || null,
      caracteristicas: String(formData.get("caracteristicas") ?? "") || null,
      responsavel_id,
    })
    .select("id")
    .single();

  if (error) throw error;

  revalidatePath("/operacoes");
  redirect(`/operacoes/${data.id}`);
}

export async function updateOperacao(id: string, formData: FormData) {
  const supabase = await createClient();

  const responsavel_id = String(formData.get("responsavel_id") ?? "") || null;
  const area = String(formData.get("area") ?? "");

  const { error } = await supabase
    .from("operacoes")
    .update({
      endereco: String(formData.get("endereco") ?? ""),
      cidade: String(formData.get("cidade") ?? "") || null,
      estado: String(formData.get("estado") ?? "") || null,
      tipo: String(formData.get("tipo") ?? "outro"),
      area: area ? Number(area) : null,
      matricula: String(formData.get("matricula") ?? "") || null,
      processo: String(formData.get("processo") ?? "") || null,
      edital_url: String(formData.get("edital_url") ?? "") || null,
      origem: String(formData.get("origem") ?? "") || null,
      valor_anuncio: Number(formData.get("valor_anuncio") ?? 0) || null,
      caracteristicas: String(formData.get("caracteristicas") ?? "") || null,
      responsavel_id,
    })
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/operacoes");
  revalidatePath(`/operacoes/${id}`);
}

export async function updateOperacaoStatus(id: string, status: string) {
  if (!OPERACAO_STATUS_ORDER.includes(status as (typeof OPERACAO_STATUS_ORDER)[number])) {
    throw new Error("Status inválido.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("operacoes").update({ status }).eq("id", id);
  if (error) throw error;

  revalidatePath("/operacoes");
  revalidatePath(`/operacoes/${id}`);
}

export async function deleteOperacao(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("operacoes").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/operacoes");
  redirect("/operacoes");
}
