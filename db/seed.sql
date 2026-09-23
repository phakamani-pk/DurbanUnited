-- Safe repeatable starter data for local development and first deployment.
INSERT INTO teams (name, short_name) VALUES
  ('Durban United', 'DU'),
  ('Stellenbosch FC', 'STELL'),
  ('AmaZulu', 'AMZ')
ON CONFLICT (name) DO NOTHING;

INSERT INTO players (team_id, first_name, last_name, slug, jersey_number, position, nationality, bio, photo_url)
SELECT t.id, seed.first_name, seed.last_name, seed.slug, seed.jersey_number, seed.position, 'South Africa', seed.bio, seed.photo_url
FROM teams t
CROSS JOIN (VALUES
  ('Liam', 'Jacobs', 'liam-jacobs', 1, 'Goalkeeper', 'A calm presence between the posts with sharp distribution and a relentless work ethic.', '/images/kit-navy.jpg'),
  ('Bongani', 'Cele', 'bongani-cele', 4, 'Defender', 'A composed defender who brings strength, timing and leadership to the back line.', '/images/kit-yellow.jpg'),
  ('Thabo', 'Mokoena', 'thabo-mokoena', 8, 'Midfielder', 'A progressive midfielder who connects the press to the final third.', '/images/team-standing.jpg'),
  ('Siyanda', 'Ndlovu', 'siyanda-ndlovu', 11, 'Forward', 'A direct forward with pace, movement and an instinct for the decisive moment.', '/images/team-home-away.jpg')
) AS seed(first_name, last_name, slug, jersey_number, position, bio, photo_url)
WHERE t.name = 'Durban United'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug) VALUES ('Club News', 'club-news'), ('Feature', 'feature') ON CONFLICT (slug) DO NOTHING;

INSERT INTO news (category_id, title, slug, excerpt, body, cover_url, published_at)
SELECT c.id, seed.title, seed.slug, seed.excerpt, seed.body, seed.cover_url, seed.published_at::timestamptz
FROM categories c
JOIN (VALUES
  ('Club News', 'A new chapter begins under the lights', 'new-chapter-under-the-lights', 'The new season begins in Durban.', 'Durban United begins a new chapter under the lights.', 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1200&q=80', '2026-09-06T08:00:00Z'),
  ('Feature', 'Five things to know about the new season', 'five-things-new-season', 'Everything supporters need before kick-off.', 'A supporter guide to the new Durban United season.', 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80', '2026-09-04T08:00:00Z')
) AS seed(category, title, slug, excerpt, body, cover_url, published_at) ON seed.category = c.name
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, category, price_cents, stock, image_url)
VALUES
  ('Home Jersey 26/27', 'home-jersey-26-27', 'Official Durban United home jersey.', 'jerseys', 89900, 18, 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80'),
  ('United Training Tee', 'united-training-tee', 'Official training tee.', 'training', 44900, 32, 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=80'),
  ('Heritage Cap', 'heritage-cap', 'Durban United heritage cap.', 'accessories', 29900, 9, 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO fixtures (home_team_id, away_team_id, competition, venue, kickoff_at, status)
SELECT home.id, away.id, 'Betway Premiership', 'Moses Mabhida Stadium', '2026-09-27T13:00:00Z', 'scheduled'
FROM teams home, teams away WHERE home.name = 'Durban United' AND away.name = 'Stellenbosch FC'
AND NOT EXISTS (SELECT 1 FROM fixtures WHERE kickoff_at = '2026-09-27T13:00:00Z');
