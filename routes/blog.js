const express = require("express");

const {
  blogForm,
  postBlog,
  blog,
  postComment,
  deleteBlog,
} = require("../controllers/blog");

const router = express.Router();

router.route("/").get(blogForm).post(postBlog).delete(deleteBlog);
router.route("/:id").get(blog).post(postComment);

module.exports = router;
