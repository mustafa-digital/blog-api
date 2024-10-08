/**
 * -------------- userController ----------------
 */
const prisma = require("./client");
const { validatePassword, issueJWT } = require("../lib/authUtils");

const userController = {
  getLogin: (req, res, next) => {
    // TODO
  },
  postLogin: async (req, res, next) => {
    // TODO
    // STEP 1: validate the login credentials

    // get the user credentials from req.body
    const { username, password } = req.body;

    // find the username in the database
    const user = await prisma.account.findFirst({
      where: {
        username: username,
      },
    });

    // If the username does not exist, give an error message
    if (!user) {
      res.status(401).json({
        message:
          "The username or password you have entered is invalid. Please try again.",
      });
    }

    // Username exists in Database, so now check the password using validatePassword util function
    try {
      const isValid = validatePassword(password, user.hash);

      // login is validated, so now we can issue a JWT to authenticate the user
      if (isValid) {
        const jwt = issueJWT(user);
      }
    } catch (error) {
      // Maybe send this to the error handling middleware instead
      res
        .status(500)
        .json({ message: "Error: Could not validate login credentials." });
    }

    // if valid: STEP 2 - issue JWT
    // if invalid: return error message
  },
};

module.exports = userController;
