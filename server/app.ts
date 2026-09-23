import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type CookieOptions, type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import type { Store } from './store';
import type { PublicUser } from './types';

type AppOptions = {
  store: Store;
  jwtSecret: string;
  allowedOrigins: string[];
  secureCookies?: boolean;
};

type AuthRequest = Request & { user?: PublicUser };

const credentialsSchema = z.object({ email: z.string().email().max(254), password: z.string().min(8).max(128) });
const registerSchema = credentialsSchema.extend({ firstName: z.string().trim().min(1).max(80), lastName: z.string().trim().min(1).max(80) });
const contactSchema = z.object({ email: z.string().email().max(254) });

export function createApp({ store, jwtSecret, allowedOrigins, secureCookies = false }: AppOptions) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ credentials: true, origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Origin not allowed'));
  }}));
  app.use(express.json({ limit: '32kb' }));
  app.use(cookieParser());

  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false });
  const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false });
  const cookieOptions = { httpOnly: true, secure: secureCookies, sameSite: secureCookies ? 'none' as const : 'lax' as const, maxAge: 7 * 24 * 60 * 60 * 1000, path: '/' };

  const authenticate = async (request: AuthRequest, _response: Response, next: NextFunction) => {
    const token = request.cookies.du_session;
    if (!token) return next();
    try {
      const payload = jwt.verify(token, jwtSecret) as { sub: string };
      const user = await store.findUserById(payload.sub);
      if (user) request.user = publicUser(user);
    } catch { /* Invalid and expired sessions are anonymous. */ }
    next();
  };

  app.get('/health', (_request, response) => response.json({ status: 'ok', service: 'durban-united-api' }));
  app.get('/api/v1/fixtures', asyncHandler(async (_request, response) => response.json({ data: await store.listFixtures() })));
  app.get('/api/v1/products', asyncHandler(async (_request, response) => response.json({ data: await store.listProducts() })));
  app.get('/api/v1/players', asyncHandler(async (_request, response) => response.json({ data: await store.listPlayers() })));
  app.get('/api/v1/news', asyncHandler(async (_request, response) => response.json({ data: await store.listNews() })));

  app.post('/api/v1/contact/subscriptions', contactLimiter, asyncHandler(async (request, response) => {
    const input = contactSchema.parse(request.body);
    const subscription = await store.subscribe(input.email);
    response.status(201).json({ data: subscription, message: 'You are on the Durban United updates list.' });
  }));

  app.post('/api/v1/auth/register', authLimiter, asyncHandler(async (request, response) => {
    const input = registerSchema.parse(request.body);
    const passwordHash = await bcrypt.hash(input.password, 12);
    try {
      const user = await store.createUser({ email: input.email, passwordHash, firstName: input.firstName, lastName: input.lastName });
      setSession(response, user.id, jwtSecret, cookieOptions);
      response.status(201).json({ data: publicUser(user) });
    } catch (error) {
      if (error instanceof Error && error.message === 'EMAIL_EXISTS') return response.status(409).json(errorBody('EMAIL_EXISTS', 'An account already exists for that email.'));
      throw error;
    }
  }));

  app.post('/api/v1/auth/login', authLimiter, asyncHandler(async (request, response) => {
    const input = credentialsSchema.parse(request.body);
    const user = await store.findUserByEmail(input.email);
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) return response.status(401).json(errorBody('INVALID_CREDENTIALS', 'Email or password is incorrect.'));
    setSession(response, user.id, jwtSecret, cookieOptions);
    response.json({ data: publicUser(user) });
  }));

  app.post('/api/v1/auth/logout', (_request, response) => {
    response.clearCookie('du_session', { ...cookieOptions, maxAge: undefined });
    response.status(204).end();
  });
  app.get('/api/v1/auth/me', authenticate, (request: AuthRequest, response) => {
    if (!request.user) return response.status(401).json(errorBody('UNAUTHENTICATED', 'Sign in is required.'));
    response.json({ data: request.user });
  });

  app.use((_request, response) => response.status(404).json(errorBody('NOT_FOUND', 'Route not found.')));
  app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
    if (error instanceof z.ZodError) return response.status(400).json(errorBody('VALIDATION_ERROR', error.issues[0]?.message ?? 'Invalid request.'));
    console.error(error instanceof Error ? error.message : 'Unknown server error');
    response.status(500).json(errorBody('INTERNAL_ERROR', 'The service could not complete the request.'));
  });
  return app;
}

function setSession(response: Response, userId: string, secret: string, options: CookieOptions) {
  const token = jwt.sign({}, secret, { subject: userId, expiresIn: '7d', audience: 'durban-united-web', issuer: 'durban-united-api' });
  response.cookie('du_session', token, options);
}
function publicUser(user: PublicUser): PublicUser { return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }; }
function errorBody(code: string, message: string) { return { error: { code, message } }; }
function asyncHandler(handler: (request: Request, response: Response, next: NextFunction) => Promise<unknown>) {
  return (request: Request, response: Response, next: NextFunction) => { Promise.resolve(handler(request, response, next)).catch(next); };
}
