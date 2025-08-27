const Database =require( 'better-sqlite3');

const poker1 = new Database('poker1.db', { verbose: console.log });

poker1.exec(`
  CREATE TABLE IF NOT EXISTS poker1 (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gameid TEXT,
    userId TEXT,
    betAmount INTEGER,
    bet TEXT,
    type TEXT
   
  )
`);




module.exports={ poker1}