export type OperacaoStatus =
  | "em_analise"
  | "aguardando_leilao"
  | "arrematado"
  | "documentacao"
  | "desocupacao"
  | "reforma"
  | "venda"
  | "vendido"
  | "encerrado";

export type OperacaoTipo = "apartamento" | "casa" | "terreno" | "comercial" | "outro";

export interface Operacao {
  id: string;
  empresa_id: string;
  codigo: string;
  endereco: string;
  cidade: string | null;
  estado: string | null;
  tipo: OperacaoTipo;
  area: number | null;
  matricula: string | null;
  status: OperacaoStatus;
  responsavel_id: string | null;
  edital_url: string | null;
  processo: string | null;
  created_at: string;
  updated_at: string;
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
