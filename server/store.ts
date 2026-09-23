import { randomUUID } from 'node:crypto';
import type { Pool } from 'pg';
import type { AdminOverview, AdminRecord, AdminResource, ContactSubscription, Fixture, NewsItem, Notification, OrderStatus, OrderSummary, Player, Product, StoredUser } from './types';

export interface Store {
  findUserByEmail(email: string): Promise<StoredUser | null>;
  findUserById(id: string): Promise<StoredUser | null>;
  createUser(input: Omit<StoredUser, 'id' | 'role'>): Promise<StoredUser>;
  listFixtures(): Promise<Fixture[]>;
  listProducts(): Promise<Product[]>;
  listPlayers(): Promise<Player[]>;
  listNews(): Promise<NewsItem[]>;
  subscribe(email: string): Promise<ContactSubscription>;
  listOrdersByUser(userId: string): Promise<OrderSummary[]>;
  listNotificationsByUser(userId: string): Promise<Notification[]>;
  getAdminOverview(): Promise<AdminOverview>;
  listAdminUsers(): Promise<Omit<StoredUser, 'passwordHash'>[]>;
  listAdminOrders(): Promise<OrderSummary[]>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<OrderSummary | null>;
  updateProductStock(id: string, stock: number): Promise<Product | null>;
  listAdminResource(resource: AdminResource): Promise<AdminRecord[]>;
  createAdminResource(resource: AdminResource, input: Record<string, unknown>, actorId: string): Promise<AdminRecord>;
  updateAdminResource(resource: AdminResource, id: string, input: Record<string, unknown>, actorId: string): Promise<AdminRecord | null>;
  deleteAdminResource(resource: AdminResource, id: string): Promise<boolean>;
  updateUserAccess(id: string, role: 'fan' | 'admin', isActive: boolean): Promise<Omit<StoredUser, 'passwordHash'> | null>;
  createNotification(userId: string, title: string, body: string): Promise<Notification>;
  ensureAdmin(email: string, passwordHash: string, firstName: string, lastName: string): Promise<void>;
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
  private orders: OrderSummary[] = [];
  private notifications = new Map<string, Notification[]>();
  private subscriptions = new Map<string, ContactSubscription>();

