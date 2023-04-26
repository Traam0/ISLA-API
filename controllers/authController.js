/** @format */
const User = require("../models/UserModel");
const crypto = require("crypto-js");
const jswt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    console.table(req.body);
    const user = new User({
      fname: req.body.fname[0].toUpperCase() + req.body.fname.substring(1).toLowerCase(),
      lname: req.body.lname[0].toUpperCase() + req.body.lname.substring(1).toLowerCase(),
      username: req.body.username.toLowerCase(),
      email: req.body.email.toLowerCase(),
      password: crypto.AES.encrypt(req.body.password, process.env.CryptoKey).toString(),
      city: req.body?.city || null,
      country: req.body?.country || null,
      gender: req.body?.gender || null,
      bdate: req.body?.bdate || null,
      following: [],
      followers: [],
      image: null,
      banner: null,
    });

    const commited = await user.save();
    const { password, ...rest } = commited._doc;
    res.status(201).json({ data: rest });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [
        { username: req.body.username ? req.body.username.toLowerCase() : "" },
        { email: req.body.email ? req.body.email.toLowerCase() : "" },
      ],
    });
    if (user) {
      //~ if a user exists
      const depass = crypto.AES.decrypt(user.password, process.env.CryptoKey).toString(
        crypto.enc.Utf8
      );
      if (depass === req.body.password) {
        const accessToken = jswt.sign(
          { _id: user._id, _username: user.username },
          process.env.jswtKey,
          {
            expiresIn: "30d",
          }
        );
        console.log(user);
        const { password, ...rest } = user._doc;
        // res.cookie('accessToken', accessToken, {httponly: true, maxAge: 30000});
        console.log({ ...rest, accessToken });
        res.status(200).json({ data: { ...rest, accessToken } });
      } else {
        //~ if password does not match
        res.status(401).json({
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
      //~ if a user does not exist
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
  } catch (err) {
    console.log(err);
    res.status(500).json({ data: { err } });
  }
};

module.exports = { registerUser, loginUser };
