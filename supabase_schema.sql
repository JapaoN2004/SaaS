-- Create the table for storing analysis history
create table analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  contract_title text,
  contract_content text,
  analysis_report text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table analyses enable row level security;

-- Create Policy: Users can only see their own analyses
create policy "Users can view own analyses"
  on analyses for select
  using ( auth.uid() = user_id );

-- Create Policy: Users can insert their own analyses
create policy "Users can insert own analyses"
  on analyses for insert
  with check ( auth.uid() = user_id );

-- Optional: Create an index on user_id for faster lookups
create index analyses_user_id_idx on analyses (user_id);
