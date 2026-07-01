import { createClient } from "@/lib/supabase/server";
import type { Operacao, AnaliseViabilidade, FinanceiroLancamento, Notificacao } from "@/types/database";

export interface DashboardData {
  operacoes: Operacao[];
  viabilidades: AnaliseViabilidade[];
  lancamentos: FinanceiroLancamento[];
  notificacoes: Notificacao[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [operacoesRes, viabilidadesRes, lancamentosRes, notificacoesRes] = await Promise.all([
    supabase.from("operacoes").select("*").order("updated_at", { ascending: false }),
    supabase.from("analise_viabilidade").select("*"),
    supabase.from("financeiro_lancamentos").select("*"),
    supabase
      .from("notificacoes")
      .select("*")
      .eq("user_id", user?.id ?? "")
      .eq("lida", false)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (operacoesRes.error) throw operacoesRes.error;
  if (viabilidadesRes.error) throw viabilidadesRes.error;
  if (lancamentosRes.error) throw lancamentosRes.error;
  if (notificacoesRes.error) throw notificacoesRes.error;

  return {
    operacoes: operacoesRes.data ?? [],
    viabilidades: viabilidadesRes.data ?? [],
    lancamentos: lancamentosRes.data ?? [],
    notificacoes: notificacoesRes.data ?? [],
  };
}
