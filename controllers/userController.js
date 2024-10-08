/**
 * -------------- userController ----------------
 */
const prisma = require("../config/client");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const {
  validatePassword,
  genPasswordHash,
  issueJWT,
} = require("../lib/authUtils");

/**
 * -------------- INPUT VALIDATION ----------------
 * Checking the inputs from the registration form for validation
 */

// Validation Constants
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 30;
const MIN_PASSWORD_LENGTH = 6;
const lengthErrUsername = `must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters.`;
const lengthErrPassword = `Password must contain atleast ${MIN_PASSWORD_LENGTH} characters.`;

const accountValidation = [
  body("username")
    .trim()
    .isLength({ min: MIN_USERNAME_LENGTH, max: MAX_USERNAME_LENGTH })
    .withMessage(`Username ${lengthErrUsername}`)
    .isAlphanumeric()
    .withMessage("Username can only contain letters and numbers."),

  body("password")
    .trim()
    .isLength({ min: MIN_PASSWORD_LENGTH })
    .withMessage(lengthErrPassword),
  body("password-confirm")
    .trim()
    .custom((value, { req }) => {
      // check if the confirm password field is the same as the first password field, return true if so
      if (value === req.body.password) {
        return true;
      }
      // the password fields do not match, so return false
      return false;
    })
    .withMessage("Password fields must match."),
  body("email")
    .exists()
    .withMessage("Email address is required.")
    .isEmail()
    .withMessage("Must be a valid email."),
];

const userController = {
  getLogin: (req, res, next) => {
    // TODO
  },
  postLogin: async (req, res, next) => {
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
        return res
          .status(200)
          .json({ message: "Authentication passed.", token: jwt });
      } else {
        res.status(401).json({
          message:
            "The username or password you have entered is invalid. Please try again.",
        });
      }
    } catch (error) {
      // Maybe send this to the error handling middleware instead
      res
        .status(500)
        .json({ message: "Error: Could not validate login credentials." });
    }
  },
  postRegister: [
    accountValidation,
    async (req, res, next) => {
      // validate the user inputs with express-validator
      // check if the username and email are unique
      // if valid, query the database to create a new account and profile
      // if invalid, return error message to user

      // get validation errors, if there are any
      const errors = validationResult(req);

      // The inputs were invalid, so errors exist
      if (!errors.isEmpty()) {
        // send a 401 status with error message and errors array
        return res.status(401).json({
          message: "Error: Invalid login credentials.",
          errors,
        });
      }

      const { username, email, password } = req.body;
      // Check if the username or email have already been taken
      const taken = await prisma.account.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      // Either the username or email are already registered, so send a 401 status and appropriate error messages
      if (taken) {
        const messages = [];
        if (taken.username === username) {
          messages.push("This username is taken. Please choose another one.");
        }
        if (taken.email === email) {
          messages.push(
            "This email has already been registered. Please choose another email.",
          );
        }

        return res.status(401).json({ messages });
      }

      // Inputs are validated, so now we can create the account and insert it into the database

      // First, we need to salt and hash the password
      try {
        const hash = await genPasswordHash(password);

        console.log(hash);

        // Create the Account entry in the database
        const account = await prisma.account.create({
          data: {
            username,
            hash,
            email,
            // Create and include the associated profile entry as well
            profile: {
              create: {},
            },
          },
        });

        if (account) {
          res.status(200).json({
            message:
              "Account successfully registered. You can now login with your account details.",
          });
        }
      } catch (error) {
        res.status(500).json({
          message: "Could not create account. Please try again later.",
          errors: error,
        });
      }
    },
  ],
  getProtected: [
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
      res.status(200).json({
        success: true,
        msg: "You are successfully authenticated to this route!",
      });
    },
  ],
};

module.exports = userController;
