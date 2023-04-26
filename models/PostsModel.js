/** @format */

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userid: { type: String, required: true },
    content: { type: String, required: false /* max: 512 */ },
    media: { type: Array, default: [] },
    reputation: { type: Array, default: [] }, //todo must be +&- let be + for now
    // votes: { type: Array, default: [] },
    comments: { type: Array, default: [] },
    tags: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
