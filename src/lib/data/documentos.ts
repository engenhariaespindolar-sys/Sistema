import { createClient } from "@/lib/supabase/server";
import type { Documento } from "@/types/database";

export async function listDocumentos(operacaoId: string): Promise<Documento[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documentos")
    .select("*")
    .eq("operacao_id", operacaoId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getSignedUrl(path: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("documentos").createSignedUrl(path, 60 * 10);
  if (error) return null;
  return data.signedUrl;
}
