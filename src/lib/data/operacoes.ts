import { createClient } from "@/lib/supabase/server";
import type { Operacao, Profile } from "@/types/database";

export async function listOperacoes(): Promise<Operacao[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("operacoes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function listOperacoesPorStatus(statuses: readonly string[]): Promise<Operacao[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("operacoes")
    .select("*")
    .in("status", [...statuses])
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getOperacao(id: string): Promise<Operacao | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("operacoes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listEquipe(): Promise<Pick<Profile, "id" | "nome">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("id, nome");
  if (error) throw error;
  return data ?? [];
}
