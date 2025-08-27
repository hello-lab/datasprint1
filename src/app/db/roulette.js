const Database =require( 'better-sqlite3');

const poker1 = new Database('roul.db', { verbose: console.log });

poker1.exec(`
  CREATE TABLE IF NOT EXISTS roul (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gameid TEXT,
    userId TEXT,
    betAmount INTEGER,
    bet TEXT,
    type TEXT
   
  )
`);




export default poker1;
