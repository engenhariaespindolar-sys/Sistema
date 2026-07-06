export type OperacaoStatus =
  | "prospeccao"
  | "em_analise"
  | "aguardando_leilao"
  | "arrematado"
  | "documentacao"
  | "desocupacao"
  | "reforma"
  | "venda"
  | "vendido"
  | "encerrado"
  | "descartado";

export type OperacaoTipo = "apartamento" | "casa" | "terreno" | "comercial" | "outro";

export type OperacaoOrigem = "leilao" | "anuncio" | "indicacao" | "corretor" | "outro";

export interface Operacao {
  id: string;
  empresa_id: string;
  codigo: string;
  nome_processo: string | null;
  endereco: string;
  cidade: string | null;
  estado: string | null;
  tipo: OperacaoTipo;
  area: number | null;
  matricula: string | null;
  status: OperacaoStatus;
  origem: string | null;
  valor_anuncio: number | null;
  caracteristicas: string | null;
  responsavel_id: string | null;
  edital_url: string | null;
  processo: string | null;
  created_at: string;
  updated_at: string;
}

export type LanceTipo = "lance" | "proposta";
export type LanceResultado = "aguardando" | "vencedor" | "perdido" | "recusado";

export interface Lance {
  id: string;
  operacao_id: string;
  data: string;
  tipo: LanceTipo;
  valor: number;
  resultado: LanceResultado;
  observacao: string | null;
  created_at: string;
}

export interface Fornecedor {
  id: string;
  empresa_id: string;
  nome: string;
  telefone: string | null;
  especialidade: string | null;
  observacoes: string | null;
  created_at: string;
}

export type ReformaItemTipo = "servico" | "material";
export type ReformaItemStatus = "pendente" | "contratado" | "em_andamento" | "concluido";

export interface ReformaItem {
  id: string;
  reforma_id: string;
  tipo: ReformaItemTipo;
  descricao: string;
  fornecedor_id: string | null;
  quantidade: number | null;
  unidade: string | null;
  valor_previsto: number;
  valor_realizado: number;
  status: ReformaItemStatus;
  created_at: string;
}

export interface AnaliseViabilidade {
  id: string;
  operacao_id: string;
  lance: number;
  comissao_compra: number;
  itbi: number;
  registro: number;
  custas: number;
  impostos_compra: number;
  materiais: number;
  mao_de_obra: number;
  reserva_reforma: number;
  valor_esperado: number;
  comissao_venda: number;
  impostos_venda: number;
  capital_necessario: number;
  lucro_bruto: number;
  prazo_estimado_meses: number | null;
  parecer_ia: string | null;
  cenario_otimista: Record<string, unknown> | null;
  cenario_provavel: Record<string, unknown> | null;
  cenario_conservador: Record<string, unknown> | null;
  created_at: string;
}

export type DocumentoTipo =
  | "edital"
  | "matricula"
  | "foto"
  | "contrato"
  | "procuracao"
  | "laudo"
  | "escritura"
  | "comprovante"
  | "outro";

export interface Documento {
  id: string;
  operacao_id: string;
  tipo: DocumentoTipo;
  nome: string;
  url: string;
  resumo_ia: string | null;
  created_at: string;
}

export interface HistoricoEvento {
  data: string;
  descricao: string;
}

export interface Desocupacao {
  id: string;
  operacao_id: string;
  responsavel_id: string | null;
  situacao: string | null;
  custo_total: number;
  data_inicio: string | null;
  data_previsao: string | null;
  data_conclusao: string | null;
  historico: HistoricoEvento[];
  observacoes: string | null;
  created_at: string;
}

export type ReformaStatus = "planejamento" | "em_andamento" | "concluida" | "pausada";

export interface Reforma {
  id: string;
  operacao_id: string;
  orcamento_total: number;
  data_inicio: string | null;
  data_previsao_fim: string | null;
  data_conclusao: string | null;
  status: ReformaStatus;
  created_at: string;
}

export interface ReformaDiario {
  id: string;
  reforma_id: string;
  data: string;
  descricao: string | null;
  fotos_urls: string[];
  custo_dia: number;
  created_at: string;
}

export type FinanceiroTipo = "entrada" | "saida";
export type FinanceiroCategoria =
  | "compra"
  | "custas"
  | "reforma"
  | "honorarios"
  | "impostos"
  | "juridico"
  | "venda"
  | "receita"
  | "outro";

export interface FinanceiroLancamento {
  id: string;
  operacao_id: string;
  tipo: FinanceiroTipo;
  categoria: FinanceiroCategoria;
  descricao: string | null;
  valor: number;
  data: string;
  comprovante_url: string | null;
  created_at: string;
}

export type VendaStatus = "anunciado" | "em_negociacao" | "contrato" | "escritura" | "concluido";

export interface Venda {
  id: string;
  operacao_id: string;
  valor_anunciado: number | null;
  corretores: unknown[];
  portais: unknown[];
  visitas: unknown[];
  propostas: unknown[];
  valor_negociado: number | null;
  data_contrato: string | null;
  data_escritura: string | null;
  status: VendaStatus;
  financiamento_mcmv: boolean;
  status_financiamento: string | null;
  created_at: string;
}

export interface Notificacao {
  id: string;
  user_id: string;
  tipo: string | null;
  titulo: string;
  mensagem: string | null;
  lida: boolean;
  operacao_id: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  empresa_id: string;
  nome: string | null;
  role: "admin" | "operador";
  created_at: string;
}
