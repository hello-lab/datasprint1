import Database from 'better-sqlite3';

const stepDb = new Database('stats.db', { verbose: console.log });

stepDb.exec(`
  CREATE TABLE IF NOT EXISTS user_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT,
    user_name TEXT,
    steps INTEGER,
    date TEXT,
        team TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, date)
  )
`);

export default stepDb;