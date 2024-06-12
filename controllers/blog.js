const Blog = require("../modules/blogs.js");
const Comment = require("../modules/comments.js");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const blogForm = async (req, res) => {
  const user = req.user;
  if (!user) return res.redirect("/user/signin");
  return res.render("blogForm", { user: req.user });
};

const postBlog = async (req, res) => {
  const user = req.user;
  const body = req.body;

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  await Blog.create({
    createdBy: user._id,
    userName: user.name,
    coverImage: req.file.filename,
    title: body.title,
    body: body.body,
  });

  return res.redirect("/");
};

const blog = async (req, res) => {
  try {
    const user = req.user;
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate(
      "createdBy"
    );

    var blogOwner = false;

    if (user) {
      if (blog.createdBy._id == user._id) {
        blogOwner = true;
      }
    }

    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    res.render("blog", {
      user: req.user,
      blog: blog,
      comments: comments,
      blogOwner: blogOwner,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const postComment = async (req, res) => {
  const user = req.user;
  const body = req.body;

  if (!user) return res.redirect("/user/signin");

  try {
    await Comment.create({
      content: body.comment,
      createdBy: user._id,
      blogId: req.params.id,
    });
    return res.redirect(`/blog/${req.params.id}`);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

const deleteBlog = async (req, res) => {
  await db.blogs.deleteOne({ _id: req.params._id });
  return res.redirect("/");
};

module.exports = {
  blog,
  blogForm,
  postBlog: [upload.single("coverImage"), postBlog],
  postComment,
  deleteBlog,
};
