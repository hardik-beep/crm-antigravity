-- Enable UUID extension (optional, but good practice if we switched to UUIDs, though we use string IDs from the app)
create extension if not exists "uuid-ossp";

-- USERS TABLE
create table if not exists users (
  id text primary key, -- keeping text to match current 'admin-1' style or mongo ObjectIds converted to string
  username text unique not null,
  password text not null, -- Storing plain text as per current implementation (not recommended for prod but matching current state)
  name text not null,
  role text check (role in ('admin', 'agent')),
  created_at timestamptz default now()
);

-- SESSIONS TABLE
create table if not exists sessions (
  session_id text primary key,
  user_id text not null references users(id) on delete cascade,
  punch_in_time timestamptz,
  last_active_time timestamptz not null,
  is_active boolean default true
);

-- CRM RECORDS TABLE
create table if not exists crm_records (
  id text primary key,
  type text not null check (type in ('protect', 'settlement', 'nexus')),
  partner text not null,
  name text not null,
  mobile_number text not null,
  status text not null,
  stage text not null,
  uploaded_from text not null,
  uploaded_at timestamptz default now(),
  updated_at timestamptz default now(),
  remarks jsonb default '[]'::jsonb,
  activity_log jsonb default '[]'::jsonb,
  data jsonb default '{}'::jsonb
);

-- UPLOAD HISTORY TABLE
create table if not exists upload_history (
  id text primary key,
  file_name text not null,
  uploaded_at timestamptz default now(),
  record_type text,
  partner text,
  total_rows integer,
  valid_rows integer,
  invalid_rows integer
);

-- Create indexes for common queries
create index if not exists idx_records_type on crm_records(type);
create index if not exists idx_records_status on crm_records(status);
create index if not exists idx_records_mobile on crm_records(mobile_number);
create index if not exists idx_sessions_user_active on sessions(user_id, is_active);
