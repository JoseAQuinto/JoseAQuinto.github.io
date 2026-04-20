create table if not exists public.products (
  id bigserial primary key,
  description text not null,
  reference text not null,
  last_modified timestamptz not null default now(),
  quantity integer not null default 0,
  min_stock integer not null default 0
);

create table if not exists public.dashboard_settings (
  id bigserial primary key,
  show_reference_column boolean not null default true,
  show_last_modified_column boolean not null default true,
  show_min_stock_column boolean not null default true,
  updated_at timestamptz not null default now()
);