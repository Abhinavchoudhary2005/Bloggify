const { verifyTokenForUser } = require("../services/auth");

async function checkForAuthentication(req, res, next) {
  const token = req.cookies?.uid;

  if (!token) return next();

  try {
    const user = verifyTokenForUser(token);

    if (!user) return next();

    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
}

module.exports = {
  checkForAuthentication,
};
