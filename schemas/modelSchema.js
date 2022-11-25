const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema({
	modelid: { type: Number, require: true, unique: true },
	userid: { type: Number, require: true },
	username: { type: String, require: true },
	date: { type: String, require: true },
	name: { type: String, require: true },
	thumbnail: { type: String },
	description: { type: String, require: true },
	type: { type: String, require: true },
	tags: { type: [{ type: String }] },
	longitude: { type: Number },
	latitude: { type: Number },
});

const model = mongoose.model("models", modelSchema);

module.exports = model;
