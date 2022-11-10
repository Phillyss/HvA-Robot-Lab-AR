const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("users");
});

router.get("/new", (req, res) => {
  res.render("pages/signup", { mail: "email@hva.nl" });
});

router.post("/new", (req, res) => {
  const isValid = false;
  if (isValid) {
    res.redirect("/users/3");
  } else {
    res.render("pages/signup", { email: req.body.email });
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
router.param("id", (req, res, next, id) => {
  console.log(id);
  next();
});

module.exports = router;
