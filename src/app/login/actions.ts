"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const mensagem =
      error.code === "email_not_confirmed"
        ? "Confirme seu e-mail antes de entrar (verifique a caixa de entrada, incluindo spam)."
        : error.code === "invalid_credentials"
          ? "E-mail ou senha inválidos."
          : error.message;
    redirect(`/login?error=${encodeURIComponent(mensagem)}`);
  }

  redirect("/dashboard");
}
