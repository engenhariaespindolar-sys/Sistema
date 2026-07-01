create table public.analise_viabilidade (
  id uuid primary key default gen_random_uuid(),
  operacao_id uuid not null references public.operacoes(id) on delete cascade,
  -- Compra
  lance numeric default 0,
  comissao_compra numeric default 0,
  itbi numeric default 0,
  registro numeric default 0,
  custas numeric default 0,
  impostos_compra numeric default 0,
  -- Reforma
  materiais numeric default 0,
  mao_de_obra numeric default 0,
  reserva_reforma numeric default 0,
  -- Venda
  valor_esperado numeric default 0,
  comissao_venda numeric default 0,
  impostos_venda numeric default 0,
  -- Calculados
  capital_necessario numeric generated always as (
    coalesce(lance, 0) + coalesce(comissao_compra, 0) + coalesce(itbi, 0) + coalesce(registro, 0)
    + coalesce(custas, 0) + coalesce(impostos_compra, 0) + coalesce(materiais, 0)
    + coalesce(mao_de_obra, 0) + coalesce(reserva_reforma, 0)
  ) stored,
  lucro_bruto numeric generated always as (
    coalesce(valor_esperado, 0) - (
      coalesce(lance, 0) + coalesce(comissao_compra, 0) + coalesce(itbi, 0) + coalesce(registro, 0)
      + coalesce(custas, 0) + coalesce(impostos_compra, 0) + coalesce(materiais, 0)
      + coalesce(mao_de_obra, 0) + coalesce(reserva_reforma, 0)
    )
  ) stored,
  prazo_estimado_meses int,
  parecer_ia text,
  cenario_otimista jsonb,
  cenario_provavel jsonb,
  cenario_conservador jsonb,
  created_at timestamptz not null default now()
);

alter table public.analise_viabilidade enable row level security;

create policy "select_analise_viabilidade" on public.analise_viabilidade for select
  using (exists (
    select 1 from public.operacoes o
    where o.id = analise_viabilidade.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "insert_analise_viabilidade" on public.analise_viabilidade for insert
  with check (exists (
    select 1 from public.operacoes o
    where o.id = analise_viabilidade.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "update_analise_viabilidade" on public.analise_viabilidade for update
  using (exists (
    select 1 from public.operacoes o
    where o.id = analise_viabilidade.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "delete_analise_viabilidade" on public.analise_viabilidade for delete
  using (exists (
    select 1 from public.operacoes o
    where o.id = analise_viabilidade.operacao_id and o.empresa_id = public.current_empresa_id()
  ) and public.current_role() = 'admin');

create index idx_analise_viabilidade_operacao on public.analise_viabilidade(operacao_id);
