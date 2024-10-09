/**
 * -------------- BLOG API --------------
 * This program is a back-end API for a blog webapp
 * Two front-ends will be used: one for authors to create posts, and another for regular users to read posts and write comments
 */

/**
 * -------------- DEPENDENCIES --------------
 */
const express = require("express");
const prisma = require("./config/client");
const passport = require("passport");
/**
 * -------------- GENERAL SETUP ----------------
 */

// Create the Express application
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set static assets folder
app.use(express.static(__dirname + "/public"));

/**
 * -------------- PASSPORT INIT ----------------
 */
require("./config/passport");

app.use(passport.initialize());

app.get("/", (req, res) => res.send("Hello World!"));

// const { checkUser } = require("./lib/authMiddleware");
// app.use(checkUser);

/**
 * -------------- ROUTES ----------------
 * Assign all the routes from routes.js to app
 */
require("./routes/routes")(app);

/**
 * -------------- ERROR HANDLER ----------------
 */
// app.use((err, req, res, next) => {
// if (res.headersSent) {
//   return next(err);
// }
// return res.status(500).render("error", {
//   error: err,
// });
// });

/**
 * -------------- SERVER ----------------
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Starting server on port ${PORT}`)); // listen on port
