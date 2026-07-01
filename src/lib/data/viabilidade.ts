import { createClient } from "@/lib/supabase/server";
import type { AnaliseViabilidade } from "@/types/database";

export async function getViabilidade(operacaoId: string): Promise<AnaliseViabilidade | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("analise_viabilidade")
    .select("*")
    .eq("operacao_id", operacaoId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}
