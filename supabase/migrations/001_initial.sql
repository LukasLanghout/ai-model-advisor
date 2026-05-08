-- Scenarios: opslag van gebruikersvragen
create table scenarios (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc', now()) not null,
  session_id text not null,
  use_case text,
  scale text,
  latency text,
  budget text,
  privacy text,
  integration text
);

-- Feedback: beoordeling van aanbevelingen
create table feedback (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc', now()) not null,
  session_id text not null,
  rating integer check (rating >= 1 and rating <= 5),
  top_recommendation text,
  comment text
);

alter table scenarios enable row level security;
alter table feedback enable row level security;

create policy "Anonieme inserts toegestaan" on scenarios for insert with check (true);
create policy "Anonieme inserts toegestaan" on feedback for insert with check (true);
