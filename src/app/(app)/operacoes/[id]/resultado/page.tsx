import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency, formatPercent } from "@/lib/format";
import { getOperacao } from "@/lib/data/operacoes";
import { getViabilidade } from "@/lib/data/viabilidade";
import { listLancamentos } from "@/lib/data/financeiro";
import { getVenda } from "@/lib/data/venda";
import { OPERACAO_STATUS_CONCLUIDO } from "@/lib/status";

function Linha({
  label,
  previsto,
  realizado,
}: {
  label: string;
  previsto: string;
  realizado: string;
}) {
  return (
    <tr className="border-b border-border-subtle last:border-0">
      <td className="py-2 text-sm text-foreground-secondary">{label}</td>
      <td className="py-2 text-right text-sm">{previsto}</td>
      <td className="py-2 text-right text-sm font-medium">{realizado}</td>
    </tr>
  );
}

export default async function ResultadoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [operacao, viabilidade, lancamentos, venda] = await Promise.all([
    getOperacao(id),
    getViabilidade(id),
    listLancamentos(id),
    getVenda(id),
  ]);

  if (!operacao) return null;

  const investimentoRealizado = lancamentos
    .filter((l) => l.tipo === "saida")
    .reduce((s, l) => s + Number(l.valor), 0);
  const receitaRealizada = lancamentos
    .filter((l) => l.tipo === "entrada")
    .reduce((s, l) => s + Number(l.valor), 0);
  const lucroRealizado = receitaRealizada - investimentoRealizado;

  const investimentoPrevisto = viabilidade?.capital_necessario ?? 0;
  const receitaPrevista = viabilidade?.valor_esperado ?? 0;
  const lucroPrevisto = viabilidade?.lucro_bruto ?? 0;

  const margemPrevista = receitaPrevista > 0 ? (lucroPrevisto / receitaPrevista) * 100 : null;
  const margemRealizada = receitaRealizada > 0 ? (lucroRealizado / receitaRealizada) * 100 : null;

  const roiPrevisto = investimentoPrevisto > 0 ? (lucroPrevisto / investimentoPrevisto) * 100 : null;
  const roiRealizado =
    investimentoRealizado > 0 ? (lucroRealizado / investimentoRealizado) * 100 : null;

  const concluida = OPERACAO_STATUS_CONCLUIDO.has(operacao.status) && operacao.status !== "descartado";
  const dataFim = venda?.data_escritura ?? venda?.data_contrato ?? null;
  const inicio = new Date(operacao.created_at).getTime();
  // eslint-disable-next-line react-hooks/purity -- Server Component: valor calculado uma vez por requisição, não re-renderizado no cliente.
  const fim = concluida && dataFim ? new Date(dataFim).getTime() : Date.now();
  const prazoRealizadoDias = Math.max(0, Math.round((fim - inicio) / 86_400_000));
  const prazoPrevistoDias = viabilidade?.prazo_estimado_meses
    ? viabilidade.prazo_estimado_meses * 30
    : null;

  if (operacao.status === "descartado") {
    return (
      <Card>
        <CardContent className="pt-5">
          <p className="text-sm text-foreground-secondary">
            Esta operação foi descartada — não há resultado financeiro a apurar.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Previsto x Realizado</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle text-left text-xs text-foreground-secondary">
                <th className="py-2">Indicador</th>
                <th className="py-2 text-right">Previsto</th>
                <th className="py-2 text-right">Realizado</th>
              </tr>
            </thead>
            <tbody>
              <Linha
                label="Investimento total"
                previsto={formatCurrency(investimentoPrevisto)}
                realizado={formatCurrency(investimentoRealizado)}
              />
              <Linha
                label="Receita de venda"
                previsto={formatCurrency(receitaPrevista)}
                realizado={formatCurrency(receitaRealizada)}
              />
              <Linha
                label="Lucro líquido"
                previsto={formatCurrency(lucroPrevisto)}
                realizado={formatCurrency(lucroRealizado)}
              />
              <Linha
                label="Margem"
                previsto={margemPrevista !== null ? formatPercent(margemPrevista) : "-"}
                realizado={margemRealizada !== null ? formatPercent(margemRealizada) : "-"}
              />
              <Linha
                label="Retorno sobre capital (ROI)"
                previsto={roiPrevisto !== null ? formatPercent(roiPrevisto) : "-"}
                realizado={roiRealizado !== null ? formatPercent(roiRealizado) : "-"}
              />
              <Linha
                label="Prazo total"
                previsto={prazoPrevistoDias !== null ? `${prazoPrevistoDias} dias` : "-"}
                realizado={`${prazoRealizadoDias} dias${concluida ? "" : " (em andamento)"}`}
              />
            </tbody>
          </table>
        </CardContent>
      </Card>

      {!viabilidade && (
        <p className="text-sm text-foreground-secondary">
          Preencha a análise de viabilidade para ver a coluna &quot;Previsto&quot;.
        </p>
      )}
      {lancamentos.length === 0 && (
        <p className="text-sm text-foreground-secondary">
          Lance as movimentações no Financeiro para ver a coluna &quot;Realizado&quot;.
        </p>
      )}
    </div>
  );
}
