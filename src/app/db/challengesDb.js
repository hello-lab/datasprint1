const Database =require( 'better-sqlite3');

const db = new Database('challenges.db', { verbose: console.log });

db.exec(`
  CREATE TABLE IF NOT EXISTS challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    type TEXT,
    name TEXT,
    steps INTEGER DEFAULT 0,
    squats INTEGER DEFAULT 0,
    pushups INTEGER DEFAULT 0,
    winbonus INTEGER DEFAULT 0,
    deadline TEXT,
    description TEXT,
    challenge_type TEXT DEFAULT 'individual',
    target_teams TEXT,
    status TEXT DEFAULT 'active',
    created_by TEXT DEFAULT 'system',
    difficulty TEXT DEFAULT 'medium',
    points INTEGER DEFAULT 100,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create table for challenge participation tracking
db.exec(`
  CREATE TABLE IF NOT EXISTS challenge_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    challenge_id INTEGER,
    user_name TEXT,
    team TEXT,
    current_progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (challenge_id) REFERENCES challenges (id)
  )
`);

// Create table for team engagement metrics
db.exec(`
  CREATE TABLE IF NOT EXISTS team_engagement (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team TEXT,
    date TEXT,
    active_members INTEGER DEFAULT 0,
    total_steps INTEGER DEFAULT 0,
    challenges_completed INTEGER DEFAULT 0,
    engagement_score REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;