import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { createClient } from "@/lib/supabase/server";
import { updateNome, updatePassword } from "./actions";

export default async function PerfilPage({
  searchParams,
}: {
  searchParams: Promise<{ sucesso?: string; erro?: string }>;
}) {
  const { sucesso, erro } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome, role, empresas(nome)")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  const empresaNome = (profile?.empresas as unknown as { nome: string } | null)?.nome;

  return (
    <div className="max-w-xl">
      <PageHeader title="Perfil" />

      {sucesso && (
        <div className="mb-4 rounded-lg bg-success-light px-3 py-2 text-sm text-success">
          {sucesso}
        </div>
      )}
      {erro && (
        <div className="mb-4 rounded-lg bg-danger-light px-3 py-2 text-sm text-danger">{erro}</div>
      )}

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Dados da conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground-secondary">E-mail</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground-secondary">Empresa</span>
              <span>{empresaNome ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground-secondary">Perfil de acesso</span>
              <StatusBadge
                label={profile?.role === "admin" ? "Administrador" : "Operador"}
                tone={profile?.role === "admin" ? "brand" : "info"}
              />
            </div>

            <form action={updateNome} className="border-t border-border-subtle pt-4">
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">Nome</label>
              <div className="flex gap-2">
                <input
                  name="nome"
                  defaultValue={profile?.nome ?? ""}
                  className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover"
                >
                  Salvar
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alterar senha</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updatePassword} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                  Nova senha
                </label>
                <input
                  name="password"
                  type="password"
                  minLength={6}
                  required
                  className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                  Confirmar nova senha
                </label>
                <input
                  name="password_confirm"
                  type="password"
                  minLength={6}
                  required
                  className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-primary-hover"
              >
                Alterar senha
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
