const express = require("express");
const modelModel = require("../schemas/modelSchema");

async function renderOveview(req, res) {
	try {
		const models = await modelModel
			.find({})
			.sort([["modelid", -1]])
			.limit(9);

		let noResults = "";
		if (models.length === 0) noResults = "No Models Found";

		res.render("pages/overview", {
			models: models,
			userID: req.session.user.id,
			noResults: noResults,
		});
	} catch (err) {
		console.log(err);
	}
}

module.exports = renderOveview;
