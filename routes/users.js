const express = require("express");
const router = express.Router();
const userModel = require("../schemas/userSchema");

router.get("/", (req, res) => {
	res.render("pages/edit.ejs");
});

router.get("/new", (req, res) => {
	res.render("pages/signup", { mail: "email@hva.nl" });
});

router.post("/new", async (req, res) => {
	try {
		const isValid = true;
		if (isValid) {
			const newUser = await userModel.create({
				id: 2,
				name: req.body.fullname,
				email: req.body.email,
				password: req.body.password,
			});
			const save = await newUser.save();
			res.redirect("/users/3");
		} else {
			res.render("pages/signup", {
				email: req.body.email,
				name: req.body.fullname,
			});
		}
	} catch (err) {
		console.log(err);
	}
});

router
	.route("/:id")
	.get((req, res) => {
		res.send(`user ${req.params.id}`);
	})
	.put((req, res) => {
		res.send(`update ${req.params.id}`);
	})
	.delete((req, res) => {
		res.send(`delete ${req.params.id}`);
	});

// run before router
// router.param("id", (req, res, next, id) => {
// 	console.log(id);
// 	next();
// });

module.exports = router;
