const Blog = require("../modules/blogs.js");

const renderHome = async (req, res) => {
  const blogs = await Blog.find({});
  return res.render("home", { user: req.user, blogs: blogs });
};

module.exports = {
  renderHome,
};
