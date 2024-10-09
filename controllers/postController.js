/**
 * -------------- postController ----------------
 */
const prisma = require("../config/client");
const passport = require("passport");

const postController = {
  // Maybe this will need admin authorization
  getAllPosts: [
    passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {
      // Query database for all the posts
      const posts = await prisma.post.findMany({
        include: {
          profile: true,
        },
      });

      if (posts) {
        res
          .status(200)
          .json({ message: "Posts successfully found.", posts: posts });
      } else {
        res.status(500).json({ message: "Error: could not find posts." });
      }
    },
  ],
  getUserPosts: [
    passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {
      // Query the database for all posts authored by current user
      const posts = await prisma.post.findMany({
        where: {
          accountId_Ref: req.user.id,
        },
      });

      if (posts) {
        res
          .status(200)
          .json({ message: "Posts successfully found.", posts: posts });
      } else {
        res.status(500).json({ message: "Error: could not find posts." });
      }
    },
  ],
  postCreate: [
    passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {
      // Get post creation form data from req.body
      const { title, content } = req.body;
      const accountId = req.user.id;

      // Now that we have the form data, we can create the post in the database
      const post = await prisma.post.create({
        data: {
          title,
          content,
          profile: {
            connect: {
              accountId,
            },
          },
        },
      });
      if (post) {
        res
          .status(200)
          .json({ message: "Post successfully created.", post: post });
      } else {
        res.status(500).json({ message: "Error: could not create post." });
      }
    },
  ],
};

module.exports = postController;