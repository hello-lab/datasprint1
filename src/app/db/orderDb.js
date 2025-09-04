const Database =require( 'better-sqlite3');

const db = new Database('users.db', { verbose: console.log });

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    order TEXT DEFAULT 0,
    
  )
`);
module.exports={ db}