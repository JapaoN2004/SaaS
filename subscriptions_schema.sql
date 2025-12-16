-- Tabela de Assinaturas
-- (Usa IF NOT EXISTS para não dar erro se você já tiver criado)

create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text check (status in ('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused')), 
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Segurança (RLS)
alter table public.subscriptions enable row level security;

-- Remove política antiga para recriar (evita erro de duplicidade)
drop policy if exists "Users can view own subscription" on public.subscriptions;

-- Política: Usuário só pode VER a própria assinatura
create policy "Users can view own subscription"
  on public.subscriptions for select
  using ( auth.uid() = user_id );

-- Índices (IF NOT EXISTS não existe para create index padrão no postgres antigo, mas geralmente não para a execução se for script em bloco, 
-- mas para garantir, vamos usar o IF NOT EXISTS se o Supabase suportar pg10+ que suporta)
create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_stripe_customer_id_idx on public.subscriptions (stripe_customer_id);

comment on table public.subscriptions is 'Armazena status de assinatura sincronizado via Stripe Webhooks';
