const mongoose = require("mongoose");

const resetschema = new mongoose.Schema({
	hash: { type: String, require: true, unique: true },
	email: { type: String, require: true },
});

const model = mongoose.model("resetPasswords", resetschema);

module.exports = model;
