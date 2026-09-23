import { randomUUID } from 'node:crypto';
import type { Pool } from 'pg';
import type { ContactSubscription, Fixture, NewsItem, Player, Product, StoredUser } from './types';

export interface Store {
  findUserByEmail(email: string): Promise<StoredUser | null>;
  findUserById(id: string): Promise<StoredUser | null>;
  createUser(input: Omit<StoredUser, 'id' | 'role'>): Promise<StoredUser>;
  listFixtures(): Promise<Fixture[]>;
  listProducts(): Promise<Product[]>;
  listPlayers(): Promise<Player[]>;
  listNews(): Promise<NewsItem[]>;
  subscribe(email: string): Promise<ContactSubscription>;
}

const fixtures: Fixture[] = [
  { id: '75c25bb4-a8f8-4fab-9716-20837dc76bcc', competition: 'Betway Premiership', venue: 'Moses Mabhida Stadium', kickoffAt: '2026-09-27T13:00:00.000Z', status: 'scheduled', homeTeam: 'Durban United', awayTeam: 'Stellenbosch FC', homeScore: null, awayScore: null },
  { id: 'a217b413-b4f8-43ef-80b1-dde16590074e', competition: 'Betway Premiership', venue: 'Moses Mabhida Stadium', kickoffAt: '2026-09-20T13:00:00.000Z', status: 'completed', homeTeam: 'AmaZulu', awayTeam: 'Durban United', homeScore: 1, awayScore: 1 }
];

