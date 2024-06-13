const express = require("express");

const {
  blogForm,
  postBlog,
  blog,
  postComment,
  deleteBlog,
} = require("../controllers/blog");

const router = express.Router();

router.route("/").get(blogForm).post(postBlog);
router.route("/:id").get(blog).delete(deleteBlog);
router.route("/:id/comments").post(postComment);

module.exports = router;
