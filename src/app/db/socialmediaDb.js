import Database from 'better-sqlite3';

const socialDb = new Database('social.db', { verbose: console.log });

socialDb.exec(`
  CREATE TABLE IF NOT EXISTS socials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    comments TEXT,
    likes TEXT DEFAULT '[]',
    user_name TEXT,
    content TEXT,
    image_url TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_name, date)
  )
`);

export default socialDb;