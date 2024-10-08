/**
 * -------------- registerRouter ----------------
 */
const registerController = require("../controllers/registerController");
const registerRouter = require("express").Router();

/**
 * -------------- MIDDLEWARE ----------------
 */

/**
 * -------------- POST ROUTES ----------------
 */
registerRouter.post("/", registerController.post);

/**
 * -------------- GET ROUTES ----------------
 */
registerController.get("/", registerController.get);

module.exports = registerRouter;
