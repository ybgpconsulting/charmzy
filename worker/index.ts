import { INITIAL_PRODUCTS } from '../src/data/initialData';
import { getPageSeo, getProductStructuredData } from '../src/utils/seo';

interface Env {
  DB: {
    prepare(query: string): {
      bind(...values: (string | number | null)[]): {
        first<T = Record<string, unknown>>(): Promise<T | null>;
        run(): Promise<unknown>;
      };
    };
  };
  ADMIN_BOOTSTRAP_PASSWORD?: string;
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

const ADMIN_EMAIL = 'shubhanshu@charmzy.in';
const SESSION_COOKIE = 'charmzy_admin_session';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const PASSWORD_ITERATIONS = 210_000;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/admin/')) {
      return applySecurityHeaders(await handleAdminRequest(request, env, url), url, true);
    }

    let response = await env.ASSETS.fetch(request);
    if (
      request.method !== 'GET' ||
      response.status !== 200 ||
      !response.headers.get('content-type')?.includes('text/html')
    ) {
      return applySecurityHeaders(response, url, false);
    }

    response = await addRouteSeo(response, url);
    return applySecurityHeaders(response, url, false);
  },
};

function applySecurityHeaders(response: Response, url: URL, isAdminApi: boolean): Response {
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), geolocation=(), microphone=(), payment=()');
  headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "media-src 'self' data: blob: https:",
    "connect-src 'self'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    'upgrade-insecure-requests',
  ].join('; '));

  if (url.protocol === 'https:' && url.hostname === 'charmzy.in') {
    headers.set('Strict-Transport-Security', 'max-age=31536000');
  }
  if (isAdminApi) headers.set('Cache-Control', 'no-store');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function addRouteSeo(response: Response, url: URL): Promise<Response> {
  const path = normalizePath(url.pathname);
  let product: (typeof INITIAL_PRODUCTS)[number] | undefined;

  if (path.startsWith('/products/')) {
    try {
      const slug = decodeURIComponent(path.slice('/products/'.length));
      product = INITIAL_PRODUCTS.find((item) => item.slug === slug);
    } catch {
      product = undefined;
    }
  }

  const seo = getPageSeo(path, product);
  let html = await response.text();
  html = html.replace(
    /<title data-seo="title">.*?<\/title>/i,
    `<title data-seo="title">${escapeHtml(seo.title)}</title>`,
  );
  html = replaceSeoContent(html, 'description', seo.description);
  html = replaceSeoContent(html, 'robots', seo.robots);
  html = replaceSeoContent(html, 'og-type', seo.type);
  html = replaceSeoContent(html, 'og-url', seo.canonical);
  html = replaceSeoContent(html, 'og-title', seo.title);
  html = replaceSeoContent(html, 'og-description', seo.description);
  html = replaceSeoContent(html, 'og-image', seo.image);
  html = replaceSeoContent(html, 'og-image-alt', product?.title || 'CHARMZY JEWELLERY aesthetic earrings and jhumkas');
  html = replaceSeoContent(html, 'twitter-title', seo.title);
  html = replaceSeoContent(html, 'twitter-description', seo.description);
  html = replaceSeoContent(html, 'twitter-image', seo.image);
  html = replaceSeoContent(html, 'twitter-image-alt', product?.title || 'CHARMZY JEWELLERY aesthetic earrings and jhumkas');
  html = html.replace(
    /(\bdata-seo="canonical"[^>]*\bhref=")[^"]*(")/i,
    `$1${escapeHtml(seo.canonical)}$2`,
  );

  if (product) {
    const productSchema = `<script type="application/ld+json">${JSON.stringify(getProductStructuredData(product)).replace(/</g, '\\u003c')}</script>`;
    html = html.replace('</head>', `${productSchema}</head>`);
  }

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.delete('content-encoding');
  headers.delete('etag');
  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function normalizePath(path: string): string {
  if (path === '/') return path;
  return path.replace(/\/+$/, '') || '/';
}

function replaceSeoContent(html: string, key: string, value: string): string {
  const escapedValue = escapeHtml(value);
  const marker = new RegExp(`(\\bdata-seo="${key}"[^>]*\\bcontent=")[^"]*(")`, 'i');
  return html.replace(marker, `$1${escapedValue}$2`);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function handleAdminRequest(request: Request, env: Env, url: URL): Promise<Response> {
  const { pathname } = url;

  if (pathname === '/api/admin/session' && request.method === 'GET') {
    const session = await getSession(request, env);
    return json({
      authenticated: Boolean(session),
      mustChangePassword: session?.mustChangePassword ?? false,
      email: session?.email ?? null,
    });
  }

  if (!['/api/admin/login', '/api/admin/password', '/api/admin/logout'].includes(pathname)) {
    return json({ error: 'Not found' }, 404);
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405, { Allow: 'POST' });
  }

  if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) {
    return json({ error: 'Content-Type must be application/json.' }, 415);
  }

  if (request.headers.get('Origin') !== url.origin) {
    return json({ error: 'Request origin was rejected' }, 403);
  }

  if (pathname === '/api/admin/login') {
    return login(request, env);
  }

  const session = await getSession(request, env);
  if (!session) {
    return clearSessionCookie(json({ error: 'Please sign in again' }, 401), url);
  }

  if (pathname === '/api/admin/logout') {
    const token = getCookie(request, SESSION_COOKIE);
    if (token) {
      await env.DB.prepare('DELETE FROM charmzy_storefront_admin_sessions WHERE token_hash = ?')
        .bind(await hashToken(token))
        .run();
    }
    return clearSessionCookie(json({ authenticated: false }), url);
  }

  if (pathname === '/api/admin/password') {
    if (!session.mustChangePassword) {
      return json({ error: 'Password change is not required' }, 400);
    }

    const body = await readJson(request);
    const password = typeof body?.password === 'string' ? body.password : '';
    if (!isValidPassword(password)) {
      return json({ error: 'Choose a password with at least 12 characters.' }, 400);
    }

    const salt = randomHex(16);
    const passwordHash = await hashPassword(password, salt);
    await env.DB.prepare(
      'UPDATE charmzy_storefront_admins SET password_hash = ?, password_salt = ?, must_change_password = 0, updated_at = ? WHERE id = ?'
    ).bind(passwordHash, salt, Date.now(), session.id).run();

    return json({ authenticated: true, mustChangePassword: false, email: session.email });
  }

  return json({ error: 'Not found' }, 404);
}

async function login(request: Request, env: Env): Promise<Response> {
  const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
  const now = Date.now();
  const attempts = await env.DB.prepare(
    'SELECT window_started_at, failed_count FROM charmzy_storefront_admin_login_attempts WHERE client_ip = ?'
  ).bind(clientIp).first<{ window_started_at: number; failed_count: number }>();

  if (attempts && now - attempts.window_started_at < LOGIN_WINDOW_MS && attempts.failed_count >= MAX_LOGIN_ATTEMPTS) {
    return json({ error: 'Too many sign-in attempts. Try again in 15 minutes.' }, 429);
  }

  const body = await readJson(request);
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  let admin = await env.DB.prepare(
    'SELECT id, email, password_hash, password_salt, must_change_password FROM charmzy_storefront_admins WHERE email = ?'
  ).bind(ADMIN_EMAIL).first<AdminRecord>();

  if (!admin) {
    if (!env.ADMIN_BOOTSTRAP_PASSWORD) {
      return json({ error: 'Admin account is not configured. Set ADMIN_BOOTSTRAP_PASSWORD and apply the admin migration.' }, 503);
    }
    const salt = randomHex(16);
    const passwordHash = await hashPassword(env.ADMIN_BOOTSTRAP_PASSWORD, salt);
    const id = randomHex(16);
    await env.DB.prepare(
      'INSERT OR IGNORE INTO charmzy_storefront_admins (id, email, password_hash, password_salt, must_change_password, created_at, updated_at) VALUES (?, ?, ?, ?, 1, ?, ?)'
    ).bind(id, ADMIN_EMAIL, passwordHash, salt, now, now).run();
    admin = await env.DB.prepare(
      'SELECT id, email, password_hash, password_salt, must_change_password FROM charmzy_storefront_admins WHERE email = ?'
    ).bind(ADMIN_EMAIL).first<AdminRecord>();
  }

  const passwordMatches = Boolean(
    admin &&
    email === ADMIN_EMAIL &&
    await verifyPassword(password, admin.password_salt, admin.password_hash)
  );

  if (!admin || !passwordMatches) {
    await recordFailedAttempt(env, clientIp, now, attempts);
    return json({ error: 'Email or password is incorrect.' }, 401);
  }

  await env.DB.prepare('DELETE FROM charmzy_storefront_admin_login_attempts WHERE client_ip = ?')
    .bind(clientIp)
    .run();
  await env.DB.prepare('DELETE FROM charmzy_storefront_admin_sessions WHERE expires_at <= ?')
    .bind(now)
    .run();

  const token = randomHex(32);
  const expiresAt = now + SESSION_DURATION_MS;
  await env.DB.prepare(
    'INSERT INTO charmzy_storefront_admin_sessions (token_hash, admin_id, expires_at, created_at) VALUES (?, ?, ?, ?)'
  ).bind(await hashToken(token), admin.id, expiresAt, now).run();

  const secure = isSecureRequest(request);
  return json(
    {
      authenticated: true,
      mustChangePassword: Boolean(admin.must_change_password),
      email: admin.email,
    },
    200,
    {
      'Set-Cookie': `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=${SESSION_DURATION_MS / 1000}${secure ? '; Secure' : ''}`,
    }
  );
}

async function getSession(request: Request, env: Env): Promise<AdminSession | null> {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) return null;

  const row = await env.DB.prepare(
    `SELECT a.id, a.email, a.must_change_password
     FROM charmzy_storefront_admin_sessions s
     JOIN charmzy_storefront_admins a ON a.id = s.admin_id
     WHERE s.token_hash = ? AND s.expires_at > ?`
  ).bind(await hashToken(token), Date.now()).first<AdminSessionRecord>();

  return row
    ? { id: row.id, email: row.email, mustChangePassword: Boolean(row.must_change_password) }
    : null;
}

