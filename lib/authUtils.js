/**
 * -------------- AUTH UTILS ----------------
 * This module exports utility functions for authentication including methods to issue a jwt, validate a password, and generate a password hash
 */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * -------------- GENPASSWORDHASH ----------------
 * This method takes a password string and salts and hashes it using bcrypt
 * If successful, returns the hash
 * @param {String} password - plain text password
 * @returns {String} hashedPassword
 */
async function genPasswordHash(password) {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * -------------- VALIDATEPASSWORD ----------------
 * This method takes a password string and a hash from the db and uses bcrypt to hash the password and compare
 * If both hashes are equal, returns true, else false
 * @param {String} password - plain text password
 * @param {String} hash - hashed password to validate with
 * @returns {Boolean} result
 */
async function validatePassword(password, hash) {
  const result = await bcrypt.compare(password, hash);
  return result;
}

/**
 * -------------- ISSUEJWT ----------------
 * This method issues a jwt for when the user successfully signs in
 * @param {Object} user - user object which includes account id
 * @returns {Object} token - the signed jwt token
 */
function issueJWT(user) {
  const userId = user.id;
  const payload = { sub: userId, iat: Date.now() };
  const secret = process.env.JWT_SECRET;
  const opts = {};
  opts.expiresIn = "1d";
  const token = jwt.sign(payload, secret, opts);
  return token;
}

module.exports = {
  validatePassword,
  genPasswordHash,
  issueJWT,
};
