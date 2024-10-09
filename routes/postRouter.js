/**
 * -------------- postRouter ----------------
 */
const postController = require("../controllers/postController");
const postRouter = require("express").Router();

/**
 * -------------- MIDDLEWARE ----------------
 */

/**
 * -------------- POST ROUTES ----------------
 */
postRouter.post("/create", postController.postCreate);

/**
 * -------------- PUT ROUTES ----------------
 */
// postRouter.put("/edit", postController.editPost)

/**
 * -------------- GET ROUTES ----------------
 */
postRouter.get("/", postController.getUserPosts);
postRouter.get("/all", postController.getAllPosts);

module.exports = postRouter;
