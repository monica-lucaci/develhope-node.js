const Joi = require("joi");
const pgPromise = require("pg-promise");
const dotenv = require("dotenv");

dotenv.config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

const db = pgPromise()(`postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`);

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
  db.none(`
    DROP TABLE IF EXISTS planets;


    CREATE TABLE planets (
        id SERIAL NOT NULL PRIMARY KEY,
        name TEXT NOT NULL
    );
    `);
  await db.none(`INSERT INTO planets (name) VALUES ('Earth')`);
  await db.none(`INSERT INTO planets (name) VALUES ('Mars')`);
};
setupDb();

const getAll = async (req, res) => {
  const planets = await db.many(`SELECT  * FROM planets`);
  res.status(200).json(planets);
};

const getOneById = async (req, res) => {
  const { id } = req.params;
  const planet = await db.oneOrNone(
    `SELECT  * FROM planets WHERE id=$1;`,
    Number(id)
  );

  res.status(200).json(planet);
};

const planetSchema = Joi.object({
  name: Joi.string().required(),
});

const create = async (req, res) => {
  const { name } = req.body;
  const newPlanet = { name };
  const validateNewPlanet = planetSchema.validate(newPlanet);

  if (validateNewPlanet.error) {
    return res
      .status(400)
      .json({ msg: validateNewPlanet.error.details[0].message });
  } else {
    await db.none(`INSERT INTO planets (name) VALUES ($1)`, name);
    res.status(201).json({ msg: "The planet was created" });
  }
};



const updateById = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    await db.none(`UPDATE planets SET name=$2 WHERE id=$1`, [id, name]);
    res.status(200).json({ msg: "The planet was updated" });
  } catch (error) {
    console.error("Error updating the planet:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};


const deleteById = async (req, res) => {
  const { id } = req.params;
  await db.none(`DELETE FROM planets WHERE id=$1`, Number(id));

  res.status(200).json({ msg: "The planet was deleted" });
};

module.exports = {
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
};
