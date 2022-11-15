const express = require("express");
const router = express.Router();
const modelModel = require("../schemas/modelSchema");

// /models: overview page
router.get("/", (req, res) => {
  res.redirect("/");
});

// /models/new: upload page
router.get("/upload", (req, res) => {
  res.render("pages/upload2");
});

// upload new model to db
router.post("/upload", async (req, res) => {
  try {
    const tagsArray = req.body.tags.split(", ");
    console.log(req.body);

    const newModel = await modelModel.create({
      id: 2,
      name: req.body.name,
      description: req.body.description,
      type: req.body.type,
      tags: tagsArray,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
    });
    const save = await newModel.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

router
  .route("/:id/edit")
  .get((req, res) => {
    res.render("pages/edit");
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
