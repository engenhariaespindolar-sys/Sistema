import { createClient } from "@/lib/supabase/server";
import type { FinanceiroLancamento } from "@/types/database";

export async function listLancamentos(operacaoId: string): Promise<FinanceiroLancamento[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("financeiro_lancamentos")
    .select("*")
    .eq("operacao_id", operacaoId)
    .order("data", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
