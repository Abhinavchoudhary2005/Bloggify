const express = require("express");
const {
  renderSignin,
  renderSignup,
  PostSignin,
  PostSignup,
  logout,
} = require("../controllers/user");

const router = express.Router();

router.route("/Signin").get(renderSignin).post(PostSignin);
router.route("/Signup").get(renderSignup).post(PostSignup);
router.route("/logout").get(logout);

module.exports = router;
