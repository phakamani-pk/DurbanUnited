CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE roles (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(40) UNIQUE NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), role_id UUID NOT NULL REFERENCES roles(id), email CITEXT UNIQUE NOT NULL, password_hash TEXT, first_name VARCHAR(80) NOT NULL, last_name VARCHAR(80) NOT NULL, avatar_url TEXT, provider VARCHAR(20) NOT NULL DEFAULT 'local' CHECK (provider IN ('local','google')), is_active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE teams (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(120) UNIQUE NOT NULL, short_name VARCHAR(12) NOT NULL, logo_url TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE players (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), team_id UUID NOT NULL REFERENCES teams(id), first_name VARCHAR(80) NOT NULL, last_name VARCHAR(80) NOT NULL, jersey_number SMALLINT CHECK (jersey_number BETWEEN 1 AND 99), position VARCHAR(30) NOT NULL, nationality VARCHAR(80), birth_date DATE, bio TEXT, photo_url TEXT, is_active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE categories (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(60) UNIQUE NOT NULL, slug VARCHAR(70) UNIQUE NOT NULL);
CREATE TABLE news (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), author_id UUID REFERENCES users(id), category_id UUID REFERENCES categories(id), title VARCHAR(180) NOT NULL, slug VARCHAR(200) UNIQUE NOT NULL, excerpt TEXT, body TEXT NOT NULL, cover_url TEXT, published_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE fixtures (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), home_team_id UUID NOT NULL REFERENCES teams(id), away_team_id UUID NOT NULL REFERENCES teams(id), competition VARCHAR(100) NOT NULL, venue VARCHAR(160), kickoff_at TIMESTAMPTZ NOT NULL, home_score SMALLINT CHECK (home_score >= 0), away_score SMALLINT CHECK (away_score >= 0), status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','live','completed','postponed')), created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE products (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(160) NOT NULL, slug VARCHAR(180) UNIQUE NOT NULL, description TEXT, category VARCHAR(40) NOT NULL, price_cents INTEGER NOT NULL CHECK (price_cents >= 0), stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0), image_url TEXT, is_active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE orders (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id), status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','processing','shipped','complete','cancelled')), total_cents INTEGER NOT NULL CHECK (total_cents >= 0), shipping_address JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE order_items (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE, product_id UUID NOT NULL REFERENCES products(id), quantity INTEGER NOT NULL CHECK (quantity > 0), unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0));
CREATE TABLE payments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), order_id UUID NOT NULL REFERENCES orders(id), provider VARCHAR(20) NOT NULL CHECK (provider IN ('stripe','payfast','eft')), provider_reference VARCHAR(180), amount_cents INTEGER NOT NULL, status VARCHAR(20) NOT NULL CHECK (status IN ('pending','successful','failed','refunded')), created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE gallery (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title VARCHAR(160) NOT NULL, media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('image','video')), media_url TEXT NOT NULL, thumbnail_url TEXT, published_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE sponsors (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(120) NOT NULL, logo_url TEXT NOT NULL, website_url TEXT, tier VARCHAR(30), sort_order INTEGER NOT NULL DEFAULT 0, is_active BOOLEAN NOT NULL DEFAULT true);
CREATE TABLE tickets (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id), fixture_id UUID NOT NULL REFERENCES fixtures(id), order_id UUID REFERENCES orders(id), ticket_code VARCHAR(100) UNIQUE NOT NULL, seat_label VARCHAR(40), status VARCHAR(20) NOT NULL DEFAULT 'valid' CHECK (status IN ('valid','used','cancelled')), created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE notifications (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, title VARCHAR(160) NOT NULL, body TEXT NOT NULL, read_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE favorites (user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, news_id UUID REFERENCES news(id) ON DELETE CASCADE, product_id UUID REFERENCES products(id) ON DELETE CASCADE, PRIMARY KEY (user_id, news_id, product_id), CHECK ((news_id IS NOT NULL) <> (product_id IS NOT NULL)));
CREATE INDEX news_published_idx ON news (published_at DESC) WHERE published_at IS NOT NULL;
CREATE INDEX fixtures_kickoff_idx ON fixtures (kickoff_at);
CREATE INDEX products_category_idx ON products (category) WHERE is_active = true;
CREATE INDEX orders_user_status_idx ON orders (user_id, status);
CREATE INDEX notifications_unread_idx ON notifications (user_id) WHERE read_at IS NULL;
INSERT INTO roles (name) VALUES ('fan'), ('editor'), ('admin') ON CONFLICT (name) DO NOTHING;

-- Backend MVP additions.
ALTER TABLE players ADD COLUMN IF NOT EXISTS slug VARCHAR(180);
UPDATE players SET slug = lower(regexp_replace(trim(first_name || '-' || last_name), '[^a-zA-Z0-9]+', '-', 'g')) WHERE slug IS NULL;
ALTER TABLE players ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS players_slug_unique_idx ON players (slug);

CREATE TABLE IF NOT EXISTS contact_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
