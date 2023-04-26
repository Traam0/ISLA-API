/** @format */

const Challenge = require("../models/ChallengeModel");

const addChallenge = async (req, res) => {
  try {
    const challenge = new Challenge(req.body);
    const commited = await challenge.save();
    res.status(201).json({data: commited})
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, message: "server Error" });
  }
};

const getAll = async (req, res) => {
  try {
    const challenges = await Challenge.find()
    res.status(200).json({data: challenges})
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, message: "server Error" });
  }  
};

module.exports = { getAll, addChallenge };