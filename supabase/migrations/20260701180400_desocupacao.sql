create table public.desocupacao (
  id uuid primary key default gen_random_uuid(),
  operacao_id uuid not null references public.operacoes(id) on delete cascade,
  responsavel_id uuid references auth.users(id),
  situacao text,
  custo_total numeric default 0,
  data_inicio date,
  data_previsao date,
  data_conclusao date,
  historico jsonb not null default '[]'::jsonb,
  observacoes text,
  created_at timestamptz not null default now()
);

alter table public.desocupacao enable row level security;

create policy "select_desocupacao" on public.desocupacao for select
  using (exists (
    select 1 from public.operacoes o
    where o.id = desocupacao.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "insert_desocupacao" on public.desocupacao for insert
  with check (exists (
    select 1 from public.operacoes o
    where o.id = desocupacao.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "update_desocupacao" on public.desocupacao for update
  using (exists (
    select 1 from public.operacoes o
    where o.id = desocupacao.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "delete_desocupacao" on public.desocupacao for delete
  using (exists (
    select 1 from public.operacoes o
    where o.id = desocupacao.operacao_id and o.empresa_id = public.current_empresa_id()
  ) and public.current_role() = 'admin');

create index idx_desocupacao_operacao on public.desocupacao(operacao_id);
