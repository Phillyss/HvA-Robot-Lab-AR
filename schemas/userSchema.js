const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	id: { type: Number, require: true, unique: true },
	email: { type: String, require: true, unique: true },
	name: { type: String, require: true },
	password: { type: String, require: true },
	admin: { type: Boolean, require: true, default: false },
	active: { type: Boolean, require: true, default: false },
});

const model = mongoose.model("users", userSchema);

module.exports = model;
