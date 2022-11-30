const express = require("express");
const router = express.Router();
const userModel = require("../schemas/userSchema");
const counterModel = require("../schemas/counterSchema");
const authModel = require("../schemas/authSchema");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// /users page
router.get("/", (req, res) => {
	res.render("pages/edit.ejs");
});

// /users/login
router.get("/login", (req, res) => {
	res.render("pages/login");
});

router.post("/login", async (req, res) => {
	// get form data and requested email from db
	const { email, password } = req.body;
	const requestedUser = await userModel.findOne({ email });

	if (requestedUser) {
		// check db for input email and compare passwords > if match log in user
		const isMatch = await bcrypt.compare(password, requestedUser.password);
		if (isMatch) {
			req.session.authenticated = true;
			req.session.user = {
				email,
				id: requestedUser.id,
				name: requestedUser.name,
			};
			res.redirect("/");
		} else {
			res.render("pages/login", {
				email: req.body.email,
				error: "Incorrect email or password",
			});
		}
	} else {
		res.render("pages/login", {
			email: req.body.email,
			error: "Incorrect email or password",
		});
	}
});

// /users/signup: signup
router.get("/signup", (req, res) => {
	res.render("pages/signup");
});

// upload new user to db
router.post("/signup", async (req, res) => {
	try {
		// get form data
		const { email, fullname, password } = req.body;

		// check if email already exists in db
		const user = await userModel.findOne({ email });
		if (user) {
			return res.render("pages/signup", { error: "Email already exists" });
		} else {
			// form validation
			let error = "";
			error = validateSignupForm(req, error);

			// if form valid
			if (error.length === 0) {
				// get next user id
				const counter = await counterModel.findOne({ name: "users" });
				const nextID = counter.count + 1;

				// encrypt password
				const hashedPsw = await bcrypt.hash(password, 12);

				// upload user to db
				const newUser = await userModel.create({
					id: nextID,
					name: fullname,
					email: email,
					password: hashedPsw,
				});
				const save = await newUser.save();

				// increase user count
				const udpate = await counter.updateOne({ $inc: { count: 1 } });

				// send email authentication
				sendAuthMail(newUser);

				res.redirect("/users/confirm");
			} else {
				// if form invalid rerender signup page
				res.render("pages/signup", {
					email: email,
					name: fullname,
					error: error,
				});
			}
		}
	} catch (err) {
		console.log(err);
	}
});

// confirm email page
router.get("/confirm", (req, res) => {
	res.render("pages/confirm");
});

router.get("/logout", (req, res) => {
	res.render("pages/logout");
});

router.post("/logout", (req, res) => {
	req.session.destroy(err => {
		if (err) console.log(err);
		res.redirect("/users/login");
	});
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

// send authentication email
async function sendAuthMail(newUser) {
	const hash = crypto.randomBytes(20).toString("hex");

	// store hash in db
	const newAuth = await authModel.create({
		hash: hash,
		userid: newUser.id,
	});

	// send email

	return hash;
}

// run before router
// router.param("id", (req, res, next, id) => {
// 	console.log(id);
// 	next();
// });

module.exports = router;
