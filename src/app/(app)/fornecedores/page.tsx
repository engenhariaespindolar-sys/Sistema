import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { listFornecedores } from "@/lib/data/reforma";
import { createFornecedor, deleteFornecedor } from "./actions";

export default async function FornecedoresPage() {
  const fornecedores = await listFornecedores();

  return (
    <div>
      <PageHeader title="Fornecedores" />
      <p className="mb-4 text-sm text-foreground-secondary">
        Prestadores de serviço e fornecedores de material usados nas reformas.
      </p>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Novo fornecedor</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createFornecedor} className="flex flex-wrap items-end gap-3">
            <div className="min-w-44 flex-1">
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">Nome</label>
              <input
                name="nome"
                required
                className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                Telefone
              </label>
              <input
                name="telefone"
                className="w-40 rounded-lg border border-border-subtle px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                Especialidade
              </label>
              <input
                name="especialidade"
                placeholder="Ex: pintura, elétrica..."
                className="w-44 rounded-lg border border-border-subtle px-3 py-2 text-sm"
              />
            </div>
            <div className="min-w-44 flex-1">
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">
                Observações
              </label>
              <input
                name="observacoes"
                className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover"
            >
              Cadastrar
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5">
          {fornecedores.length === 0 ? (
            <p className="text-sm text-foreground-secondary">Nenhum fornecedor cadastrado.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-left text-xs text-foreground-secondary">
                  <th className="py-2">Nome</th>
                  <th className="py-2">Telefone</th>
                  <th className="py-2">Especialidade</th>
                  <th className="py-2">Observações</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {fornecedores.map((f) => (
                  <tr key={f.id} className="border-b border-border-subtle last:border-0">
                    <td className="py-2 font-medium">{f.nome}</td>
                    <td className="py-2">{f.telefone ?? "-"}</td>
                    <td className="py-2">{f.especialidade ?? "-"}</td>
                    <td className="py-2 text-foreground-secondary">{f.observacoes ?? "-"}</td>
                    <td className="py-2 text-right">
                      <form action={deleteFornecedor}>
                        <input type="hidden" name="id" value={f.id} />
                        <button type="submit" className="text-foreground-secondary hover:text-danger">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
