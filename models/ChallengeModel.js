/** @format */

const mongoose = require("mongoose");

const chalengeSchema = new mongoose.Schema({
  xp: { type: Number, required: true },
  title: { type: String, required: true, unique: true },
  period: { type: String, required: true },
  total: { type: Number, required: true },
});

module.exports = mongoose.model("Challenge", chalengeSchema);
