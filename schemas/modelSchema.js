const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema({
	id: { type: Number, require: true },
	title: { type: String, require: true },
	description: { type: String, require: true },
	type: { type: String, require: true },
	tags: { type: [{ type: String }] },
	longitude: { type: Number },
	latitude: { type: Number },
});

const model = mongoose.model("models", modelSchema);

module.exports = model;
