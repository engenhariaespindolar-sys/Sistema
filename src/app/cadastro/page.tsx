import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { signup } from "./actions";

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo className="h-10" />
        </div>

        <div className="card-elevation rounded-xl border border-border-subtle bg-surface p-6">
          <h1 className="mb-1 text-lg font-medium text-foreground">Criar conta</h1>
          <p className="mb-6 text-sm text-foreground-secondary">
            Cadastre-se para acessar o painel
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-danger-light px-3 py-2 text-sm text-danger">
              {error}
            </div>
          )}

          <form action={signup} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                Nome
              </label>
              <input
                type="text"
                name="nome"
                required
                className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                placeholder="voce@email.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                Senha
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm outline-none focus:border-brand-primary"
                placeholder="mínimo 6 caracteres"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-brand-primary py-2.5 text-sm font-medium text-white hover:bg-brand-primary-hover"
            >
              Criar conta
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-foreground-secondary">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-medium text-brand-primary">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
