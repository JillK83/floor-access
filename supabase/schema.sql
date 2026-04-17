create table floor_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  status text default 'available' check (status in ('available', 'pending', 'sold')),
  created_at timestamp default now()
);

create table inquiries (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references floor_items(id),
  item_name text,
  customer_message text not null,
  phone text not null,
  urgency text,
  intent_tag text,
  sms_reply text,
  status text default 'new' check (status in ('new', 'replied', 'closed')),
  created_at timestamp default now()
);

alter publication supabase_realtime add table floor_items;
alter publication supabase_realtime add table inquiries;

insert into floor_items (name, description, image_url, status) values
('Ming Dynasty Day Bed', 'Carved elmwood, circa 1890. One of a kind.', 'https://placehold.co/600x400/1a1a1a/ffffff?text=Day+Bed', 'available'),
('Shanxi Cabinet', 'Red lacquer, original hardware. Stunning patina.', 'https://placehold.co/600x400/1a1a1a/ffffff?text=Shanxi+Cabinet', 'available'),
('Scholar Stone', 'Large Taihu limestone. Statement piece.', 'https://placehold.co/600x400/1a1a1a/ffffff?text=Scholar+Stone', 'available');
