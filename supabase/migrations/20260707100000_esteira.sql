-- Etapa de prospecção: novo status inicial + dados do anúncio
alter table public.operacoes drop constraint operacoes_status_check;
alter table public.operacoes add constraint operacoes_status_check check (status in (
  'prospeccao', 'em_analise', 'aguardando_leilao', 'arrematado', 'documentacao',
  'desocupacao', 'reforma', 'venda', 'vendido', 'encerrado', 'descartado'
));
alter table public.operacoes alter column status set default 'prospeccao';
alter table public.operacoes add column valor_anuncio numeric;
alter table public.operacoes add column caracteristicas text;

-- Lances e propostas (etapa de aquisição)
create table public.lances (
  id uuid primary key default gen_random_uuid(),
  operacao_id uuid not null references public.operacoes(id) on delete cascade,
  data date not null default current_date,
  tipo text not null default 'lance' check (tipo in ('lance', 'proposta')),
  valor numeric not null,
  resultado text not null default 'aguardando' check (resultado in (
    'aguardando', 'vencedor', 'perdido', 'recusado'
  )),
  observacao text,
  created_at timestamptz not null default now()
);

alter table public.lances enable row level security;

create policy "select_lances" on public.lances for select
  using (exists (
    select 1 from public.operacoes o
    where o.id = lances.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "insert_lances" on public.lances for insert
  with check (exists (
    select 1 from public.operacoes o
    where o.id = lances.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "update_lances" on public.lances for update
  using (exists (
    select 1 from public.operacoes o
    where o.id = lances.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "delete_lances" on public.lances for delete
  using (exists (
    select 1 from public.operacoes o
    where o.id = lances.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create index idx_lances_operacao on public.lances(operacao_id);

-- Fornecedores (usados nos itens de reforma)
create table public.fornecedores (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id),
  nome text not null,
  telefone text,
  especialidade text,
  observacoes text,
  created_at timestamptz not null default now()
);

alter table public.fornecedores enable row level security;

create policy "select_fornecedores" on public.fornecedores for select
  using (empresa_id = public.current_empresa_id());

create policy "insert_fornecedores" on public.fornecedores for insert
  with check (empresa_id = public.current_empresa_id());

create policy "update_fornecedores" on public.fornecedores for update
  using (empresa_id = public.current_empresa_id());

create policy "delete_fornecedores" on public.fornecedores for delete
  using (empresa_id = public.current_empresa_id());

create index idx_fornecedores_empresa on public.fornecedores(empresa_id);

-- Serviços e materiais da reforma (previsto x realizado)
create table public.reforma_itens (
  id uuid primary key default gen_random_uuid(),
  reforma_id uuid not null references public.reforma(id) on delete cascade,
  tipo text not null default 'servico' check (tipo in ('servico', 'material')),
  descricao text not null,
  fornecedor_id uuid references public.fornecedores(id) on delete set null,
  quantidade numeric,
  unidade text,
  valor_previsto numeric default 0,
  valor_realizado numeric default 0,
  status text not null default 'pendente' check (status in (
    'pendente', 'contratado', 'em_andamento', 'concluido'
  )),
  created_at timestamptz not null default now()
);

alter table public.reforma_itens enable row level security;

create policy "select_reforma_itens" on public.reforma_itens for select
  using (exists (
    select 1 from public.reforma r
    join public.operacoes o on o.id = r.operacao_id
    where r.id = reforma_itens.reforma_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "insert_reforma_itens" on public.reforma_itens for insert
  with check (exists (
    select 1 from public.reforma r
    join public.operacoes o on o.id = r.operacao_id
    where r.id = reforma_itens.reforma_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "update_reforma_itens" on public.reforma_itens for update
  using (exists (
    select 1 from public.reforma r
    join public.operacoes o on o.id = r.operacao_id
    where r.id = reforma_itens.reforma_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "delete_reforma_itens" on public.reforma_itens for delete
  using (exists (
    select 1 from public.reforma r
    join public.operacoes o on o.id = r.operacao_id
    where r.id = reforma_itens.reforma_id and o.empresa_id = public.current_empresa_id()
  ));

create index idx_reforma_itens_reforma on public.reforma_itens(reforma_id);
