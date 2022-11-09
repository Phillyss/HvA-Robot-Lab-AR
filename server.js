// require packages
const express = require("express");
const partials = require("express-partials");
const bodyParser = require("body-parser");
require("dotenv").config();

// DB setup
const uri = process.env.URI;

const app = express();
const port = process.env.PORT || 3000;

// declare static folder and partials
app.use(express.static("public"));
app.use(partials());
app.use(bodyParser.urlencoded({ extended: true }));
