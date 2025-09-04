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
    deadline TEXT
  )
`);

export default db;