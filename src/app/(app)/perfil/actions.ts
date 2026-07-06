"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateNome(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const nome = String(formData.get("nome") ?? "");
  const { error } = await supabase.from("profiles").update({ nome }).eq("id", user.id);
  if (error) throw error;

  redirect(`/perfil?sucesso=${encodeURIComponent("Nome atualizado.")}`);
}

export async function updatePassword(formData: FormData) {
  const senha = String(formData.get("password") ?? "");
  const confirmacao = String(formData.get("password_confirm") ?? "");

  if (senha.length < 6) {
    redirect(`/perfil?erro=${encodeURIComponent("A senha precisa ter no mínimo 6 caracteres.")}`);
  }
  if (senha !== confirmacao) {
    redirect(`/perfil?erro=${encodeURIComponent("As senhas não coincidem.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: senha });

  if (error) {
    redirect(`/perfil?erro=${encodeURIComponent(error.message)}`);
  }

  redirect(`/perfil?sucesso=${encodeURIComponent("Senha alterada com sucesso.")}`);
}
