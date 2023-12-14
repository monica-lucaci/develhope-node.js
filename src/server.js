const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv");
const morgan = require("morgan");
const Joi = require("joi");
const passport = require("./controllers/passport");
const passportJWT = require("passport-jwt");
const { logIn, signUp, logOut } = require("./controllers/users");
const authorize = require("./controllers/authorize.js");

const {
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
  createImage,
} = require("./controllers/planets");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(morgan("dev"));

// GET ALL PLANETS
app.get("/api/planets", getAll);

// GET A SPECIFIC PLANET ID
app.get("/api/planets/:id", getOneById);

// CREATE A NEW PLANET
app.post("/api/planets", create);

// UPDATE A PLANET BY ID
app.put("/api/planets/:id", updateById);

// DELETE A PLANET BY ID
app.delete("/api/planets/:id", deleteById);

// ADD IMAGE
app.post("/api/planets/:id/image", upload.single("image"), createImage);

// LOGIN
app.post("/api/users/login", logIn);

// SIGN UP
app.post("/api/users/signup", signUp);

// LOGOUT
app.get("/api/users/logout", authorize, logOut);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