  constructor(seedUsers: StoredUser[] = []) { for (const user of seedUsers) this.users.set(user.id, user); }

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
  async listOrdersByUser(userId: string) { return this.orders.filter(order => order.id.startsWith(`${userId}:`)); }
  async listNotificationsByUser(userId: string) { return this.notifications.get(userId) ?? []; }
  async getAdminOverview() {
    return { userCount: this.users.size, orderCount: this.orders.length, pendingOrderCount: this.orders.filter(order => order.status === 'pending').length, productCount: products.length, lowStockCount: products.filter(product => product.stock < 10).length, grossMerchandiseValueCents: this.orders.filter(order => !['pending', 'cancelled'].includes(order.status)).reduce((sum, order) => sum + order.totalCents, 0) };
  }
  async listAdminUsers() { return Array.from(this.users.values()).map(({ passwordHash: _passwordHash, ...user }) => user); }
  async listAdminOrders() { return this.orders; }
  async updateOrderStatus(id: string, status: OrderStatus) { const order = this.orders.find(item => item.id === id); if (!order) return null; order.status = status; return order; }
  async updateProductStock(id: string, stock: number) { const product = products.find(item => item.id === id); if (!product) return null; product.stock = stock; return product; }
  async listAdminResource(resource: AdminResource) {
    if (resource === 'players') return players as unknown as AdminRecord[];
    if (resource === 'news') return news as unknown as AdminRecord[];
    if (resource === 'fixtures') return fixtures as unknown as AdminRecord[];
    if (resource === 'products') return products as unknown as AdminRecord[];
    return [];
  }
  async createAdminResource(_resource: AdminResource, input: Record<string, unknown>) { return { id: randomUUID(), ...input } as AdminRecord; }
  async updateAdminResource(_resource: AdminResource, id: string, input: Record<string, unknown>) { return { id, ...input } as AdminRecord; }
  async deleteAdminResource() { return true; }
  async updateUserAccess(id: string, role: 'fan' | 'admin', isActive: boolean) { const user = this.users.get(id); if (!user || !isActive) return null; user.role = role; const { passwordHash: _passwordHash, ...publicRecord } = user; return publicRecord; }
  async createNotification(userId: string, title: string, body: string) { const item = { id: randomUUID(), title, body, readAt: null, createdAt: new Date().toISOString() }; this.notifications.set(userId, [item, ...(this.notifications.get(userId) ?? [])]); return item; }
  async ensureAdmin(email: string, passwordHash: string, firstName: string, lastName: string) { const existing = await this.findUserByEmail(email); if (existing) { existing.role = 'admin'; existing.passwordHash = passwordHash; return; } const user: StoredUser = { id: randomUUID(), email: email.toLowerCase(), passwordHash, firstName, lastName, role: 'admin' }; this.users.set(user.id, user); }
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
  async listOrdersByUser(userId: string) {
    const result = await this.pool.query(`SELECT o.id, o.status, o.total_cents, o.created_at, count(oi.id)::int AS item_count FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id WHERE o.user_id = $1 GROUP BY o.id ORDER BY o.created_at DESC LIMIT 50`, [userId]);
    return result.rows.map(mapOrder);
  }
  async listNotificationsByUser(userId: string) {
    const result = await this.pool.query(`SELECT id, title, body, read_at, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`, [userId]);
    return result.rows.map(row => ({ id: row.id, title: row.title, body: row.body, readAt: row.read_at?.toISOString() ?? null, createdAt: row.created_at.toISOString() }));
  }
  async getAdminOverview() {
    const result = await this.pool.query(`SELECT (SELECT count(*) FROM users WHERE is_active = true)::int AS user_count, (SELECT count(*) FROM orders)::int AS order_count, (SELECT count(*) FROM orders WHERE status = 'pending')::int AS pending_order_count, (SELECT count(*) FROM products WHERE is_active = true)::int AS product_count, (SELECT count(*) FROM products WHERE is_active = true AND stock < 10)::int AS low_stock_count, COALESCE((SELECT sum(total_cents) FROM orders WHERE status NOT IN ('pending','cancelled')), 0)::bigint AS gmv`);
    const row = result.rows[0];
    return { userCount: row.user_count, orderCount: row.order_count, pendingOrderCount: row.pending_order_count, productCount: row.product_count, lowStockCount: row.low_stock_count, grossMerchandiseValueCents: Number(row.gmv) };
  }
  async listAdminUsers() {
    const result = await this.pool.query(`SELECT u.id, u.email, u.first_name, u.last_name, r.name AS role FROM users u JOIN roles r ON r.id = u.role_id WHERE u.is_active = true ORDER BY u.created_at DESC LIMIT 50`);
    return result.rows.map(row => ({ id: row.id, email: row.email, firstName: row.first_name, lastName: row.last_name, role: row.role }));
  }
  async listAdminOrders() {
    const result = await this.pool.query(`SELECT o.id, o.status, o.total_cents, o.created_at, u.first_name || ' ' || u.last_name AS customer_name, u.email AS customer_email, count(oi.id)::int AS item_count FROM orders o JOIN users u ON u.id = o.user_id LEFT JOIN order_items oi ON oi.order_id = o.id GROUP BY o.id, u.id ORDER BY o.created_at DESC LIMIT 50`);
    return result.rows.map(mapOrder);
  }
  async updateOrderStatus(id: string, status: OrderStatus) {
    const result = await this.pool.query(`UPDATE orders SET status = $2 WHERE id = $1 RETURNING id, status, total_cents, created_at, 0::int AS item_count`, [id, status]);
    return result.rows[0] ? mapOrder(result.rows[0]) : null;
  }
  async updateProductStock(id: string, stock: number) {
    const result = await this.pool.query(`UPDATE products SET stock = $2 WHERE id = $1 RETURNING id, name, slug, COALESCE(description, '') AS description, category, price_cents, stock, COALESCE(image_url, '') AS image_url`, [id, stock]);
    const row = result.rows[0];
    return row ? { id: row.id, name: row.name, slug: row.slug, description: row.description, category: row.category, priceCents: row.price_cents, stock: row.stock, imageUrl: row.image_url } : null;
  }
  async listAdminResource(resource: AdminResource) { return this.queryAdminResource(resource); }
  async createAdminResource(resource: AdminResource, input: Record<string, unknown>, actorId: string) {
    const spec = adminSql(resource, input, actorId);
    const result = await this.pool.query(spec.insert, spec.values);
    return mapAdminRecord(result.rows[0]);
  }
  async updateAdminResource(resource: AdminResource, id: string, input: Record<string, unknown>, actorId: string) {
    const spec = adminSql(resource, input, actorId);
    const assignments = spec.columns.map((column, index) => `${column} = $${index + 2}`).join(', ');
    const result = await this.pool.query(`UPDATE ${resource} SET ${assignments}${resource === 'news' ? ', updated_at = now()' : resource === 'standings' ? ', updated_at = now()' : ''} WHERE id = $1 RETURNING *`, [id, ...spec.values]);
    return result.rows[0] ? mapAdminRecord(result.rows[0]) : null;
  }
  async deleteAdminResource(resource: AdminResource, id: string) { const result = await this.pool.query(`DELETE FROM ${resource} WHERE id = $1`, [id]); return Boolean(result.rowCount); }
  async updateUserAccess(id: string, role: 'fan' | 'admin', isActive: boolean) {
    const result = await this.pool.query(`UPDATE users SET role_id = (SELECT id FROM roles WHERE name = $2), is_active = $3, updated_at = now() WHERE id = $1 RETURNING id, email, first_name, last_name`, [id, role, isActive]);
    return result.rows[0] ? { id: result.rows[0].id, email: result.rows[0].email, firstName: result.rows[0].first_name, lastName: result.rows[0].last_name, role } : null;
  }
  async createNotification(userId: string, title: string, body: string) { const result = await this.pool.query(`INSERT INTO notifications (user_id, title, body) VALUES ($1, $2, $3) RETURNING id, title, body, read_at, created_at`, [userId, title, body]); const row = result.rows[0]; return { id: row.id, title: row.title, body: row.body, readAt: null, createdAt: row.created_at.toISOString() }; }
  async ensureAdmin(email: string, passwordHash: string, firstName: string, lastName: string) {
    await this.pool.query(`INSERT INTO users (role_id, email, password_hash, first_name, last_name) SELECT id, $1, $2, $3, $4 FROM roles WHERE name = 'admin' ON CONFLICT (email) DO UPDATE SET role_id = (SELECT id FROM roles WHERE name = 'admin'), password_hash = EXCLUDED.password_hash, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, is_active = true, updated_at = now()`, [email.toLowerCase(), passwordHash, firstName, lastName]);
  }
  private async queryAdminResource(resource: AdminResource) { const result = await this.pool.query(adminSelect(resource)); return result.rows.map(mapAdminRecord); }
  async subscribe(email: string) {
    const result = await this.pool.query(`INSERT INTO contact_subscriptions (email) VALUES ($1) ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email RETURNING id, email, created_at`, [email.toLowerCase()]);
    const row = result.rows[0];
    return { id: row.id, email: row.email, createdAt: row.created_at.toISOString() };
  }
}

