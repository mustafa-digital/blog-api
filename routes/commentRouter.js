/**
 * -------------- commentRouter ----------------
 */
const commentController = require("../controllers/commentController");
const commentRouter = require("express").Router({ mergeParams: true });

/**
 * -------------- MIDDLEWARE ----------------
 */

/**
 * -------------- POST ROUTES ----------------
 */
commentRouter.post("/add", commentController.postComment);

/**
 * -------------- DELETE ROUTES ----------------
 */
commentRouter.delete("/:commentId", commentController.deleteComment);

/**
 * -------------- PUT ROUTES ----------------
 */
commentRouter.put("/:commentId", commentController.editComment);

/**
 * -------------- GET ROUTES ----------------
 */
commentRouter.get("/", commentController.getComments);

module.exports = commentRouter;
