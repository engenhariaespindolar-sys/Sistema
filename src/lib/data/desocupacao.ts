import { createClient } from "@/lib/supabase/server";
import type { Desocupacao } from "@/types/database";

export async function getDesocupacao(operacaoId: string): Promise<Desocupacao | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("desocupacao")
    .select("*")
    .eq("operacao_id", operacaoId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}
