import { AvancarEtapa } from "./AvancarEtapa";
import type { Operacao } from "@/types/database";

// Botões de avanço da esteira, exibidos no cabeçalho do detalhe da operação
// conforme a etapa atual do imóvel.
export function EtapaAcoes({ operacao }: { operacao: Operacao }) {
  switch (operacao.status) {
    case "prospeccao":
      return (
        <div className="flex gap-2">
          <AvancarEtapa
            operacaoId={operacao.id}
            novoStatus="descartado"
            label="Descartar"
            variante="perigo"
          />
          <AvancarEtapa
            operacaoId={operacao.id}
            novoStatus="em_analise"
            label="Enviar para análise"
            redirecionarPara={`/operacoes/${operacao.id}/viabilidade`}
          />
        </div>
      );
    case "aguardando_leilao":
    case "arrematado":
    case "documentacao":
    case "desocupacao":
      return (
        <AvancarEtapa
          operacaoId={operacao.id}
          novoStatus="reforma"
          label="Iniciar reforma"
          redirecionarPara={`/operacoes/${operacao.id}/reforma`}
        />
      );
    case "reforma":
      return (
        <AvancarEtapa
          operacaoId={operacao.id}
          novoStatus="venda"
          label="Colocar à venda"
          redirecionarPara={`/operacoes/${operacao.id}/venda`}
        />
      );
    case "venda":
      return (
        <AvancarEtapa
          operacaoId={operacao.id}
          novoStatus="vendido"
          label="Concluir venda"
          redirecionarPara={`/operacoes/${operacao.id}/resultado`}
        />
      );
    default:
      return null;
  }
}
