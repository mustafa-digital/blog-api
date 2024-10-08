/**
 * -------------- userRouter ----------------
 */
const userController = require("../controllers/userController");
const userRouter = require("express").Router();

/**
 * -------------- MIDDLEWARE ----------------
 */

/**
 * -------------- POST ROUTES ----------------
 */
userRouter.post("/login", userController.postLogin);

/**
 * -------------- GET ROUTES ----------------
 */
userRouter.get("/login", userController.getLogin);

module.exports = userRouter;
