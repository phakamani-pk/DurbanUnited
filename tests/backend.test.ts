import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import type { Server } from 'node:http';
import { createApp } from '../server/app';
import { MemoryStore } from '../server/store';

let server: Server;
let baseUrl = '';
before(async () => {
  const app = createApp({ store: new MemoryStore(), jwtSecret: 'test-secret-that-is-long-enough-for-jwt', allowedOrigins: ['http://localhost:3000'] });
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
