const express = require("express");
const router = express.Router();
const formidable = require("express-formidable");
const modelModel = require("../schemas/modelSchema");

router.use(formidable());

router.get("*", (req, res) => {
	res.redirect("back");
});

// load more button
router.post("/", async (req, res) => {
	const startFrom = parseInt(req.fields.startFrom);
	const nextModels = await modelModel
		.find({ modelid: { $lt: startFrom } })
		.sort({ modelid: -1 })
		.limit(3);
	res.json(nextModels);
});

module.exports = router;
