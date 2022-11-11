const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	id: { type: Number, require: true },
	email: { type: String, require: true },
	name: { type: String, require: true },
	password: { type: String, require: true },
});

const model = mongoose.model("users", userSchema);

module.exports = model;
