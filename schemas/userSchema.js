const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  stars: { type: Number, require: true, default: 0 },
  items: { type: Array, require: true },
  level: { type: Number, require: true, default: 0 },
  wins: { type: Number, require: true, default: 0 },
  teamWins: { type: Number, require: true, default: 0 },
  hp: { type: Number, require: true, default: 0 },
  atk: { type: Number, require: true, default: 0 },
  def: { type: Number, require: true, default: 0 },
  spa: { type: Number, require: true, default: 0 },
  spd: { type: Number, require: true, default: 0 },
  spe: { type: Number, require: true, default: 0 },
  rev: { type: Number, require: true, default: 1 },
  eje: { type: Number, require: true, default: 1 },
  teamWins: { type: Number, require: true, default: 0 },
});

const model = mongoose.model("userModels", userSchema);

module.exports = model;
