/*
 * ----------- ROUTES -----------
 * This module contains all of the routes in the API and is used as an index by app.js
 */

const express = require("express");
const registerRouter = require("./registerRouter");
const userRouter = require("./userRouter");

module.exports = (app) => {
  app.use("/register", registerRouter);
  app.use("/user", userRouter);
};
