const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const modelModel = require("../schemas/modelSchema");
const counterModel = require("../schemas/counterSchema");

// runs before uploading a new model
let modelsCounter;
let newModelID;
router.use("/upload", async (req, res, next) => {
	try {
		if (req.method === "POST") {
			// get current models count
			const counter = await counterModel.findOne({ name: "models" });
			modelsCounter = counter;
			newModelID = modelsCounter.count + 1;

			// create new folder for model
			const newDir = await fs.promises.mkdir(
				`./appFiles/gltfModels/${newModelID}`,
				{ recursive: false },
				err => {
					if (err) {
						if (err.code == "EEXIST") {
							console.log("Dir already exists");
							return;
						}
					} else {
						console.log("Dir created");
					}
				}
			);

			// increase model count
			const udpate = await counter.updateOne({ $inc: { count: 1 } });
		}
		next();
	} catch (err) {
		console.log(err);
		next();
	}
});

// setup multer: file upload
const fileStorageEgnine = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, `./appFiles/gltfModels/${newModelID}`);
	},
	filename: (req, file, cb) => {
		cb(null, "thumbnail.jpg");
	},
});

const upload = multer({ storage: fileStorageEgnine });

// --- ROUTES ---

// /models: overview page
router.get("/", (req, res) => {
	res.redirect("/");
});

// /models/upload: upload page
router.get("/upload", (req, res) => {
	res.render("pages/upload");
});

// upload new model to db
router.post(
	"/upload",
	upload.fields([
		{ name: "thumbnail", maxCount: 1 },
		{ name: "model", maxCount: 1 },
	]),
	async (req, res) => {
		try {
			// put tags in array
			const tagsArray = req.body.tags.split(", ");
			let long = 0;
			let lat = 0;

			// set longitude and latitude if values are provided
			if (req.body.longitude !== "") long = Number(req.body.longitude);
			if (req.body.latitude !== "") lat = Number(req.body.latitude);

			// upload model info to db
			const newModel = await modelModel.create({
				modelid: newModelID,
				userid: 2,
				name: req.body.name,
				description: req.body.description,
				type: req.body.type,
				tags: tagsArray,
				longitude: long,
				latitude: lat,
			});
			const save = await newModel.save();
			res.redirect("/");
		} catch (err) {
			console.log(err);
		}
	}
);

router
	.route("/:id/edit")
	.get((req, res) => {
		res.render("pages/edit");
	})
	.put((req, res) => {
		res.send(`update ${req.params.id}`);
	})
	.delete((req, res) => {
		res.send(`delete ${req.params.id}`);
	});

// run before router
// router.param("id", (req, res, next, id) => {
// 	console.log(id);
// 	next();
// });

module.exports = router;
