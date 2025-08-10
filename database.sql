-- إنشاء المخطط الأساسي لقاعدة البيانات لنظام المصادقة والتفعيل

-- جداول
create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null,
  full_name text,
  phone text,
  is_activated boolean not null default false,
  can_access_content boolean not null default false,
  subscription_status text check (subscription_status in ('active','inactive','trial','expired')) default 'inactive',
  created_at timestamp with time zone default now()
);

create table if not exists public.activation_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  user_id uuid references auth.users(id) on delete cascade,
  is_used boolean not null default false,
  expires_at timestamp with time zone not null default (now() + interval '24 hours'),
  created_at timestamp with time zone default now()
);

create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_cents integer not null,
  duration_days integer not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  plan_id uuid references public.subscription_plans(id),
  status text check (status in ('active','inactive','trial','expired')) not null default 'inactive',
  started_at timestamp with time zone default now(),
  expires_at timestamp with time zone
);

create table if not exists public.user_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  action text not null,
  meta jsonb,
  created_at timestamp with time zone default now()
);

-- RLS
alter table public.user_profiles enable row level security;
alter table public.activation_codes enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.user_activity enable row level security;

-- سياسات
create policy if not exists "Profiles: users can read own profile" on public.user_profiles
  for select using (auth.uid() = user_id);
create policy if not exists "Profiles: users can upsert own profile" on public.user_profiles
  for insert with check (auth.uid() = user_id);
create policy if not exists "Profiles: users can update own profile" on public.user_profiles
  for update using (auth.uid() = user_id);

create policy if not exists "Codes: user can use own code" on public.activation_codes
  for select using (user_id is null or auth.uid() = user_id);
create policy if not exists "Codes: insert allowed" on public.activation_codes
  for insert with check (true);
create policy if not exists "Codes: update used flag by owner" on public.activation_codes
  for update using (auth.uid() = user_id);

create policy if not exists "Plans: read all" on public.subscription_plans for select using (true);
create policy if not exists "UserSubs: read own" on public.user_subscriptions for select using (auth.uid() = user_id);
create policy if not exists "UserSubs: insert own" on public.user_subscriptions for insert with check (auth.uid() = user_id);
create policy if not exists "UserSubs: update own" on public.user_subscriptions for update using (auth.uid() = user_id);

-- دالة لتفعيل الحساب عبر الكود
create or replace function public.activate_account(p_code text)
returns boolean
language plpgsql
as $$
declare
  v_code activation_codes%rowtype;
  v_user uuid;
begin
  select * into v_code from activation_codes where code = p_code and is_used = false and expires_at > now() limit 1;
  if not found then
    return false;
  end if;

  v_user := coalesce(v_code.user_id, auth.uid());
  if v_user is null then
    return false;
  end if;

  -- وضع الكود كمستخدم وتمييزه كمستخدم
  update activation_codes set is_used = true, user_id = v_user where id = v_code.id;

  -- تفعيل الملف الشخصي
  insert into user_profiles(user_id, is_activated, can_access_content, subscription_status)
  values (v_user, true, true, 'active')
  on conflict (user_id) do update set is_activated = true, can_access_content = true, subscription_status = 'active';

  return true;
end;
$$;
