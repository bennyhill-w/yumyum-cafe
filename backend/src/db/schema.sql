-- ─────────────────────────────────────────
-- YUM-YUM CAFE — SUPABASE DATABASE SCHEMA
-- Run this once in your Supabase SQL editor
-- ─────────────────────────────────────────

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── BRANCHES ───
CREATE TABLE branches (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  address     TEXT NOT NULL,
  area        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  whatsapp    TEXT NOT NULL,
  hours       TEXT NOT NULL,
  lat         NUMERIC,
  lng         NUMERIC,
  is_open     BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed branches
INSERT INTO branches (id, name, address, area, phone, whatsapp, hours, lat, lng) VALUES
  ('baruwa', 'Baruwa', '67b Aina Obembe Street, Off Oluwaga Road, Baruwa', 'Baruwa, Lagos', '+2340000000001', '+2340000000001', '8:00 AM – 10:00 PM', 6.6095, 3.2479),
  ('ijegun', 'Ijegun', '136 Isheri Oshun Road, Isolo', 'Ijegun, Lagos', '+2340000000002', '+2340000000002', '8:00 AM – 10:00 PM', 6.5344, 3.3156),
  ('ipaja',  'Ipaja',  'Ipaja Road Bridge, Ipaja', 'Ipaja, Lagos', '+2340000000003', '+2340000000003', '8:00 AM – 10:00 PM', 6.6056, 3.2538),
  ('isheri', 'Isheri', '19 Oluwaloni Street, Isheri Oshun Road', 'Isheri, Lagos', '+2340000000004', '+2340000000004', '8:00 AM – 10:00 PM', 6.5281, 3.3189);

-- ─── MENU ITEMS ───
CREATE TABLE menu_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id     TEXT REFERENCES branches(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC(10,2) NOT NULL,
  category      TEXT NOT NULL,
  image_url     TEXT,
  is_available  BOOLEAN DEFAULT TRUE,
  is_popular    BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ORDERS ───
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number    TEXT UNIQUE NOT NULL,
  branch_id       TEXT REFERENCES branches(id),
  customer_name   TEXT NOT NULL,
  customer_phone  TEXT NOT NULL,
  customer_email  TEXT,
  items           JSONB NOT NULL,
  subtotal        NUMERIC(10,2) NOT NULL,
  payment_method  TEXT NOT NULL CHECK (payment_method IN ('pickup', 'online')),
  payment_status  TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  payment_ref     TEXT,
  order_status    TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending','confirmed','preparing','ready','completed','cancelled')),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── RESERVATIONS ───
CREATE TABLE reservations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id       TEXT REFERENCES branches(id),
  customer_name   TEXT NOT NULL,
  customer_phone  TEXT NOT NULL,
  customer_email  TEXT,
  party_size      INTEGER NOT NULL,
  date            DATE NOT NULL,
  time            TEXT NOT NULL,
  occasion        TEXT,
  special_requests TEXT,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','declined','cancelled')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CONTACTS ───
CREATE TABLE contacts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  subject     TEXT NOT NULL,
  message     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ADMIN USERS ───
CREATE TABLE admin_users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  name        TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('super_admin','branch_admin','staff')),
  branch_id   TEXT REFERENCES branches(id),
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AUTO-UPDATE updated_at ───
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── ROW LEVEL SECURITY ───
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public can read branches and menu items
CREATE POLICY "branches_public_read" ON branches FOR SELECT USING (TRUE);
CREATE POLICY "menu_public_read" ON menu_items FOR SELECT USING (is_available = TRUE);

-- Public can insert orders, reservations, contacts
CREATE POLICY "orders_public_insert" ON orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "reservations_public_insert" ON reservations FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "contacts_public_insert" ON contacts FOR INSERT WITH CHECK (TRUE);

-- Service role has full access (backend uses service role key)
CREATE POLICY "orders_service_all" ON orders USING (auth.role() = 'service_role');
CREATE POLICY "reservations_service_all" ON reservations USING (auth.role() = 'service_role');
CREATE POLICY "contacts_service_all" ON contacts USING (auth.role() = 'service_role');
CREATE POLICY "menu_service_all" ON menu_items USING (auth.role() = 'service_role');
CREATE POLICY "admin_service_all" ON admin_users USING (auth.role() = 'service_role');