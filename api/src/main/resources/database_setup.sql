CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    account_type TEXT NOT NULL CHECK(account_type IN ('student', 'professor', 'admin'))
);

CREATE TABLE labs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    capacity INTEGER NOT NULL,
    equipment TEXT,
    is_active BOOLEAN DEFAULT 1
);

CREATE TABLE reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    lab_id INTEGER NOT NULL,
    date TEXT NOT NULL,  
    start_time TEXT NOT NULL,  
    end_time TEXT NOT NULL,
    purpose TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'denied')),
    admin_notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE
);