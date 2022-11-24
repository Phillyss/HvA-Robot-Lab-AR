// require packages
const express = require("express");
const partials = require("express-partials");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
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

const store = new MongoDBSession({
	uri: uri,
	collection: "sessions",
});

// init express
const app = express();
const port = process.env.PORT || 3000;

// setup sessions
const secret = process.env.SECRET; // A9Mq1EHM98vGZbk4h8eRzEwZYO5dhlwH
app.use(
	session({
		secret: secret,
		cookie: { maxAge: 2592000000 },
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);

// middleware to force login on certain pages
const authenticated = (req, res, next) => {
	if (req.session.authenticated) {
		next();
	} else {
		res.redirect("/users/login");
	}
};

// setup express
app.use(cors());
app.use(express.static("public"));
app.use(express.static("appFiles"));
app.use(express.urlencoded({ extended: true }));
app.use(partials());
app.set("view engine", "ejs");

// define routes
const overviewRoute = require("./routes/overviewRoute");
const userRouter = require("./routes/users");
const modelRouter = require("./routes/models");

app.get("/", authenticated, (req, res) => overviewRoute(req, res));
app.use("/users", userRouter);
app.use("/models", authenticated, modelRouter);

// redirects
app.get("/login", (req, res) => res.redirect("users/login"));
app.get("/signup", (req, res) => res.redirect("users/signup"));

app.use((req, res, next) => res.status(404).send("Page not found"));

// succes message
app.listen(port, () => console.log(`Listening to port: ${port}`));
