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

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	if (email && password) {
		if (req.session.authenticated) {
			res.json(req.session);
		} else {
			// check db for input email and compare passwords > if match authenticate user
			const requestedUser = await userModel.findOne({ email: req.body.email });
			if (requestedUser.password === password) {
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
		let error = "";
		error = validateSignupForm(req, error);

		if (error.length === 0) {
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
				error: error,
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

// validate sign up form
function validateSignupForm(req, error) {
	if (req.body.password !== req.body.confirm) {
		error = "Passwords do not match";
	}

	if (req.body.password.length < 6) {
		error = "Password is less than 6 characters";
	}

	if (!req.body.fullname.includes(" ")) {
		error = "Use your full name";
	}

	if (!req.body.email.includes("@hva.nl")) {
		error = "Use a HvA email";
	}

	return error;
}

// run before router
// router.param("id", (req, res, next, id) => {
// 	console.log(id);
// 	next();
// });

module.exports = router;
