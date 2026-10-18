-- BlueCloud release data is separate from Quranly's account/progress tables.
create table if not exists public.bluecloud_release_channels (
  channel text primary key check (channel in ('alpha', 'beta', 'stable')),
  envelope jsonb not null check (jsonb_typeof(envelope) = 'object'),
  published boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.bluecloud_release_channels enable row level security;
revoke all on public.bluecloud_release_channels from anon, authenticated;
grant select on public.bluecloud_release_channels to anon, authenticated;
create policy "Public can read published BlueCloud feeds"
  on public.bluecloud_release_channels for select to anon, authenticated
  using (published = true);
comment on table public.bluecloud_release_channels is 'Signed BlueCloud app release feeds. Only server-side release tooling may write; never put signing or service credentials in clients.';
