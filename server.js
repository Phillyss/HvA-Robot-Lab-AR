// require packages
const express = require("express");
const partials = require("express-partials");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

// DB setup
const uri = process.env.URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("db connected!");
});

const app = express();
const port = process.env.PORT || 3000;

// declare static folder and partials
app.use(express.static("public"));
app.use(partials());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/test", async (req, res) => {
  const user = await userModel.create();
  const save = await user.save();
  res.send("test");
});

//const userModel = require("./schemas/userSchema");

async function dbTest() {
  const user = await userModel.create();
  console.log(user);
  //const save = await user.save();
}

//dbTest();
