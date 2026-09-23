export type Role = 'fan' | 'editor' | 'admin';

export type PublicUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
};

export type StoredUser = PublicUser & { passwordHash: string };

export type Fixture = {
  id: string;
  competition: string;
  venue: string;
  kickoffAt: string;
  status: 'scheduled' | 'live' | 'completed' | 'postponed';
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  priceCents: number;
  stock: number;
  imageUrl: string;
};

export type Player = {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  jerseyNumber: number | null;
  position: string;
  nationality: string;
  bio: string;
  photoUrl: string;
};

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverUrl: string;
  publishedAt: string;
};

export type ContactSubscription = {
  id: string;
  email: string;
  createdAt: string;
};

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'complete' | 'cancelled';

export type OrderSummary = {
  id: string;
  status: OrderStatus;
  totalCents: number;
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
  itemCount: number;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
};

export type AdminOverview = {
  userCount: number;
  orderCount: number;
  pendingOrderCount: number;
  productCount: number;
  lowStockCount: number;
  grossMerchandiseValueCents: number;
};

export type AdminResource = 'teams' | 'players' | 'news' | 'fixtures' | 'standings' | 'products' | 'gallery' | 'sponsors';
export type AdminRecord = Record<string, string | number | boolean | null> & { id: string };
