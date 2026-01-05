-- schema_otp.sql
CREATE TABLE IF NOT EXISTS otp_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    purpose TEXT NOT NULL
        CHECK (purpose IN ('email_verification', 'password_reset', 'login')),
    expires_at TEXT NOT NULL,
    used INTEGER DEFAULT 0
        CHECK (used IN (0,1)),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_otp_token ON otp_tokens(token);
CREATE INDEX IF NOT EXISTS idx_otp_user ON otp_tokens(user_id);
