// require packages
const express = require("express");
const partials = require("express-partials");
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

// init express
const app = express();
const port = process.env.PORT || 3000;

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
const modelRouter = require("./routes/models2");

app.get("/", (req, res) => overviewRoute(req, res));
app.get("/login", (req, res) => res.render("pages/login"));
app.use("/users", userRouter);
app.use("/models", modelRouter);
app.get("/test", (req, res) => {
	fs.mkdir("./appFiles/gltfModels/6", { recursive: false }, err => {
		if (err) {
			if (err.code == "EEXIST") {
				console.log("Dir already exists");
				return;
			}
		} else {
			console.log("Dir created");
		}
	});
	res.send("test dir");
});

app.use((req, res, next) => res.status(404).send("Page not found"));

// succes message
app.listen(port, () => console.log(`Listening to port: ${port}`));
