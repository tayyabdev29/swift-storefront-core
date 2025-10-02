-- =============================================
-- E-COMMERCE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create enum for order status
create type public.order_status as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- Create enum for user roles
create type public.app_role as enum ('admin', 'user');

-- Create profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'user',
  created_at timestamptz default now() not null,
  unique (user_id, role)
);

-- Create products table
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price decimal(10, 2) not null check (price >= 0),
  category text not null,
  image_url text not null,
  in_stock boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create orders table
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  status order_status default 'pending' not null,
  total_amount decimal(10, 2) not null check (total_amount >= 0),
  shipping_address jsonb not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create order_items table
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete restrict not null,
  quantity integer not null check (quantity > 0),
  price_at_time decimal(10, 2) not null check (price_at_time >= 0),
  created_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Create security definer function to check user roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- RLS Policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- RLS Policies for user_roles
create policy "Users can view their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy "Admins can view all roles"
  on public.user_roles for select
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can insert roles"
  on public.user_roles for insert
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete roles"
  on public.user_roles for delete
  using (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for products
create policy "Anyone can view products"
  on public.products for select
  using (true);

create policy "Admins can insert products"
  on public.products for insert
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update products"
  on public.products for update
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete products"
  on public.products for delete
  using (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for orders
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Admins can view all orders"
  on public.orders for select
  using (public.has_role(auth.uid(), 'admin'));

create policy "Authenticated users can create orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Admins can update orders"
  on public.orders for update
  using (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for order_items
create policy "Users can view their own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Admins can view all order items"
  on public.order_items for select
  using (public.has_role(auth.uid(), 'admin'));

create policy "Users can insert order items for their orders"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Create function to handle new user signups
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  
  -- Assign default user role
  insert into public.user_roles (user_id, role)
  values (new.id, 'user');
  
  return new;
end;
$$;

-- Trigger to create profile and role on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add updated_at triggers
create trigger set_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at
  before update on public.products
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at
  before update on public.orders
  for each row execute procedure public.handle_updated_at();

-- =============================================
-- SEED DATA
-- =============================================

-- Insert sample products
insert into public.products (name, description, price, category, image_url, in_stock) values
  ('Ceramic Vase', 'Handcrafted ceramic vase with a minimalist design. Perfect for fresh or dried flowers.', 89.00, 'Home Decor', 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&h=800&fit=crop', true),
  ('Leather Crossbody Bag', 'Premium full-grain leather bag with adjustable strap. Timeless design for everyday use.', 249.00, 'Accessories', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop', true),
  ('Brass Table Lamp', 'Modern table lamp with brass finish and adjustable arm. Adds warmth to any space.', 159.00, 'Lighting', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop', true),
  ('Cotton Throw Blanket', 'Soft cotton throw blanket in neutral tones. Perfect for cozy evenings.', 79.00, 'Textiles', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&h=800&fit=crop', true),
  ('Ceramic Coffee Mug', 'Artisan-crafted coffee mug with matte finish. Comfortable grip and perfect size.', 32.00, 'Tableware', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&h=800&fit=crop', true),
  ('Abstract Wall Art', 'Limited edition print featuring organic shapes in earth tones. Professionally framed.', 189.00, 'Art', 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&h=800&fit=crop', true);
