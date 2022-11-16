const express = require("express");
const router = express.Router();
const multer = require("multer");
const modelModel = require("../schemas/modelSchema");

// setup multer: file upload
const fileStorageEgnine = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./appFiles/gltfModels/4");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "-" + file.originalname);
	},
});

const upload = multer({ storage: fileStorageEgnine });

// /models: overview page
router.get("/", (req, res) => {
	res.redirect("/");
});

// /models/new: upload page
router.get("/upload", (req, res) => {
	res.render("pages/upload2");
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
			const tagsArray = req.body.tags.split(", ");
			let long = 0;
			let lat = 0;

			if (req.body.longitude !== "") long = Number(req.body.longitude);
			if (req.body.latitude !== "") lat = Number(req.body.latitude);

			const newModel = await modelModel.create({
				modelid: 4,
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
