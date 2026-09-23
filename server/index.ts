import 'dotenv/config';
import { Pool } from 'pg';
import { createApp } from './app';
import { MemoryStore, PostgresStore } from './store';

const port = Number(process.env.PORT ?? 4000);
const dataMode = process.env.DATA_MODE ?? (process.env.DATABASE_URL ? 'postgres' : 'memory');
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) throw new Error('JWT_SECRET must be set to at least 32 characters.');

const store = dataMode === 'postgres'
  ? new PostgresStore(new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined }))
  : new MemoryStore();

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').split(',').map(value => value.trim()).filter(Boolean);
const app = createApp({ store, jwtSecret, allowedOrigins, secureCookies: process.env.NODE_ENV === 'production' });
app.listen(port, () => console.log(`Durban United API listening on port ${port} (${dataMode})`));
