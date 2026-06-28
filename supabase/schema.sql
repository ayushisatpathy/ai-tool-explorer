-- AI Tool Explorer - Supabase Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ─── TOOLS ───────────────────────────────────────────────────────────────────
create table if not exists tools (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text unique not null,
  description   text,
  url           text not null,
  canonical_url text unique not null,
  logo_url      text,
  pricing_model text check (pricing_model in ('Free','Freemium','Paid','Trial','Unknown')) default 'Unknown',
  content_hash  text,
  last_seen_at  timestamptz default now(),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─── CATEGORIES ──────────────────────────────────────────────────────────────
create table if not exists categories (
  id   uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null
);

-- ─── TOOL_CATEGORIES (M2M) ───────────────────────────────────────────────────
create table if not exists tool_categories (
  tool_id     uuid references tools(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  primary key (tool_id, category_id)
);

-- ─── FAVORITES ───────────────────────────────────────────────────────────────
create table if not exists favorites (
  id         uuid primary key default gen_random_uuid(),
  tool_id    uuid references tools(id) on delete cascade,
  created_at timestamptz default now(),
  unique(tool_id)
);

-- ─── SCRAPE_RUNS ─────────────────────────────────────────────────────────────
create table if not exists scrape_runs (
  id            uuid primary key default gen_random_uuid(),
  status        text check (status in ('running','completed','failed')) default 'running',
  started_at    timestamptz default now(),
  completed_at  timestamptz,
  tools_scraped integer default 0,
  error_message text
);

-- ─── INDEXES ─────────────────────────────────────────────────────────────────
create index if not exists idx_tools_canonical_url on tools(canonical_url);
create index if not exists idx_tools_pricing_model on tools(pricing_model);
create index if not exists idx_tools_created_at    on tools(created_at desc);
create index if not exists idx_tool_categories_tool_id on tool_categories(tool_id);

-- ─── REALTIME ────────────────────────────────────────────────────────────────
-- Enable Realtime for the tools table in the Supabase dashboard:
-- Database -> Replication -> enable "tools" table

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tools_updated_at on tools;
create trigger tools_updated_at
  before update on tools
  for each row execute function set_updated_at();
