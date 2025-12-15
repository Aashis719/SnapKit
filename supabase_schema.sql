-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Enhanced for Personalization)
-- Extends Supabase Auth with user preferences and credits.
create table profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  plan_tier text default 'free' check (plan_tier in ('free', 'pro', 'team', 'enterprise')),
  credits_remaining integer default 10,
  
  -- Personalization Fields
  preferences jsonb default '{}'::jsonb, -- Store UI theme, default language, etc.
  brand_settings jsonb default '{}'::jsonb, -- Store Brand Voice, Default Tone, Whitelisted Hashtags
  
  -- API Key (Added 2025-12-14)
  gemini_api_key text, -- User's Gemini API key, stored securely
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for profiles
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. IMAGES (Asset Management)
-- Stores metadata about uploaded images in Cloudinary.
create table images (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  
  cloudinary_public_id text not null,
  cloudinary_url text not null,
  
  width integer,
  height integer,
  format text,
  file_size integer,
  
  scene_summary text, -- AI generated summary for search
  primary_color text, -- For UI theming
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for images
alter table images enable row level security;
create policy "Users can view own images" on images for select using (auth.uid() = user_id);
create policy "Users can insert own images" on images for insert with check (auth.uid() = user_id);
create policy "Users can delete own images" on images for delete using (auth.uid() = user_id);


-- 3. FOLDERS / COLLECTIONS (Managed Form Experience)
-- Organize generations into projects or campaigns.
create table folders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table folders enable row level security;
create policy "Users can view own folders" on folders for select using (auth.uid() = user_id);
create policy "Users can manage own folders" on folders for all using (auth.uid() = user_id);


-- 4. TEMPLATES (Saved Configurations)
-- Allow users to save their "Managed Form" settings (Tone, Platforms, etc.)
create table templates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null, -- null for system templates
  name text not null,
  description text,
  config jsonb not null, -- Stores the SocialKitConfig object
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table templates enable row level security;
create policy "Users can view own and system templates" on templates for select using (auth.uid() = user_id or user_id is null);
create policy "Users can manage own templates" on templates for all using (auth.uid() = user_id);


-- 5. GENERATIONS (Core Data)
-- Stores the huge JSON result but also metadata for sorting/filtering.
create table generations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  image_id uuid references images(id) on delete set null, -- Keep generation even if image deleted? or cascade.
  folder_id uuid references folders(id) on delete set null,
  
  status text default 'completed' check (status in ('queued', 'processing', 'completed', 'failed')),
  
  -- Inputs used
  inputs jsonb not null, 
  
  -- The Output (Captions, Hashtags, Scripts)
  results jsonb not null,
  
  -- Meta for Management
  is_favorite boolean default false,
  rating integer check (rating >= 1 and rating <= 5), -- User feedback
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for generations
alter table generations enable row level security;
create policy "Users can view own generations" on generations for select using (auth.uid() = user_id);
create policy "Users can insert own generations" on generations for insert with check (auth.uid() = user_id);
create policy "Users can update own generations" on generations for update using (auth.uid() = user_id);
create policy "Users can delete own generations" on generations for delete using (auth.uid() = user_id);


-- 6. USAGE LOGS (Billing & Limits)
create table usage_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  generation_id uuid references generations(id),
  credits_used integer not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table usage_logs enable row level security;
create policy "Users can view own usage" on usage_logs for select using (auth.uid() = user_id);
