import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('authentication contains no embedded admin password or browser-stored fake session', async () => {
  const login = await readFile('app/login/page.tsx', 'utf8');
  assert.doesNotMatch(login, /ADMIN_PASSWORD|du-admin-session|localStorage/);
  assert.match(login, /apiRequest<User>/);
  assert.match(login, /credentials are never stored|secure cookie|session uses a secure cookie/i);
});

test('match centre only lists future fixture as upcoming on 23 September 2026', async () => {
  const page = await readFile('app/match-centre/page.tsx', 'utf8');
  const fixtureBlock = page.slice(page.indexOf('const fixtures'), page.indexOf('const results'));
  assert.match(fixtureBlock, /27 SEP 2026/);
  assert.doesNotMatch(fixtureBlock, /06 SEP 2026|20 SEP 2026/);
});

test('mobile navigation and protected admin dashboard are present', async () => {
  const home = await readFile('app/page.tsx', 'utf8');
  const admin = await readFile('app/admin/page.tsx', 'utf8');
  assert.match(home, /Mobile navigation/);
  assert.match(home, /aria-expanded/);
  assert.match(admin, /Administrator access only/);
  assert.match(admin, /\/api\/v1\/admin\/overview/);
  assert.doesNotMatch(admin, /STATIC UI PREVIEW · SAMPLE DATA/);
});

test('homepage CTAs use exported routes and reduced-motion reveals content', async () => {
  const home = await readFile('app/page.tsx', 'utf8');
  const navigation = await readFile('app/navigation.css', 'utf8');
  for (const route of ['/match-centre', '/club-history', '/news', '/squad', '/shop', '/login']) {
    assert.match(home, new RegExp(`href=["']${route}["']`));
  }
  assert.match(home, /useReducedMotion/);
  assert.match(navigation, /prefers-reduced-motion:reduce/);
  assert.match(navigation, /opacity:1!important/);
});

test('mobile menu contains focus, supports Escape and hides background content', async () => {
  const home = await readFile('app/page.tsx', 'utf8');
  assert.match(home, /event\.key === 'Escape'/);
  assert.match(home, /aria-modal="true"/);
  assert.match(home, /inert=\{menuOpen/);
  assert.match(home, /last\.focus\(\)/);
});

test('local preview uses temporary memory data and never forwards database or admin secrets', async () => {
  const script = await readFile('scripts/dev-local.mjs', 'utf8');
  assert.match(script, /DATA_MODE: 'memory'/);
  assert.match(script, /randomBytes\(32\)/);
  assert.match(script, /DATABASE_URL: ''/);
  assert.match(script, /ADMIN_PASSWORD: ''/);
  assert.match(script, /NEXT_PUBLIC_API_URL: apiOrigin/);
  const { spawnSync } = await import('node:child_process');
  const invalid = spawnSync(process.execPath, ['scripts/dev-local.mjs'], { env: { ...process.env, LOCAL_API_PORT: '3000', LOCAL_WEB_PORT: '3000' }, encoding: 'utf8' });
  assert.notEqual(invalid.status, 0);
});
