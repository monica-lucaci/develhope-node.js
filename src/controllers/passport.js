const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
const passportJWT = require("passport-jwt");
const { db } = require("../db");

const { SECRET_KEY } = process.env;

passport.use(
  new passportJWT.Strategy(
    {
      secretOrKey: SECRET_KEY,
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      const user = await db.one(`SELECT * FROM users WHERE id=$1`, payload.id);
      console.log(user);

      try {
        return user ? done(null, user) : done(new Error("User not found"));
      } catch (error) {
        done(error);
      }
    }
  )
);
