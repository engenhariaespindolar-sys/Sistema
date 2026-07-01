create table public.reforma (
  id uuid primary key default gen_random_uuid(),
  operacao_id uuid not null references public.operacoes(id) on delete cascade,
  orcamento_total numeric default 0,
  data_inicio date,
  data_previsao_fim date,
  data_conclusao date,
  status text not null default 'planejamento' check (status in (
    'planejamento', 'em_andamento', 'concluida', 'pausada'
  )),
  created_at timestamptz not null default now()
);

create table public.reforma_diario (
  id uuid primary key default gen_random_uuid(),
  reforma_id uuid not null references public.reforma(id) on delete cascade,
  data date not null default current_date,
  descricao text,
  fotos_urls jsonb not null default '[]'::jsonb,
  custo_dia numeric default 0,
  created_at timestamptz not null default now()
);

alter table public.reforma enable row level security;
alter table public.reforma_diario enable row level security;

create policy "select_reforma" on public.reforma for select
  using (exists (
    select 1 from public.operacoes o
    where o.id = reforma.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "insert_reforma" on public.reforma for insert
  with check (exists (
    select 1 from public.operacoes o
    where o.id = reforma.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "update_reforma" on public.reforma for update
  using (exists (
    select 1 from public.operacoes o
    where o.id = reforma.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "delete_reforma" on public.reforma for delete
  using (exists (
    select 1 from public.operacoes o
    where o.id = reforma.operacao_id and o.empresa_id = public.current_empresa_id()
  ) and public.current_role() = 'admin');

create policy "select_reforma_diario" on public.reforma_diario for select
  using (exists (
    select 1 from public.reforma r
    join public.operacoes o on o.id = r.operacao_id
    where r.id = reforma_diario.reforma_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "insert_reforma_diario" on public.reforma_diario for insert
  with check (exists (
    select 1 from public.reforma r
    join public.operacoes o on o.id = r.operacao_id
    where r.id = reforma_diario.reforma_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "update_reforma_diario" on public.reforma_diario for update
  using (exists (
    select 1 from public.reforma r
    join public.operacoes o on o.id = r.operacao_id
    where r.id = reforma_diario.reforma_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "delete_reforma_diario" on public.reforma_diario for delete
  using (exists (
    select 1 from public.reforma r
    join public.operacoes o on o.id = r.operacao_id
    where r.id = reforma_diario.reforma_id and o.empresa_id = public.current_empresa_id()
  ) and public.current_role() = 'admin');

create index idx_reforma_operacao on public.reforma(operacao_id);
create index idx_reforma_diario_reforma on public.reforma_diario(reforma_id);
