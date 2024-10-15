/*
 * ----------- ROUTES -----------
 * This module contains all of the routes in the API and is used as an index by app.js
 */

const registerRouter = require("./registerRouter");
const userRouter = require("./userRouter");
const postRouter = require("./postRouter");
// const commentRouter = require("./commentRouter");

module.exports = (app) => {
  app.use("/register", registerRouter);
  app.use("/user", userRouter);
  app.use("/post", postRouter);
  // app.use("/", commentRouter);
};
