create table public.financeiro_lancamentos (
  id uuid primary key default gen_random_uuid(),
  operacao_id uuid not null references public.operacoes(id) on delete cascade,
  tipo text not null check (tipo in ('entrada', 'saida')),
  categoria text not null check (categoria in (
    'compra', 'custas', 'reforma', 'honorarios', 'impostos', 'juridico', 'venda', 'receita', 'outro'
  )),
  descricao text,
  valor numeric not null,
  data date not null default current_date,
  comprovante_url text,
  created_at timestamptz not null default now()
);

alter table public.financeiro_lancamentos enable row level security;

create policy "select_financeiro" on public.financeiro_lancamentos for select
  using (exists (
    select 1 from public.operacoes o
    where o.id = financeiro_lancamentos.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "insert_financeiro" on public.financeiro_lancamentos for insert
  with check (exists (
    select 1 from public.operacoes o
    where o.id = financeiro_lancamentos.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "update_financeiro" on public.financeiro_lancamentos for update
  using (exists (
    select 1 from public.operacoes o
    where o.id = financeiro_lancamentos.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "delete_financeiro" on public.financeiro_lancamentos for delete
  using (exists (
    select 1 from public.operacoes o
    where o.id = financeiro_lancamentos.operacao_id and o.empresa_id = public.current_empresa_id()
  ) and public.current_role() = 'admin');

create index idx_financeiro_operacao on public.financeiro_lancamentos(operacao_id);
create index idx_financeiro_data on public.financeiro_lancamentos(data);
