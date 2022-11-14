// require packages
const express = require("express");
const partials = require("express-partials");
const mongoose = require("mongoose");
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
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(partials());
app.set("view engine", "ejs");

// use middleware
//app.use(logger);

//use middleware in route
//app.get("/", logger, (req, res) => res.render("pages/overview"));

// define routes
const userRouter = require("./routes/users");
const modelRouter = require("./routes/models");

const modelModel = require("./schemas/modelSchema");

app.get("/", (req, res) => res.render("pages/overview"));
app.get("/login", (req, res) => res.render("pages/login"));
app.get("/test", async (req, res) => {
	try {
		const newModel = await modelModel.create({
			id: 2,
			title: "test",
			description: "test desc",
			type: "GPS",
			tags: ["tag1", "tag2", "tag3"],
			longitude: 4.33456,
			latitude: 34.53435,
		});
		const save = await newModel.save();
		console.log("new model");
		res.send("test");
	} catch (err) {
		console.log(err);
	}
});
app.use("/users", userRouter);
app.use("/models", modelRouter);

// middelware
function logger(req, res, next) {
	console.log(req.originalUrl);
	next();
}

// succes message
app.listen(port, () => console.log(`Listening to port: ${port}`));