async function recordFailedAttempt(
  env: Env,
  clientIp: string,
  now: number,
  current: { window_started_at: number; failed_count: number } | null,
): Promise<void> {
  const windowStartedAt = current && now - current.window_started_at < LOGIN_WINDOW_MS
    ? current.window_started_at
    : now;
  const failedCount = current && now - current.window_started_at < LOGIN_WINDOW_MS
    ? current.failed_count + 1
    : 1;
  await env.DB.prepare(
    `INSERT INTO charmzy_storefront_admin_login_attempts (client_ip, window_started_at, failed_count)
     VALUES (?, ?, ?)
     ON CONFLICT(client_ip) DO UPDATE SET window_started_at = excluded.window_started_at, failed_count = excluded.failed_count`
  ).bind(clientIp, windowStartedAt, failedCount).run();
}

interface AdminRecord {
  id: string;
  email: string;
  password_hash: string;
  password_salt: string;
  must_change_password: number;
}

interface AdminSessionRecord {
  id: string;
  email: string;
  must_change_password: number;
}

interface AdminSession {
  id: string;
  email: string;
  mustChangePassword: boolean;
}

function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'same-origin',
      ...headers,
    },
  });
}

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  const contentLength = Number(request.headers.get('Content-Length'));
  if (Number.isFinite(contentLength) && contentLength > 4096) return null;
  if (!request.body) return null;

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > 4096) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const value: unknown = JSON.parse(new TextDecoder().decode(bytes));
    return value && typeof value === 'object' && !Array.isArray(value)
      ? value as Record<string, unknown>
      : null;
  } catch {
    return null;
  }
}

