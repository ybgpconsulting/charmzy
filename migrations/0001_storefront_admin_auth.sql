CREATE TABLE IF NOT EXISTS charmzy_storefront_admins (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  must_change_password INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS charmzy_storefront_admin_sessions (
  token_hash TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL REFERENCES charmzy_storefront_admins(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_charmzy_storefront_admin_sessions_expiry
  ON charmzy_storefront_admin_sessions(expires_at);

CREATE TABLE IF NOT EXISTS charmzy_storefront_admin_login_attempts (
  client_ip TEXT PRIMARY KEY,
  window_started_at INTEGER NOT NULL,
  failed_count INTEGER NOT NULL
);
