create table public.venda (
  id uuid primary key default gen_random_uuid(),
  operacao_id uuid not null references public.operacoes(id) on delete cascade,
  valor_anunciado numeric,
  corretores jsonb not null default '[]'::jsonb,
  portais jsonb not null default '[]'::jsonb,
  visitas jsonb not null default '[]'::jsonb,
  propostas jsonb not null default '[]'::jsonb,
  valor_negociado numeric,
  data_contrato date,
  data_escritura date,
  status text not null default 'anunciado' check (status in (
    'anunciado', 'em_negociacao', 'contrato', 'escritura', 'concluido'
  )),
  created_at timestamptz not null default now()
);

alter table public.venda enable row level security;

create policy "select_venda" on public.venda for select
  using (exists (
    select 1 from public.operacoes o
    where o.id = venda.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "insert_venda" on public.venda for insert
  with check (exists (
    select 1 from public.operacoes o
    where o.id = venda.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "update_venda" on public.venda for update
  using (exists (
    select 1 from public.operacoes o
    where o.id = venda.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "delete_venda" on public.venda for delete
  using (exists (
    select 1 from public.operacoes o
    where o.id = venda.operacao_id and o.empresa_id = public.current_empresa_id()
  ) and public.current_role() = 'admin');

create index idx_venda_operacao on public.venda(operacao_id);
