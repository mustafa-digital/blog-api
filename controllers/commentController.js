/**
 * -------------- commentController ----------------
 */
const { body, validationResult } = require("express-validator");
const prisma = require("../config/client");
const passport = require("passport");

/**
 * -------------- INPUT VALIDATION ----------------
 * Checking the inputs from the registration form for validation
 */

// Validation Constants
const MIN_CONTENT_LENGTH = 1;
const MAX_CONTENT_LENGTH = 255;
const lengthErrContent = `must be between ${MIN_CONTENT_LENGTH} and ${MAX_CONTENT_LENGTH} characters.`;

const commentValidation = [
  body("content")
    .trim()
    .isLength({ min: MIN_CONTENT_LENGTH, max: MAX_CONTENT_LENGTH })
    .withMessage(`Comment length ${lengthErrContent}`),
];

/**
 * -------------- POST COMMENT ----------------
 * Route: POST /post/:postId/comment
 * Controller function for posting a comment on a post
 */

const postCommentMiddleware = async (req, res, next) => {
  // Get form data and params
  const { content } = req.body;
  const postId = req.params.postId;
  const accountId = req.user.id;

  // Insert comment as a new entry in db
  const result = await prisma.comment.create({
    data: {
      content,
      post: {
        connect: {
          id: postId,
        },
      },
      profile: {
        connect: {
          accountId,
        },
      },
    },
  });

  res.locals.result = result;
  res.locals.successMessage = "Comment successfully created.";
  res.locals.status = 200;

  return next();
};

/**
 * -------------- DELETE COMMENT ----------------
 * Route: DELETE /post/:postId/comment/:commentId
 * Controller function for deleting a comment on a post
 */
const deleteCommentMiddleware = async (req, res, next) => {
  // Get comment ID from params
  const { commentId } = req.params;

  // delete the comment if it exists in db
  try {
    const result = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    res.locals.result = result;
    res.locals.successMessage = "Comment successfully deleted.";
    res.locals.status = 200;

    return next();
  } catch (error) {
    handleServerError(res, "Error: could not delete post.", error);
  }
};

/**
 * -------------- EDIT COMMENT ----------------
 * Route: PUT /post/:postId/comment/:commentId
 * Controller function for editing a comment on a post
 */
const editCommentMiddleware = async (req, res, next) => {
  // Get comment content from req.body and get id from params
  const { content } = req.body;
  const { commentId } = req.params;

  // Use prisma to update the database with new comment content
  try {
    const result = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content,
      },
    });

    res.locals.result = result;
    res.locals.successMessage = "Comment successfully updated.";
    res.locals.status = 200;

    return next();
  } catch (error) {
    handleServerError(res, "Error: could not edit post.", error);
  }
};

/**
 * -------------- GET COMMENTS ----------------
 * Route: GET /post/:postId/comment/
 * Controller function for getting comments on a post
 */
const getCommentsMiddleware = async (req, res, next) => {
  // Retrieve postId from req.params
  const { postId } = req.params;
  // Get comments from the db
  try {
    const result = await prisma.comment.findMany({
      where: {
        post: {
          id: postId,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.locals.result = result;
    res.locals.successMessage = "Comments successfully retrieved.";
    res.locals.status = 200;

    return next();
  } catch (error) {
    handleServerError(res, "Error: could not edit post.", error);
  }
};

function getValidationErrors(req, res, next) {
  // get validation errors, if there are any
  const validationErrors = validationResult(req);

  // The inputs were invalid, so errors exist
  if (!validationErrors.isEmpty()) {
    // send a 401 status with error message and errors array
    return res.status(401).json({
      message: "Error: invalid comment.",
      validationErrors,
    });
  }
  next();
}

function sendResponseMiddleware(req, res, next) {
  const { successMessage, result, status } = res.locals;

  if (result) {
    res.status(status).json({
      message: successMessage,
      result,
    });
  } else {
    throw new Error(errorMessage || "Operation failed.");
  }
}

// helper function for handling server and db errors
function handleServerError(res, message, error) {
  res.status(500).json({ message, error });
}

/**
 * -------------- controller ----------------
 * This object stores the middleware chain for every request
 */
const controller = {
  postComment: [
    passport.authenticate("jwt", { session: false }),
    commentValidation,
    getValidationErrors,
    postCommentMiddleware,
    sendResponseMiddleware,
  ],
  deleteComment: [
    passport.authenticate("jwt", { session: false }),
    deleteCommentMiddleware,
    sendResponseMiddleware,
  ],
  editComment: [
    passport.authenticate("jwt", { session: false }),
    commentValidation,
    getValidationErrors,
    editCommentMiddleware,
    sendResponseMiddleware,
  ],
  getComments: [
    passport.authenticate("jwt", { session: false }),
    getCommentsMiddleware,
    sendResponseMiddleware,
  ],
};

module.exports = controller;
