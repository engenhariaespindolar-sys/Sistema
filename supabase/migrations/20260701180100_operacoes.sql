create sequence public.operacoes_codigo_seq;

create table public.operacoes (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id),
  codigo text unique,
  endereco text not null,
  cidade text,
  estado text,
  tipo text not null check (tipo in ('apartamento', 'casa', 'terreno', 'comercial', 'outro')),
  area numeric,
  matricula text,
  status text not null default 'em_analise' check (status in (
    'em_analise', 'aguardando_leilao', 'arrematado', 'documentacao',
    'desocupacao', 'reforma', 'venda', 'vendido', 'encerrado'
  )),
  responsavel_id uuid references auth.users(id),
  edital_url text,
  processo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_operacao_codigo()
returns trigger
language plpgsql
as $$
begin
  if new.codigo is null then
    new.codigo := 'OP-' || lpad(nextval('public.operacoes_codigo_seq')::text, 5, '0');
  end if;
  return new;
end;
$$;

create trigger trg_operacoes_codigo
  before insert on public.operacoes
  for each row execute function public.set_operacao_codigo();

create trigger trg_operacoes_updated_at
  before update on public.operacoes
  for each row execute function public.set_updated_at();

alter table public.operacoes enable row level security;

create policy "select_operacoes" on public.operacoes for select
  using (empresa_id = public.current_empresa_id());

create policy "insert_operacoes" on public.operacoes for insert
  with check (empresa_id = public.current_empresa_id());

create policy "update_operacoes" on public.operacoes for update
  using (empresa_id = public.current_empresa_id());

create policy "delete_operacoes" on public.operacoes for delete
  using (empresa_id = public.current_empresa_id() and public.current_role() = 'admin');

create index idx_operacoes_empresa on public.operacoes(empresa_id);
create index idx_operacoes_status on public.operacoes(status);
