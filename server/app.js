const path = require("path");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const errorHandler = require("errorhandler");
const mongoose = require("mongoose");

mongoose.promise = global.Promise;

const isProduction = process.env.NODE_ENV === "production";

const app = express();

app.use(cors());
app.use(require("morgan")("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "LightBlog",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

if (!isProduction) app.use(errorHandler());

mongoose.connect(
  "mongodb://localhost/lightblog",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  () => {
    console.log("Mongo connected!");
  }
);
mongoose.set("debug", true);

require("./models/Articles");

app.use("/", require("./routes/api/articles"));

app.listen(8000, () => console.log("Server start on http://localhost:8000"));
