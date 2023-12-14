const { Request, Response } = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { db } = require("../db");

dotenv.config();

const logIn = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.one(`SELECT * FROM users WHERE username=$1`, username);

    if (user && user.password === password) {
      const payload = { id: user.id, username };

      const { SECRET_KEY = "" } = process.env;
      const token = jwt.sign(payload, SECRET_KEY);

      await db.none(`UPDATE users SET token=$2 WHERE id=$1`, [user.id, token]);

      res.status(200).json({ id: user.id, username, token });
    } else {
      res.status(400).json({ msg: "Username or password incorrect." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An error occurred during login." });
  }
};

const signUp = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.oneOrNone(`SELECT * FROM users WHERE username=$1`, username);

    if (user) {
      res.status(409).json({ msg: "Username already in use" });
    } else {
      const { id } = await db.one(
        `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`,
        [username, password]
      );

      res.status(201).json({ id, msg: "Signup successful. Now you can log in." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An error occurred during signup." });
  }
};

module.exports = { logIn, signUp };
