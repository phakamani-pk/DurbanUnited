import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import bcrypt from 'bcryptjs';
import type { Server } from 'node:http';
import { createApp } from '../server/app';
import { MemoryStore } from '../server/store';

let server: Server;
let baseUrl = '';
before(async () => {
  const passwordHash = await bcrypt.hash('admin-password', 4);
  const app = createApp({ store: new MemoryStore([{ id: 'admin-1', email: 'admin@example.com', passwordHash, firstName: 'Club', lastName: 'Admin', role: 'admin' }]), jwtSecret: 'test-secret-that-is-long-enough-for-jwt', allowedOrigins: ['http://localhost:3000'] });
  await new Promise<void>((resolve, reject) => { server = app.listen(0, '127.0.0.1', error => error ? reject(error) : resolve()); });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Test server did not start');
  baseUrl = `http://127.0.0.1:${address.port}`;
});
after(async () => { await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())); });

test('health and public content routes respond', async () => {
  const health = await fetch(`${baseUrl}/health`);
  assert.equal(health.status, 200);
  const products = await fetch(`${baseUrl}/api/v1/products`).then(response => response.json());
  assert.equal(products.data.length, 3);
  assert.equal(products.data[0].priceCents, 89900);
});

test('register creates a session and me returns the user', async () => {
  const register = await fetch(`${baseUrl}/api/v1/auth/register`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'fan@example.com', password: 'strong-password', firstName: 'Durban', lastName: 'Fan' }) });
  assert.equal(register.status, 201);
  const cookie = register.headers.get('set-cookie');
  assert.ok(cookie?.includes('du_session='));
  const me = await fetch(`${baseUrl}/api/v1/auth/me`, { headers: { cookie: cookie!.split(';')[0] } });
  assert.equal(me.status, 200);
  assert.equal((await me.json()).data.email, 'fan@example.com');
});

test('login rejects invalid credentials without leaking details', async () => {
  const response = await fetch(`${baseUrl}/api/v1/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'fan@example.com', password: 'wrong-password' }) });
  assert.equal(response.status, 401);
  assert.equal((await response.json()).error.code, 'INVALID_CREDENTIALS');
});

test('contact subscriptions validate input and accept valid email', async () => {
  const invalid = await fetch(`${baseUrl}/api/v1/contact/subscriptions`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'not-an-email' }) });
  assert.equal(invalid.status, 400);
  const valid = await fetch(`${baseUrl}/api/v1/contact/subscriptions`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'supporter@example.com' }) });
  assert.equal(valid.status, 201);
});


test('fan sessions can access profile data but cannot access admin APIs', async () => {
  const login = await fetch(`${baseUrl}/api/v1/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'fan@example.com', password: 'strong-password' }) });
  const cookie = login.headers.get('set-cookie')!.split(';')[0];
  const orders = await fetch(`${baseUrl}/api/v1/me/orders`, { headers: { cookie } });
  assert.equal(orders.status, 200);
  const admin = await fetch(`${baseUrl}/api/v1/admin/overview`, { headers: { cookie } });
  assert.equal(admin.status, 403);
  assert.equal((await admin.json()).error.code, 'FORBIDDEN');
});

test('admin sessions access management APIs', async () => {
  const login = await fetch(`${baseUrl}/api/v1/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'admin@example.com', password: 'admin-password' }) });
  assert.equal(login.status, 200);
  assert.equal((await login.clone().json()).data.role, 'admin');
  const cookie = login.headers.get('set-cookie')!.split(';')[0];
  const overview = await fetch(`${baseUrl}/api/v1/admin/overview`, { headers: { cookie } });
  assert.equal(overview.status, 200);
  assert.equal((await overview.json()).data.userCount, 2);
});

test('anonymous requests cannot access private profile or admin APIs', async () => {
  const profile = await fetch(`${baseUrl}/api/v1/me/orders`);
  const admin = await fetch(`${baseUrl}/api/v1/admin/users`);
  assert.equal(profile.status, 401);
  assert.equal(admin.status, 401);
});

test('admin can manage every configured content resource', async () => {
  const login = await fetch(`${baseUrl}/api/v1/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'admin@example.com', password: 'admin-password' }) });
  const cookie = login.headers.get('set-cookie')!.split(';')[0];
  for (const resource of ['teams','players','news','fixtures','standings','products','gallery','sponsors']) {
    const response = await fetch(`${baseUrl}/api/v1/admin/resources/${resource}`, { headers: { cookie } });
    assert.equal(response.status, 200, resource);
  }
  const create = await fetch(`${baseUrl}/api/v1/admin/resources/sponsors`, { method: 'POST', headers: { cookie, 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Test Sponsor', logoUrl: 'https://example.com/logo.png', websiteUrl: 'https://example.com', tier: 'Official', sortOrder: 1, isActive: true }) });
  assert.equal(create.status, 201);
  assert.equal((await create.json()).data.name, 'Test Sponsor');
});
