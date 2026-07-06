import { createClient } from "@/lib/supabase/server";
import type { Fornecedor, Reforma, ReformaDiario, ReformaItem } from "@/types/database";

export async function getReforma(operacaoId: string): Promise<Reforma | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reforma")
    .select("*")
    .eq("operacao_id", operacaoId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listDiario(reformaId: string): Promise<ReformaDiario[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reforma_diario")
    .select("*")
    .eq("reforma_id", reformaId)
    .order("data", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listItens(reformaId: string): Promise<ReformaItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reforma_itens")
    .select("*")
    .eq("reforma_id", reformaId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function listFornecedores(): Promise<Fornecedor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fornecedores")
    .select("*")
    .order("nome", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
