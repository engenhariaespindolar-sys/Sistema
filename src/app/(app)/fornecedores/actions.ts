"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createFornecedor(formData: FormData) {
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

  const { error } = await supabase.from("fornecedores").insert({
    empresa_id: profile.empresa_id,
    nome: String(formData.get("nome") ?? ""),
    telefone: String(formData.get("telefone") ?? "") || null,
    especialidade: String(formData.get("especialidade") ?? "") || null,
    observacoes: String(formData.get("observacoes") ?? "") || null,
  });
  if (error) throw error;

  revalidatePath("/fornecedores");
}

export async function deleteFornecedor(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");

  const { error } = await supabase.from("fornecedores").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/fornecedores");
}
