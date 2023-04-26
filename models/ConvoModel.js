/** @format */

const mongoose = require("mongoose");

const convoSchema = new mongoose.Schema(
  {
    participants: { type: Array, required: true, unique: true },
    // chat: { type: Array, require: true, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Convo", convoSchema);