function mapUser(row: Record<string, string>): StoredUser {
  return { id: row.id, email: row.email, passwordHash: row.password_hash, firstName: row.first_name, lastName: row.last_name, role: row.role as StoredUser['role'] };
}

function mapOrder(row: Record<string, any>): OrderSummary { return { id: row.id, status: row.status, totalCents: Number(row.total_cents), createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at, customerName: row.customer_name, customerEmail: row.customer_email, itemCount: Number(row.item_count) }; }

function adminSelect(resource: AdminResource) {
  const selects: Record<AdminResource, string> = {
    teams: `SELECT id, name, short_name, COALESCE(logo_url, '') AS logo_url FROM teams ORDER BY name`,
    players: `SELECT id, team_id, first_name, last_name, slug, jersey_number, position, COALESCE(nationality, '') AS nationality, COALESCE(bio, '') AS bio, COALESCE(photo_url, '') AS photo_url, is_active FROM players ORDER BY jersey_number NULLS LAST`,
    news: `SELECT id, title, slug, COALESCE(excerpt, '') AS excerpt, body, COALESCE(cover_url, '') AS cover_url, published_at FROM news ORDER BY created_at DESC`,
    fixtures: `SELECT id, home_team_id, away_team_id, competition, COALESCE(venue, '') AS venue, kickoff_at, status, home_score, away_score FROM fixtures ORDER BY kickoff_at DESC`,
    standings: `SELECT id, team_id, competition, season, position, played, won, drawn, lost, goals_for, goals_against, points FROM standings ORDER BY position`,
    products: `SELECT id, name, slug, COALESCE(description, '') AS description, category, price_cents, stock, COALESCE(image_url, '') AS image_url, is_active FROM products ORDER BY created_at DESC`,
    gallery: `SELECT id, title, media_type, media_url, COALESCE(thumbnail_url, '') AS thumbnail_url, published_at FROM gallery ORDER BY created_at DESC`,
    sponsors: `SELECT id, name, logo_url, COALESCE(website_url, '') AS website_url, COALESCE(tier, '') AS tier, sort_order, is_active FROM sponsors ORDER BY sort_order, name`
  }; return selects[resource];
}
function adminSql(resource: AdminResource, input: Record<string, unknown>, actorId: string) {
  const definitions: Record<AdminResource, { columns: string[]; keys: string[] }> = {
    teams: { columns: ['name','short_name','logo_url'], keys: ['name','shortName','logoUrl'] },
    players: { columns: ['team_id','first_name','last_name','slug','jersey_number','position','nationality','bio','photo_url','is_active'], keys: ['teamId','firstName','lastName','slug','jerseyNumber','position','nationality','bio','photoUrl','isActive'] },
    news: { columns: ['author_id','title','slug','excerpt','body','cover_url','published_at'], keys: ['authorId','title','slug','excerpt','body','coverUrl','publishedAt'] },
    fixtures: { columns: ['home_team_id','away_team_id','competition','venue','kickoff_at','status','home_score','away_score'], keys: ['homeTeamId','awayTeamId','competition','venue','kickoffAt','status','homeScore','awayScore'] },
    standings: { columns: ['team_id','competition','season','position','played','won','drawn','lost','goals_for','goals_against','points'], keys: ['teamId','competition','season','position','played','won','drawn','lost','goalsFor','goalsAgainst','points'] },
    products: { columns: ['name','slug','description','category','price_cents','stock','image_url','is_active'], keys: ['name','slug','description','category','priceCents','stock','imageUrl','isActive'] },
    gallery: { columns: ['title','media_type','media_url','thumbnail_url','published_at'], keys: ['title','mediaType','mediaUrl','thumbnailUrl','publishedAt'] },
    sponsors: { columns: ['name','logo_url','website_url','tier','sort_order','is_active'], keys: ['name','logoUrl','websiteUrl','tier','sortOrder','isActive'] }
  };
  const definition = definitions[resource]; const source: Record<string, unknown> = { ...input, authorId: actorId };
  const values = definition.keys.map(key => source[key] === '' ? null : source[key]);
  const placeholders = definition.columns.map((_, index) => `$${index + 1}`).join(', ');
  return { columns: definition.columns, values, insert: `INSERT INTO ${resource} (${definition.columns.join(', ')}) VALUES (${placeholders}) RETURNING *` };
}
function mapAdminRecord(row: Record<string, any>): AdminRecord {
  const result: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(row)) { const camel = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()); result[camel] = value instanceof Date ? value.toISOString() : value; }
  return result as AdminRecord;
}
