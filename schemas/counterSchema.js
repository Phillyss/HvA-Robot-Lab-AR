const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
	name: { type: String, require: true },
	count: { type: Number, require: true },
});

const model = mongoose.model("counters", counterSchema);

module.exports = model;
