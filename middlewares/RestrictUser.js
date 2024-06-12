const { verifyTokenForUser } = require("../services/auth");

async function RestrictUserToLogin(req, res, next) {
  const token = req.cookies?.uid;

  if (!token) return res.redirect("/user/signin");

  try {
    const user = verifyTokenForUser(token);

    if (!user) return res.redirect("/user/signin");

    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
}

module.exports = {
  RestrictUserToLogin,
};
