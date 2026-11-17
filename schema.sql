-- شغّل هذا في Supabase: SQL Editor -> New query -> Run
create table if not exists tadbir_licenses (
  license_key text primary key,
  customer text not null,
  max_devices int not null default 1,
  machines text[] not null default '{}',
  expiry date,
  created_at timestamptz not null default now()
);

alter table tadbir_licenses disable row level security;
