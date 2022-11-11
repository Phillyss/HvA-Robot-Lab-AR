const express = require("express");
const router = express.Router();
const modelModel = require("../schemas/modelSchema");

// /models: overview page
router.get("/", (req, res) => {
	res.redirect("/");
});

// /models/new: upload page
router.get("/new", (req, res) => {
	res.render("pages/upload", { mail: "email@hva.nl" });
});

// upload new model to db
router.post("/new", async (req, res) => {
	try {
		const isValid = true;
		if (isValid) {
			const newModel = await userModel.create({
				id: 2,
				title: req.body.title,
				description: req.body.description,
				type: req.body.type,
				tags: req.body.tags,
				longitude: req.body.longitude,
				latitude: req.body.latitude,
			});
			const save = await newModel.save();
			res.redirect("/models/3");
		} else {
			res.render("pages/upload", {
				email: req.body.email,
				name: req.body.fullname,
			});
		}
	} catch (err) {
		console.log(err);
	}
});

router
	.route("/:id/edit")
	.get((req, res) => {
		res.send(`user ${req.params.id}`);
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
