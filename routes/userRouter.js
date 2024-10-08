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
userRouter.post("/register", userController.postRegister);

/**
 * -------------- GET ROUTES ----------------
 */
// userRouter.get("/login", userController.getLogin);
// userRouter.get("/register", userController.getRegister);
userRouter.get("/protected", userController.getProtected);

module.exports = userRouter;
