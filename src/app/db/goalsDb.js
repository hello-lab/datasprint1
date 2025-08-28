import Database from 'better-sqlite3';

const goalsDb = new Database('goals.db', { verbose: console.log });

goalsDb.exec(`
  CREATE TABLE IF NOT EXISTS user_goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT,
    user_name TEXT,
    goal_type TEXT, -- 'daily_steps', 'weekly_steps', 'monthly_steps'
    target_value INTEGER,
    current_value INTEGER DEFAULT 0,
    start_date TEXT,
    end_date TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'completed', 'failed'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default goalsDb;