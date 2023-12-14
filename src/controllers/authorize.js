const passport = require("passport");

const authorize = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    try {
      if (!user || err) {
        res.status(401).json({ msg: "Unauthorized" });
      } else {
        req.user = user;
        next();
      }
    } catch (error) {
      res.status(500).json({ msg: "Server Error", error });
    }
  })(req, res, next);
};

module.exports = authorize;
