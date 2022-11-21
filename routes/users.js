const express = require("express");
const router = express.Router();
const userModel = require("../schemas/userSchema");

// /users page
router.get("/", (req, res) => {
	res.render("pages/edit.ejs");
});

// /users/login
router.get("/login", (req, res) => {
	res.render("pages/login");
});

router.post("/login", (req, res) => {
	const { email, password } = req.body;
	if (email && password) {
		if (req.session.authenticated) {
			res.json(req.session);
		} else {
			if (password === "123123") {
				req.session.authenticated = true;
				req.session.user = {
					email,
					password,
				};
				res.json(req.session);
			} else {
				res.render("pages/login", {
					email: req.body.email,
					error: "Incorrect email or password",
				});
			}
		}
	} else {
		res.render("pages/login", {
			email: req.body.email,
			error: "Incorrect email or password",
		});
	}
	//res.send(200);
});

// /users/signup: signup
router.get("/signup", (req, res) => {
	res.render("pages/signup", { mail: "email@hva.nl" });
});

// upload signup user to db
router.post("/signup", async (req, res) => {
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

// /users/userid
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
