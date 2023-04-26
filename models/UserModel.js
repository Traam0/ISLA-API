/** @format */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // picture: {type: File}, //todo add a file upload to mongodb
    city: { type: String },
    gender: { type: String },
    country: { type: String },
    bdate: { type: Date },
    following: { type: Array, default: [] },
    followers: { type: Array, default: [] },
    banner: { type: String, default: "" },
    image: { type: String, default: "default.jpg" },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    daily: {type: Array, default: []}, // daily: [{id1, progress}, {id2, progress}, {id3, progress}] => id <= {...challenge}
    weekly: {type: Array, default: []}
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
