import { createClient } from "@/lib/supabase/server";
import type { Lance } from "@/types/database";

export async function listLances(operacaoId: string): Promise<Lance[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lances")
    .select("*")
    .eq("operacao_id", operacaoId)
    .order("data", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
