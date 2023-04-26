/** @format */

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation_id: { type: String, require: true },
    from: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Messages", messageSchema);
