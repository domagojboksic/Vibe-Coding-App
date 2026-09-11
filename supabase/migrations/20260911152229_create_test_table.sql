create table profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  updated_at timestamp with time zone
);
