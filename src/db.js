const dotenv = require("dotenv");
const pgPromise = require("pg-promise");

dotenv.config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

const db = pgPromise()(
  `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`
);

console.log(db);

db.connect()
  .then((obj) => {
    obj.done(); // success, release the connection
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

  const setupDb = async () => {
    await db.none("DROP TABLE IF EXISTS planets");
    await db.none(`
      CREATE TABLE planets(
        id SERIAL NOT NULL PRIMARY KEY,
        name TEXT NOT NULL,
        image TEXT
      )
    `);
  
    await db.none(`DROP TABLE IF EXISTS users`);
    await db.none(`
      CREATE TABLE users (
        id SERIAL NOT NULL PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        token TEXT
      )`);
  
    await db.none(`INSERT INTO planets (name) VALUES ('Earth')`);
    await db.none(`INSERT INTO planets (name) VALUES ('Mars')`);
    await db.none(`INSERT INTO planets (name) VALUES ('Juptier')`);
    await db.none(`INSERT INTO users (username, password) VALUES ('dummy', 'dummy')`);
  
    const planets = await db.many(`SELECT * FROM planets`);
  
    console.log(planets);
  };
  
  setupDb();
  
  module.exports = { db };