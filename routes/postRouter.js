/**
 * -------------- postRouter ----------------
 */
const postController = require("../controllers/postController");
const postRouter = require("express").Router();

/**
 * -------------- NESTED ROUTES ----------------
 */
// Nested route for comments
const commentRouter = require("./commentRouter");
postRouter.use("/:postId/comment", commentRouter);

/**
 * -------------- POST ROUTES ----------------
 */
postRouter.post("/", postController.postCreate);

/**
 * -------------- DELETE ROUTES ----------------
 */
postRouter.delete("/:postId", postController.postDelete);

/**
 * -------------- PUT ROUTES ----------------
 */
postRouter.put("/:postId", postController.postUpdate);

/**
 * -------------- GET ROUTES ----------------
 */
postRouter.get("/", postController.getUserPosts);
postRouter.get("/all", postController.getAllPosts);
postRouter.get("/:postId", postController.getPostsById);
postRouter.get("/author/:authorId", postController.getPostsByAuthor);

module.exports = postRouter;
