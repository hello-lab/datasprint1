const Database =require( 'better-sqlite3');

const db = new Database('orders1.db', { verbose: console.log });



db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orders TEXT,
    username TEXT 
  )
`);

export default db;