/** @format */

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true },
    content: { type: String, required: true, max: 512 },
    media: { type: Array, default: [] },
    votes: { type: Array, default: [] },
    replies: { type: Array, default: [] },
    //todo add nested comments feauture
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
