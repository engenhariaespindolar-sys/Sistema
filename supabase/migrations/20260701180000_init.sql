-- Extensões básicas
create extension if not exists "pgcrypto";

-- Empresas (isolamento multi-tenant)
create table public.empresas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  created_at timestamptz not null default now()
);

-- Perfis de usuário, vinculados a auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  empresa_id uuid not null references public.empresas(id),
  nome text,
  role text not null default 'operador' check (role in ('admin', 'operador')),
  created_at timestamptz not null default now()
);

alter table public.empresas enable row level security;
alter table public.profiles enable row level security;

-- Helpers usados nas políticas de RLS de todas as demais tabelas
create or replace function public.current_empresa_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select empresa_id from public.profiles where id = auth.uid();
$$;

create or replace function public.current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Trigger genérico para manter updated_at em dia
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create policy "select_own_empresa" on public.empresas for select
  using (id = public.current_empresa_id());

create policy "select_profiles_same_empresa" on public.profiles for select
  using (empresa_id = public.current_empresa_id());

create policy "update_own_profile" on public.profiles for update
  using (id = auth.uid());

-- Cria empresa + perfil automaticamente no primeiro acesso de cada novo usuário.
-- O primeiro usuário cadastrado vira admin de uma empresa nova. Para adicionar
-- mais usuários à MESMA empresa (ex: um operador), atualize manualmente o
-- empresa_id e role do perfil dele pelo SQL Editor do Supabase até existir
-- uma tela de convite de usuários.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_empresa_id uuid;
begin
  insert into public.empresas (nome)
  values (coalesce(new.raw_user_meta_data->>'nome', new.email, 'Minha Empresa'))
  returning id into v_empresa_id;

  insert into public.profiles (id, empresa_id, nome, role)
  values (new.id, v_empresa_id, new.raw_user_meta_data->>'nome', 'admin');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