const products: Product[] = [
  { id: 'ef079cee-4e1c-4299-977d-dcb2df5a0dd8', name: 'Home Jersey 26/27', slug: 'home-jersey-26-27', description: 'Official Durban United home jersey.', category: 'jerseys', priceCents: 89900, stock: 18, imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80' },
  { id: '50f7836b-8e82-42ac-9351-6151233f3625', name: 'United Training Tee', slug: 'united-training-tee', description: 'Official training tee.', category: 'training', priceCents: 44900, stock: 32, imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=80' },
  { id: '3d04479f-9c83-49f9-a0d5-04484e9ac8ed', name: 'Heritage Cap', slug: 'heritage-cap', description: 'Durban United heritage cap.', category: 'accessories', priceCents: 29900, stock: 9, imageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80' }
];

const players: Player[] = [
  { id: '212f7ea3-5023-497d-ab68-e4df4a3a554e', slug: 'liam-jacobs', firstName: 'Liam', lastName: 'Jacobs', jerseyNumber: 1, position: 'Goalkeeper', nationality: 'South Africa', bio: 'A calm presence between the posts with sharp distribution and a relentless work ethic.', photoUrl: '/images/kit-navy.jpg' },
  { id: '82772eca-9a4f-4374-8ecb-a2934a93957e', slug: 'bongani-cele', firstName: 'Bongani', lastName: 'Cele', jerseyNumber: 4, position: 'Defender', nationality: 'South Africa', bio: 'A composed defender who brings strength, timing and leadership to the back line.', photoUrl: '/images/kit-yellow.jpg' },
  { id: 'bb84e833-f833-4fad-ae73-d61e8f520265', slug: 'thabo-mokoena', firstName: 'Thabo', lastName: 'Mokoena', jerseyNumber: 8, position: 'Midfielder', nationality: 'South Africa', bio: 'A progressive midfielder who connects the press to the final third.', photoUrl: '/images/team-standing.jpg' },
  { id: 'd93c2a79-0e6e-47f6-b70f-3b436a3581cc', slug: 'siyanda-ndlovu', firstName: 'Siyanda', lastName: 'Ndlovu', jerseyNumber: 11, position: 'Forward', nationality: 'South Africa', bio: 'A direct forward with pace, movement and an instinct for the decisive moment.', photoUrl: '/images/team-home-away.jpg' }
];

const news: NewsItem[] = [
  { id: 'b3fdc97d-7f28-421c-b246-667588adbcdf', title: 'A new chapter begins under the lights', slug: 'new-chapter-under-the-lights', excerpt: 'The new season begins in Durban.', category: 'Club News', coverUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1200&q=80', publishedAt: '2026-09-06T08:00:00.000Z' },
  { id: '74e937fe-7970-4798-881c-c61aa521dd8d', title: 'Five things to know about the new season', slug: 'five-things-new-season', excerpt: 'Everything supporters need before kick-off.', category: 'Feature', coverUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80', publishedAt: '2026-09-04T08:00:00.000Z' }
];

export class MemoryStore implements Store {
  private users = new Map<string, StoredUser>();
  private subscriptions = new Map<string, ContactSubscription>();

  async findUserByEmail(email: string) { return Array.from(this.users.values()).find(user => user.email === email.toLowerCase()) ?? null; }
  async findUserById(id: string) { return this.users.get(id) ?? null; }
  async createUser(input: Omit<StoredUser, 'id' | 'role'>) {
    if (await this.findUserByEmail(input.email)) throw new Error('EMAIL_EXISTS');
    const user: StoredUser = { ...input, email: input.email.toLowerCase(), id: randomUUID(), role: 'fan' };
    this.users.set(user.id, user);
    return user;
  }
  async listFixtures() { return fixtures; }
  async listProducts() { return products; }
  async listPlayers() { return players; }
  async listNews() { return news; }
  async subscribe(email: string) {
    const normalized = email.toLowerCase();
    const existing = this.subscriptions.get(normalized);
    if (existing) return existing;
    const subscription = { id: randomUUID(), email: normalized, createdAt: new Date().toISOString() };
    this.subscriptions.set(normalized, subscription);
    return subscription;
  }
}

export class PostgresStore implements Store {
  constructor(private pool: Pool) {}

  async findUserByEmail(email: string) {
    const result = await this.pool.query(`SELECT u.id, u.email, u.password_hash, u.first_name, u.last_name, r.name AS role FROM users u JOIN roles r ON r.id = u.role_id WHERE u.email = $1 AND u.is_active = true`, [email.toLowerCase()]);
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }
  async findUserById(id: string) {
    const result = await this.pool.query(`SELECT u.id, u.email, u.password_hash, u.first_name, u.last_name, r.name AS role FROM users u JOIN roles r ON r.id = u.role_id WHERE u.id = $1 AND u.is_active = true`, [id]);
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }
  async createUser(input: Omit<StoredUser, 'id' | 'role'>) {
    try {
      const result = await this.pool.query(`INSERT INTO users (role_id, email, password_hash, first_name, last_name) SELECT id, $1, $2, $3, $4 FROM roles WHERE name = 'fan' RETURNING id, email, password_hash, first_name, last_name`, [input.email.toLowerCase(), input.passwordHash, input.firstName, input.lastName]);
      return mapUser({ ...result.rows[0], role: 'fan' });
    } catch (error: unknown) {
      if (typeof error === 'object' && error && 'code' in error && error.code === '23505') throw new Error('EMAIL_EXISTS');
      throw error;
    }
  }
  async listFixtures() {
    const result = await this.pool.query(`SELECT f.id, f.competition, f.venue, f.kickoff_at, f.status, home.name AS home_team, away.name AS away_team, f.home_score, f.away_score FROM fixtures f JOIN teams home ON home.id = f.home_team_id JOIN teams away ON away.id = f.away_team_id ORDER BY f.kickoff_at DESC LIMIT 50`);
    return result.rows.map(row => ({ id: row.id, competition: row.competition, venue: row.venue, kickoffAt: row.kickoff_at.toISOString(), status: row.status, homeTeam: row.home_team, awayTeam: row.away_team, homeScore: row.home_score, awayScore: row.away_score }));
  }
  async listProducts() {
    const result = await this.pool.query(`SELECT id, name, slug, COALESCE(description, '') AS description, category, price_cents, stock, COALESCE(image_url, '') AS image_url FROM products WHERE is_active = true ORDER BY created_at DESC LIMIT 50`);
    return result.rows.map(row => ({ id: row.id, name: row.name, slug: row.slug, description: row.description, category: row.category, priceCents: row.price_cents, stock: row.stock, imageUrl: row.image_url }));
  }
  async listPlayers() {
    const result = await this.pool.query(`SELECT id, slug, first_name, last_name, jersey_number, position, COALESCE(nationality, '') AS nationality, COALESCE(bio, '') AS bio, COALESCE(photo_url, '') AS photo_url FROM players WHERE is_active = true ORDER BY jersey_number NULLS LAST LIMIT 50`);
    return result.rows.map(row => ({ id: row.id, slug: row.slug, firstName: row.first_name, lastName: row.last_name, jerseyNumber: row.jersey_number, position: row.position, nationality: row.nationality, bio: row.bio, photoUrl: row.photo_url }));
  }
  async listNews() {
    const result = await this.pool.query(`SELECT n.id, n.title, n.slug, COALESCE(n.excerpt, '') AS excerpt, COALESCE(c.name, 'Club News') AS category, COALESCE(n.cover_url, '') AS cover_url, n.published_at FROM news n LEFT JOIN categories c ON c.id = n.category_id WHERE n.published_at IS NOT NULL AND n.published_at <= now() ORDER BY n.published_at DESC LIMIT 50`);
    return result.rows.map(row => ({ id: row.id, title: row.title, slug: row.slug, excerpt: row.excerpt, category: row.category, coverUrl: row.cover_url, publishedAt: row.published_at.toISOString() }));
  }
  async subscribe(email: string) {
    const result = await this.pool.query(`INSERT INTO contact_subscriptions (email) VALUES ($1) ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email RETURNING id, email, created_at`, [email.toLowerCase()]);
    const row = result.rows[0];
    return { id: row.id, email: row.email, createdAt: row.created_at.toISOString() };
  }
}

function mapUser(row: Record<string, string>): StoredUser {
  return { id: row.id, email: row.email, passwordHash: row.password_hash, firstName: row.first_name, lastName: row.last_name, role: row.role as StoredUser['role'] };
}