function getCookie(request: Request, name: string): string | null {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return null;
  for (const part of cookie.split(';')) {
    const [key, ...value] = part.trim().split('=');
    if (key === name) return value.join('=') || null;
  }
  return null;
}

function clearSessionCookie(response: Response, requestUrl: URL): Response {
  const secure = requestUrl.protocol === 'https:' ? '; Secure' : '';
  const headers = new Headers(response.headers);
  headers.append('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=0${secure}`);
  return new Response(response.body, { status: response.status, headers });
}

function isSecureRequest(request: Request): boolean {
  return new URL(request.url).protocol === 'https:';
}

function isValidPassword(password: string): boolean {
  return password.length >= 12 && password.length <= 256;
}

function randomHex(byteLength: number): string {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return toHex(new Uint8Array(digest));
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: hexToBytes(salt), iterations: PASSWORD_ITERATIONS },
    key,
    256,
  );
  return toHex(new Uint8Array(bits));
}

async function verifyPassword(password: string, salt: string, expectedHash: string): Promise<boolean> {
  const actualHash = await hashPassword(password, salt);
  if (actualHash.length !== expectedHash.length) return false;
  let difference = 0;
  for (let index = 0; index < actualHash.length; index += 1) {
    difference |= actualHash.charCodeAt(index) ^ expectedHash.charCodeAt(index);
  }
  return difference === 0;
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}
