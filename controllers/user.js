const User = require("../modules/users.js");
const { createHmac } = require("crypto");
const { createTokenForUser } = require("../services/auth");

const renderSignin = async (req, res) => {
  res.render("signin", { user: req.user });
};

const renderSignup = async (req, res) => {
  res.render("signup", { user: req.user });
};

const PostSignin = async (req, res) => {
  const body = req.body;
  const user = await User.findOne({ email: body.email });

  if (!user) {
    return res.redirect("/user/signup");
  }

  const Password = createHmac("sha256", user.salt)
    .update(body.password)
    .digest("hex");

  if (Password !== user.password) {
    return res.send(`<h1>password incorrect</h1>`);
  }

  const token = createTokenForUser(user);
  res.cookie("uid", token);

  return res.redirect("/");
};

const PostSignup = async (req, res) => {
  const body = req.body;
  const existingUser = await User.findOne({ email: body.email });

  if (existingUser) {
    return res.redirect("/user/signin");
  }

  await User.create({
    name: body.name,
    email: body.email,
    password: body.password,
  });

  const user = await User.findOne({ email: body.email });

  const token = createTokenForUser(user);

  res.cookie("uid", token);
  return res.redirect("/");
};

const logout = async (req, res) => {
  res.clearCookie("uid");
  return res.redirect("/");
};

module.exports = {
  renderSignin,
  renderSignup,
  PostSignin,
  PostSignup,
  logout,
};
