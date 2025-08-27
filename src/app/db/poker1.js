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

poker1.exec(`
  CREATE TABLE IF NOT EXISTS poker2 (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gameid TEXT,
    userId TEXT,
    betAmount INTEGER,
    bet TEXT,
    type TEXT
   
  )
`);


poker1.exec(`
  CREATE TABLE IF NOT EXISTS poker3 (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gameid TEXT,
    userId TEXT,
    betAmount INTEGER,
    bet TEXT,
    type TEXT
   
  )
`);

poker1.exec(`
  CREATE TABLE IF NOT EXISTS poker4 (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gameid TEXT,
    userId TEXT,
    betAmount INTEGER,
    bet TEXT,
    type TEXT
   
  )
`);

poker1.exec(`
  CREATE TABLE IF NOT EXISTS poker5 (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gameid TEXT,
    userId TEXT,
    betAmount INTEGER,
    bet TEXT,
    type TEXT
   
  )
`);


export default poker1;
