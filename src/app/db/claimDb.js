const Database =require( 'better-sqlite3');

const db = new Database('claims.db', { verbose: console.log });

db.exec(`
  CREATE TABLE IF NOT EXISTS claims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT ,
    claim INTEGER DEFAULT 0,
    last_claimed DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
