# Espindolar — Configuração para colocar no ar

Código já está no GitHub: https://github.com/engenhariaespindolar-sys/Sistema

## 1. Banco de dados (Supabase)

1. Crie um projeto novo no Supabase (na conta do Espíndola).
2. No **SQL Editor** do projeto, rode os arquivos da pasta `supabase/migrations/`,
   em ordem (do mais antigo pro mais novo). Eles criam todas as tabelas, os
   buckets de arquivos e as regras de segurança (RLS).
3. Pegue em **Project Settings → API**:
   - Project URL
   - `anon` `public` key
   - `service_role` key (mantenha em segredo)

## 2. Variáveis de ambiente

Preencha no `.env.local` (local) e nas variáveis de ambiente do projeto na Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
```

`ANTHROPIC_API_KEY` é opcional — sem ela o sistema funciona normalmente,
apenas os botões de IA ("Gerar parecer", "Resumir com IA" etc.) ficam
indisponíveis.

## 3. Publicar na Vercel

Na conta do Espíndola: **Add New → Project → Import Git Repository** e
selecione `engenhariaespindolar-sys/Sistema`. Cole as variáveis de ambiente
do passo 2 e publique.

## 4. Primeiro acesso

Acesse `/cadastro` e crie a primeira conta — ela vira automaticamente
administradora de uma empresa nova. Para adicionar mais pessoas à mesma
empresa (ex: um operador), cada uma cria sua própria conta em `/cadastro`
e depois, pelo SQL Editor do Supabase, ajuste a linha dela em `profiles`
para usar o mesmo `empresa_id` do administrador (ainda não existe tela de
convite de usuários).

## 5. Identidade visual

O logo atual (`src/components/ui/Logo.tsx`) é uma versão aproximada da marca
enviada pelo cliente. Quando tiver o arquivo original (SVG ou PNG em alta
resolução), me envie que eu troco pelo definitivo.

## O que ainda falta (não estava no escopo do kickoff original)

- Tela de convite/gestão de usuários (hoje é feito manualmente via SQL).
- "Lista de itens" e "compras vinculadas" da reforma — o schema atual guarda
  só o orçamento total e o diário de obra; se quiser itens detalhados,
  precisa de uma tabela nova.
- `analisarEdital` (leitura automática de edital em PDF) está pronta em
  `src/lib/anthropic.ts`, mas ainda não tem botão na tela de Documentos —
  hoje só "Resumir com IA" está exposto na interface.
