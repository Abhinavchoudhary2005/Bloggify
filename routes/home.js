const express = require("express");
const { renderHome } = require("../controllers/home");

const router = express.Router();

router.route("/").get(renderHome);

module.exports = router;
