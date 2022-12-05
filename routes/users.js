const express = require("express");
const router = express.Router();
const userModel = require("../schemas/userSchema");
const modelModel = require("../schemas/modelSchema");
const counterModel = require("../schemas/counterSchema");
const authModel = require("../schemas/authSchema");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// middleware to force login on certain pages
const authRequired = (req, res, next) => {
	if (req.session.authenticated) {
		next();
	} else {
		res.redirect("/users/login");
	}
};

// middleware to block pages when logged in
const authBlocked = (req, res, next) => {
	if (req.session.authenticated) {
		res.redirect("back");
	} else {
		next();
	}
};

// /users page
router.get("/", (req, res) => {
	res.render("pages/edit.ejs");
});

// /users/login
router.get("/login", authBlocked, (req, res) => {
	res.render("pages/login");
});

router.post("/login", async (req, res) => {
	// get form data and requested email from db
	const { email, password } = req.body;
	const requestedUser = await userModel.findOne({ email });

	if (requestedUser) {
		if (requestedUser.active) {
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
				// if password incorrect
				res.render("pages/login", {
					email: req.body.email,
					error: "Incorrect email or password",
				});
			}
		} else {
			// if email unauthorised
			res.render("pages/login", {
				email: req.body.email,
				error: "Incorrect email or password",
			});
		}
	} else {
		// if user does not exist
		res.render("pages/login", {
			email: req.body.email,
			error: "Incorrect email or password",
		});
	}
});

// /users/signup: signup
router.get("/signup", authBlocked, (req, res) => {
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

// email confirmed page
router.get("/confirm/:hash", authBlocked, async (req, res) => {
	// check if entered hash exists in db
	const hash = req.params.hash;
	const authRequest = await authModel.findOne({ hash: hash });
	if (authRequest) {
		// if hash exists set user to active and remove hash from db
		const update = await userModel.updateOne(
			{ id: authRequest.userid },
			{ $set: { active: true } }
		);

		const del = await authRequest.delete();

		res.render("pages/confirm", { msg: "Email confirmed succesfully!" });
	} else {
		res.redirect("/users/login");
	}
});

// confirm email page
router.get("/confirm", authBlocked, (req, res) => {
	res.render("pages/confirm", {
		msg: `Welcome! <br />
					<br />
					We've send you an email. Please verify your account before loging in.`,
	});
});

router.get("/logout", authRequired, (req, res) => {
	res.render("pages/logout");
});

router.post("/logout", (req, res) => {
	req.session.destroy(err => {
		if (err) console.log(err);
		res.redirect("/users/login");
	});
});

// /users/userid
router.get("/:id", async (req, res) => {
	const user = await userModel.findOne({ id: req.params.id });

	// if user id exists render account page, else return
	if (user) {
		const models = await modelModel.find({ userid: user.id });
		if (models.length > 0) {
			res.render("pages/account", { user: user, models: models });
		} else {
			res.render("pages/account", { user: user });
		}
	} else {
		res.redirect("back");
	}
});

// --- FUNCTIONS ---

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

	// email setup
	nodemailer.createTestAccount((err, account) => {
		let transporter = nodemailer.createTransport({
			host: "smtp.ethereal.email",
			port: 587,
			secure: false,
			auth: {
				user: account.user,
				pass: account.pass,
			},
		});

		// mail content: put user hash into url
		const mailData = {
			from: account.user,
			to: newUser.email,
			subject: "Confirm Robot Lab AR Account",
			html: `Hey ${newUser.name}! <br /> Press the following link to confirm your Robot Lab AR account:<br /> 
			<a href="http://localhost:3000/users/confirm/${hash}">http://localhost:3000/users/confirm/${hash}</a>`,
		};

		transporter.sendMail(mailData, (err, info) => {
			if (err) {
				console.log(err);
			} else {
				console.log(nodemailer.getTestMessageUrl(info));
			}
		});
	});
}

module.exports = router;
