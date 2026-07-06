-- Origem do imóvel (prospecção)
alter table public.operacoes add column origem text;

-- Decisão de descartar a oportunidade
alter table public.operacoes drop constraint operacoes_status_check;
alter table public.operacoes add constraint operacoes_status_check check (status in (
  'em_analise', 'aguardando_leilao', 'arrematado', 'documentacao',
  'desocupacao', 'reforma', 'venda', 'vendido', 'encerrado', 'descartado'
));

-- Financiamento pelo Minha Casa Minha Vida
alter table public.venda add column financiamento_mcmv boolean not null default false;
alter table public.venda add column status_financiamento text;
