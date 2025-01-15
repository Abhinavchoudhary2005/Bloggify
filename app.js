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
const methodOverride = require("method-override");

const PORT = process.env.PORT || 5000;

const app = express();

//Connection
mongoose
  .connect(
    "mongodb+srv://Abhinav:8xJMpwtFpVvdDrZz@bloggify-data.3vkx52b.mongodb.net/?retryWrites=true&w=majority&appName=Bloggify-data",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log("MongoDB Error...", err));

//MiddleWares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));
app.use(checkForAuthentication);
app.use(methodOverride("_method"));

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
