"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { resumirDocumento } from "@/lib/anthropic";

export async function uploadDocumento(operacaoId: string, formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("arquivo") as File | null;
  const tipo = String(formData.get("tipo") ?? "outro");
  const nome = String(formData.get("nome") ?? "") || file?.name || "documento";

  if (!file || file.size === 0) throw new Error("Selecione um arquivo.");

  const path = `${operacaoId}/${crypto.randomUUID()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from("documentos").upload(path, file);
  if (uploadError) throw uploadError;

  const { error } = await supabase.from("documentos").insert({
    operacao_id: operacaoId,
    tipo,
    nome,
    url: path,
  });
  if (error) throw error;

  revalidatePath(`/operacoes/${operacaoId}/documentos`);
}

export async function deleteDocumento(operacaoId: string, documentoId: string, path: string) {
  const supabase = await createClient();
  await supabase.storage.from("documentos").remove([path]);
  const { error } = await supabase.from("documentos").delete().eq("id", documentoId);
  if (error) throw error;
  revalidatePath(`/operacoes/${operacaoId}/documentos`);
}

export async function resumirDocumentoAction(documentoId: string) {
  const supabase = await createClient();
  const { data: doc, error } = await supabase
    .from("documentos")
    .select("*")
    .eq("id", documentoId)
    .single();
  if (error) throw error;

  const { data: fileData, error: downloadError } = await supabase.storage
    .from("documentos")
    .download(doc.url);
  if (downloadError) throw downloadError;

  const buffer = Buffer.from(await fileData.arrayBuffer());
  const base64 = buffer.toString("base64");

  const resumo = await resumirDocumento(base64, doc.tipo);

  const { error: updateError } = await supabase
    .from("documentos")
    .update({ resumo_ia: resumo })
    .eq("id", documentoId);
  if (updateError) throw updateError;

  revalidatePath(`/operacoes/${doc.operacao_id}/documentos`);
  return resumo;
}
