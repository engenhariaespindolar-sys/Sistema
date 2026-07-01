import { createClient } from "@/lib/supabase/server";
import type { Venda } from "@/types/database";

export async function getVenda(operacaoId: string): Promise<Venda | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("venda")
    .select("*")
    .eq("operacao_id", operacaoId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}
