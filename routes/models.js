const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const modelModel = require("../schemas/modelSchema");
const counterModel = require("../schemas/counterSchema");
const userModel = require("../schemas/userSchema");

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
		const extArr = file.originalname.split(".");
		const ext = extArr[extArr.length - 1];
		cb(null, `${file.fieldname}.${ext}`);
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

			// get current date
			const now = new Date();
			const date = `${now.getDate()}/${
				now.getMonth() + 1
			}/${now.getFullYear()}`;

			// set thumbnail file path
			let thumbnailFilename;
			const directory = await fs.promises.readdir(
				`./appFiles/gltfModels/${newModelID}`
			);
			thumbnailFilename = directory[1];

			// upload model info to db
			const newModel = await modelModel.create({
				modelid: newModelID,
				userid: req.session.user.id,
				username: req.session.user.name,
				date: date,
				name: req.body.name,
				thumbnail: thumbnailFilename,
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

router.get("/:id", async (req, res) => {
	const model = await modelModel.findOne({ modelid: req.params.id });
	if (model) {
		const creator = await userModel.findOne({ id: model.userid });
		if (!creator) {
			console.log(
				`model id:${model.modelid} exists without its user id:${model.userid} in database. please delete the model from the database.`
			);
			res.redirect("/");
		}
		res.render("pages/detail", { model: model, creator: creator });
	} else {
		res.redirect("/");
	}
});

module.exports = router;
