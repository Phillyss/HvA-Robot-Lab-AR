const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const modelModel = require("../schemas/modelSchema");
const counterModel = require("../schemas/counterSchema");
const userModel = require("../schemas/userSchema");
const qrcode = require("qrcode");
const { workerData } = require("worker_threads");

// --- FILE UPLOAD ---

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

// Edit model: multer
//let modelsCounter;
let editModelID;
router.use("/:id/edit", async (req, res, next) => {
	try {
		if (req.method === "POST") {
			// get model id
			editModelID = req.params.id;
			// console.log(req.files);

			// // delete old thumbnail if new one exists
			// if (req.files) {
			// 	const newThumbnail = req.files.filter(file => {
			// 		return file.name.includes("thumbnail");
			// 	});

			// 	console.log(newThumbnail);
			// }
			// console.log("test");

			// const modelDir = fs.promises.readdir(`./appFiles/gltfModel/${editModelID}`, (err, files) => {
			// 	if (err) {
			// 		console.log('Unable to scan directory: ' + err);
			// 	} else {

			// 	}

			// });

			// let modeDir = await fs.promises.mkdir(
			// 	`./appFiles/gltfModels/${newModelID}`,
			// 	{ recursive: false },
			// 	err => {
			// 		if (err) {
			// 			if (err.code == "EEXIST") {
			// 				console.log("Dir already exists");
			// 				return;
			// 			}
			// 		} else {
			// 			console.log("Dir created");
			// 		}
			// 	}
			// );
		}
		next();
	} catch (err) {
		console.log(err);
		next();
	}
});

// setup multer: file upload
const editFSE = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, `./appFiles/gltfModels/${editModelID}`);
	},
	filename: (req, file, cb) => {
		const extArr = file.originalname.split(".");
		const ext = extArr[extArr.length - 1];
		cb(null, `${file.fieldname}.${ext}`);
	},
});

const edit = multer({ storage: editFSE });

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
			let long = null;
			let lat = null;

			// set longitude and latitude if values are provided
			if (req.body.longitude !== "") long = Number(req.body.longitude);
			if (req.body.latitude !== "") lat = Number(req.body.latitude);

			// get current date
			const now = new Date();
			const date = `${now.getDate()} / ${
				now.getMonth() + 1
			} / ${now.getFullYear()}`;

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
			res.redirect(`/models/${newModelID}`);
		} catch (err) {
			console.log(err);
		}
	}
);

// edit model page
router.get("/:id/edit", async (req, res) => {
	const model = await modelModel.findOne({ modelid: req.params.id });

	// if model exists and user is creator > render edit page
	if (model) {
		if (req.session.user.id === model.userid) {
			// get tags
			let tagsString = "";
			for (let i = 0; i < model.tags.length; i++) {
				if (i === 0) {
					tagsString = model.tags[i];
				} else {
					tagsString += `, ${model.tags[i]}`;
				}
			}

			res.render("pages/edit", { model: model, tagsString: tagsString });
		} else {
			res.redirect(`/models/${req.params.id}`);
		}
	} else {
		res.redirect("back");
	}
});

// edit new model in db
router.post(
	"/:id/edit",
	edit.fields([
		{ name: "thumbnail", maxCount: 1 },
		{ name: "model", maxCount: 1 },
	]),
	async (req, res) => {
		try {
			// put tags in array
			const tagsArray = req.body.tags.split(", ");
			let long = null;
			let lat = null;

			// set longitude and latitude if values are provided
			if (req.body.longitude !== "") long = Number(req.body.longitude);
			if (req.body.latitude !== "") lat = Number(req.body.latitude);

			// set thumbnail file path
			let thumbnailFilename;
			const directory = await fs.promises.readdir(
				`./appFiles/gltfModels/${editModelID}`
			);
			thumbnailFilename = directory[1];

			// edit model info in db
			const editModel = await modelModel.updateOne(
				{ modelid: editModelID },
				{
					$set: {
						name: req.body.name,
						thumbnail: thumbnailFilename,
						description: req.body.description,
						type: req.body.type,
						tags: tagsArray,
						longitude: long,
						latitude: lat,
					},
				}
			);
			res.redirect(`/models/${editModelID}`);
		} catch (err) {
			console.log(err);
		}
	}
);

// render AR page
router.get("/:id/ar", async (req, res) => {
	const model = await modelModel.findOne({ modelid: req.params.id });
	if (model) {
		if (model.type === "marker") {
			res.render("pages/ARMarker", { model });
		} else {
			res.render("pages/arGPS", { model });
		}
	} else {
		res.redirect("/");
	}
});

// render model detail page
router.get("/:id", async (req, res) => {
	const model = await modelModel.findOne({ modelid: req.params.id });
	// check if model and user exist
	if (model) {
		const creator = await userModel.findOne({ id: model.userid });
		if (!creator) {
			console.log(
				`model id:${model.modelid} exists without its user id:${model.userid} in database. please delete the model from the database.`
			);
			res.redirect("/");
		}

		// generate qrcode
		const newURL = `http://localhost:3000/models/${req.params.id}/ar`;
		const qr = await qrcode.toDataURL(newURL);

		res.render("pages/detail", { model: model, creator: creator, qr: qr });
	} else {
		res.redirect("/");
	}
});

module.exports = router;
