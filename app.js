require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const ejsMate = require("ejs-mate");
const home = require("./routes/home.js");
const user = require("./routes/user.js");
const blog = require("./routes/blog.js");
const { checkForAuthentication } = require("./middlewares/auth.js");
const { RestrictUserToLogin } = require("./middlewares/RestrictUser.js");

const PORT = process.env.PORT || 8000;

const app = express();

//Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log("MongoDB Error...", err));

//MiddleWares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));
app.use(checkForAuthentication);

//viewEngine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//routes
app.use("/", home);
app.use("/user", user);
app.use("/blog", blog);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});