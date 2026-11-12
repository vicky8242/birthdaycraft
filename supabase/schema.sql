-- BirthdayBliss database schema
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).
-- Safe to re-run: every statement is idempotent.

create extension if not exists "uuid-ossp";

create table if not exists public.wishes (
  id                   uuid default uuid_generate_v4() primary key,
  slug                 text unique not null,
  birthday_person_name text not null,
  nickname             text,
  sender_name          text not null,
  birthday_date        date,
  milestone            text,
  relationship         text,
  message              text not null,
  favorite_memory      text,
  final_note           text not null,
  signoff              text not null default 'With Love',
  mood                 text not null default 'romantic',
  theme_color          text not null default 'pink',
  qualities            text[] default '{}',
  photo_urls           text[] default '{}',
  balloon_words        text[] default '{}',
  compliments          text[] default '{}',
  music_track          text default 'dreamy',
  is_paid              boolean default false,
  payment_order_id     text,
  payment_id           text,
  created_at           timestamptz default now()
);

-- If you created the table with the first version of the app, add the new columns:
alter table public.wishes add column if not exists nickname      text;
alter table public.wishes add column if not exists balloon_words text[] default '{}';
alter table public.wishes add column if not exists compliments   text[] default '{}';
alter table public.wishes add column if not exists music_track   text default 'dreamy';
alter table public.wishes alter column birthday_date drop not null;

-- Row level security.
-- All reads and writes happen on the server with the service-role key (which bypasses RLS),
-- so we deliberately expose NOTHING to the public anon key.
alter table public.wishes enable row level security;
drop policy if exists "Read paid wishes" on public.wishes;
drop policy if exists "Insert wishes"    on public.wishes;

-- Photo storage (public read so the shared page can show the images).
insert into storage.buckets (id, name, public)
  values ('wish-photos', 'wish-photos', true)
  on conflict (id) do nothing;

drop policy if exists "Public photo access" on storage.objects;
create policy "Public photo access" on storage.objects
  for select using (bucket_id = 'wish-photos');
-- Uploads are done server-side with the service-role key, so no public insert policy is needed.
drop policy if exists "Upload photos" on storage.objects;
