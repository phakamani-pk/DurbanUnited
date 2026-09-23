import 'dotenv/config';
import { Pool } from 'pg';

async function main() {
const email = process.argv[2]?.trim().toLowerCase();
if (!email) throw new Error('Usage: npm run admin:promote -- admin@example.com');
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined });
try {
  const result = await pool.query(`UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'admin'), updated_at = now() WHERE email = $1 RETURNING email`, [email]);
  if (!result.rowCount) throw new Error('User not found. Register the account first.');
  console.log(`Promoted ${result.rows[0].email} to admin.`);
} finally { await pool.end(); }
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Admin promotion failed.'); process.exitCode = 1; });
