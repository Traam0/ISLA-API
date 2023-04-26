/** @format */
const crypto = require("crypto-js");
const { isValidObjectId } = require("mongoose");
const User = require("../models/UserModel");
const Post = require("../models/PostsModel");
const { v4: uuidv4 } = require("uuid");

const [xpWeight, gapWeight] = [0.08, 1.8];

const tillNextLevel = (x, y, l) => {
  // x being the weight that affects the xp required per level
  // lower values => more xp required per level

  // y being the weight that affects how quickly the required xp per level should increase
  // higher values => bigger gaps between levels

  return Math.floor((l / x) ** y - 94);
};

const updateUser = async (req, res) => {
  if (req.body.password) {
    req.body.password = crypto.AES.encrypt(req.body.password, process.env.CryptoKey).toString();
  }
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    // todo delete posts / likes / comments /  of the user as well
    res.status(204).json("Account deleted succesfully");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const findUser = async (req, res) => {  
  //~ q for querry
  try {
    if (isValidObjectId(req.params.q)) {
      const target = await User.findById(req.params.q);

      if (target) {
        const { password, ...rest } = target._doc;
        rest.tillNextLevel = tillNextLevel(xpWeight, gapWeight, target.level + 1);
        console.log(rest);
        res.status(200).json(rest);
      } else {
        res.status(404).json({
          data: {
            _id: null,
            fname: null,
            lname: null,
            username: null,
            email: null,
            city: null,
            gender: null,
            country: null,
            bdate: null,
            following: null,
            followers: null,
            createdAt: null,
            updatedAt: null,
            __v: null,
            accessToken: null,
            banner: null,
            image: null,
          },
        });
      }
    } else {
      const target = await User.findOne({
        $or: [
          { username: req.params.q.toLocaleLowerCase() },
          { fname: req.params.q[0].toUpperCase() + req.params.q.substring(1).toLocaleLowerCase() },
          { lname: req.params.q[0].toUpperCase() + req.params.q.substring(1).toLocaleLowerCase() },
          { email: req.params.q.toLocaleLowerCase() },
        ],
      });

      if (target) {
        const { password, ...rest } = target._doc;
        rest.tillNextLevel = tillNextLevel(xpWeight, gapWeight, target.level + 1);
        console.log(rest);
        res.status(200).json(rest);
      } else {
        res.status(404).json({
          data: {
            _id: null,
            fname: null,
            lname: null,
            username: null,
            email: null,
            city: null,
            gender: null,
            country: null,
            bdate: null,
            following: null,
            followers: null,
            createdAt: null,
            updatedAt: null,
            __v: null,
            accessToken: null,
            banner: null,
            image: null,
          },
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const getSelf = async (req, res) => {
  try {
    const self = await User.findById(req.user._id);
    if (self) {
      const { password, ...rest } = self._doc;
      rest.tillNextLevel = tillNextLevel(xpWeight, gapWeight, self.level + 1);
      console.log(rest);
      res.status(200).json(rest);
    } else {
      const response = {
        _id: null,
        fname: null,
        lname: null,
        username: null,
        email: null,
        city: null,
        gender: null,
        country: null,
        bdate: null,
        following: null,
        followers: null,
        createdAt: null,
        updatedAt: null,
        __v: null,
        accessToken: null,
        banner: null,
        image: null,
        level: null,
        xp: null,
      };
      console.log(response);
      res.status(404).json({ data: response });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

const getSelfAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const data = await Post.aggregate([
      { $match: { userid: { $in: [user._id.toString()] } } },
      { $project: { month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } } },
      { $group: { _id: "$month", count: { $sum: 1 } } },
    ]);
    console.log({ user: user._doc, posts: data });
    res.status(200).json({ data: { user: user._doc, posts: data } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

const updateProfileImage = async (req, res) => {
  try {
    const file = req.files.image;
    const fileExtention = file.name.split(".")[file.name.split(".").length - 1];
    const fileName = `${uuidv4()}.${fileExtention}`;
    file.mv(__dirname + `/data/${fileName}`);

    const updated = await User.findByIdAndUpdate(req.params.id, {
      image: fileName,
    });
    const { password, ...rest } = updated._doc;
    console.log(rest);
    res.status(200).json({ data: { ...rest } });
  } catch (err) {
    res.status(500).json({ data: { err } });
  }
};

const updateProfileBanner = async (req, res) => {
  try {
    const file = req.files.image;
    const fileExtention = file.name.split(".")[file.name.split(".").length - 1];
    const fileName = `${uuidv4()}.${fileExtention}`;
    file.mv(__dirname + `/data/${fileName}`);

    const updated = await User.findByIdAndDelete(req.params.id, {
      banner: fileName,
    });
    const { password, ...rest } = updated._doc;
    console.log(rest);
    res.status(200).json({ data: { ...rest } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ data: { err } });
  }
};

// const tillNextLevelBeta = (l) => {
//   return l > 2 ? 69.3062 * l ** 2 - 23.1671 * l - 160.209 : 15 * l ** 2 + 5 * l + 0.68;
// };

const getLeaderBoard = async (req, res) => {
  try {
    if (req.query.limit) {
      const profiles = await User.find().sort({ xp: -1 }).limit(req.query.limit);
      res.status(200).json({ data: profiles });
    } else {
      const profiles = await User.find().sort({ xp: -1 });
      res.status(200).json({ data: profiles });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

module.exports = {
  findUser,
  updateUser,
  deleteUser,
  getSelf,
  getSelfAnalytics,
  updateProfileImage,
  updateProfileBanner,
  getLeaderBoard,
};
