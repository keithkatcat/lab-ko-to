CREATE TABLE IF NOT EXISTS users
(
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    username       TEXT NOT NULL UNIQUE,
    email          TEXT NOT NULL UNIQUE,
    password       TEXT NOT NULL,
    account_type   TEXT NOT NULL CHECK (account_type IN ('student', 'professor', 'admin')),
    email_verified INTEGER DEFAULT 0 CHECK (email_verified IN (0, 1))
);

CREATE TABLE IF NOT EXISTS labs
(
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT    NOT NULL UNIQUE,
    capacity  INTEGER NOT NULL CHECK (capacity > 0),
    equipment TEXT,
    is_active INTEGER DEFAULT 1 CHECK (is_active IN (0, 1))
);

CREATE TABLE IF NOT EXISTS reservations
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    lab_id      INTEGER NOT NULL,
    date        TEXT    NOT NULL,
    start_time  TEXT    NOT NULL,
    end_time    TEXT    NOT NULL,
    purpose     TEXT    NOT NULL,
    program     TEXT,
    section     TEXT,
    status      TEXT    NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    admin_notes TEXT,
    created_at  TEXT             DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (lab_id) REFERENCES labs (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS otp_tokens
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL,
    token      TEXT    NOT NULL UNIQUE,
    purpose    TEXT    NOT NULL CHECK (purpose IN ('email_verification', 'password_reset', 'login')),
    expires_at TEXT    NOT NULL,
    used       INTEGER DEFAULT 0 CHECK (used IN (0, 1)),
    created_at TEXT    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reports
(
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id        INTEGER NOT NULL,
    report         TEXT    NOT NULL,
    status         TEXT    NOT NULL DEFAULT 'pending' CHECK ( status IN ('pending', 'in_progress', 'resolved', 'closed')),
    admin_response TEXT,
    created_at     TEXT             DEFAULT CURRENT_TIMESTAMP,
    updated_at     TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_report_user ON reports (user_id);
CREATE INDEX IF NOT EXISTS idx_report_status ON reports (status);
CREATE INDEX IF NOT EXISTS idx_otp_token ON otp_tokens (token);
CREATE INDEX IF NOT EXISTS idx_otp_user ON otp_tokens (user_id);