const express = require("express");
const modelModel = require("../schemas/modelSchema");

async function renderOveview(req, res) {
	try {
		const models = await modelModel.find({}).sort([["modelid", -1]]);
		res.render("pages/overview", { models: models });
	} catch (err) {
		console.log(err);
	}
}

module.exports = renderOveview;
