create table public.notificacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tipo text,
  titulo text not null,
  mensagem text,
  lida boolean not null default false,
  operacao_id uuid references public.operacoes(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.notificacoes enable row level security;

create policy "select_notificacoes" on public.notificacoes for select
  using (user_id = auth.uid());

create policy "insert_notificacoes" on public.notificacoes for insert
  with check (user_id = auth.uid());

create policy "update_notificacoes" on public.notificacoes for update
  using (user_id = auth.uid());

create policy "delete_notificacoes" on public.notificacoes for delete
  using (user_id = auth.uid());

create index idx_notificacoes_user on public.notificacoes(user_id, lida);
