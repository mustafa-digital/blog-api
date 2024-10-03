/**
 * -------------- BLOG API --------------
 * This program is a back-end API for a blog webapp
 * Two front-ends will be used: one for authors to create posts, and another for regular users to read posts and write comments
 */

/**
 * -------------- DEPENDENCIES --------------
 */
const express = require("express");

/**
 * -------------- GENERAL SETUP ----------------
 */

// Create the Express application
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set static assets folder
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => res.send("Hello World!"));
/**
 * -------------- SERVER ----------------
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Starting server on port ${PORT}`)); // listen on port
