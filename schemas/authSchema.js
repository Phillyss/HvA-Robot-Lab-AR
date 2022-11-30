const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
	hash: { type: String, require: true, unique: true },
	userid: { type: Number, require: true, unique: true },
});

const model = mongoose.model("auths", authSchema);

module.exports = model;
