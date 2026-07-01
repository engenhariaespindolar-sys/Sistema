create table public.documentos (
  id uuid primary key default gen_random_uuid(),
  operacao_id uuid not null references public.operacoes(id) on delete cascade,
  tipo text not null check (tipo in (
    'edital', 'matricula', 'foto', 'contrato', 'procuracao', 'laudo', 'escritura', 'comprovante', 'outro'
  )),
  nome text not null,
  url text not null,
  resumo_ia text,
  created_at timestamptz not null default now()
);

alter table public.documentos enable row level security;

create policy "select_documentos" on public.documentos for select
  using (exists (
    select 1 from public.operacoes o
    where o.id = documentos.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "insert_documentos" on public.documentos for insert
  with check (exists (
    select 1 from public.operacoes o
    where o.id = documentos.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "update_documentos" on public.documentos for update
  using (exists (
    select 1 from public.operacoes o
    where o.id = documentos.operacao_id and o.empresa_id = public.current_empresa_id()
  ));

create policy "delete_documentos" on public.documentos for delete
  using (exists (
    select 1 from public.operacoes o
    where o.id = documentos.operacao_id and o.empresa_id = public.current_empresa_id()
  ) and public.current_role() = 'admin');

create index idx_documentos_operacao on public.documentos(operacao_id);
