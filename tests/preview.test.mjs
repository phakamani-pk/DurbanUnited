import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('preview contains no embedded admin password or fake authenticated session', async () => {
  const login = await readFile('app/login/page.tsx', 'utf8');
  assert.doesNotMatch(login, /ADMIN_PASSWORD|du-admin-session|localStorage/);
  assert.match(login, /No details were submitted or stored/);
});

test('match centre only lists future fixture as upcoming on 23 September 2026', async () => {
  const page = await readFile('app/match-centre/page.tsx', 'utf8');
  const fixtureBlock = page.slice(page.indexOf('const fixtures'), page.indexOf('const results'));
  assert.match(fixtureBlock, /27 SEP 2026/);
  assert.doesNotMatch(fixtureBlock, /06 SEP 2026|20 SEP 2026/);
});

test('mobile navigation and honest static preview notices are present', async () => {
  const home = await readFile('app/page.tsx', 'utf8');
  const admin = await readFile('app/admin/page.tsx', 'utf8');
  assert.match(home, /Mobile navigation/);
  assert.match(home, /aria-expanded/);
  assert.match(admin, /STATIC UI PREVIEW · SAMPLE DATA/);
});
