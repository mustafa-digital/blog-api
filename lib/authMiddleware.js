/**
 * -------------- AUTH MIDDLEWARE ----------------
 * This module contains custom middlewares related to authentication
 */
const jwt = require("jsonwebtoken");

function checkUser(req, res, next) {
  // Check the jwt and extract the user id from the payload if it exists

  // Get the token from cookies
  // const token = req.cookies.jwt;

  if (token) {
    // Get the id from token payload
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Could not verify JWT", error: err });
        // next(err);
      }
      console.log(decodedToken);
      // const accountId = jwt.
    });
  }
  next();
}

module.exports = {
  checkUser,
};
