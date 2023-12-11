const express = require("express");
require("express-async-errors");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config();

const planets = [
  {
    id: 1,
    name: "Earth",
  },
  {
    id: 2,
    name: "Mars",
  },
];

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(morgan("dev"));

app.get("/planets", (req, res) => {
  res.json(planets);
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
