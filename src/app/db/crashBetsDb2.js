const Database =require( 'better-sqlite3');

const crashBetsDb = new Database('crashBets.db', { verbose: console.log });

crashBetsDb.exec(`
  CREATE TABLE IF NOT EXISTS crashBets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    betAmount INTEGER,
    gameid INTEGER
   
  )
`);

crashBetsDb.exec(`
  CREATE TABLE IF NOT EXISTS crashCashouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    gameid INTEGER,
    date TEXT
  
  )
`);

module.exports={ crashBetsDb}
