/** @format */

const User = require("../models/UserModel");
const Conversation = require("../models/ConvoModel");
const Message = require("../models/MessageModel");

const getConversations = async (req, res) => {
  try {
    const convos = await Conversation.find({ participants: { $in: [req.user._id] } }).sort({
      createdAt: -1,
    });
    if (convos.length !== 0) {
      console.log(convos);
      res.status(200).json({ data: [...convos] });
    } else {
      res.status(404).json({ err: "No Conversations", data: [] });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

const getConversation = async (req, res) => {
  try {
    const convo = await Conversation.find({
      participants: { $in: [req.user._id, ...req.body.participants] },
    });
    console.log(convo);
    res.status(200).json({ data: convo });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

const createConversation = async (req, res) => {
  try {
    const convo = new Conversation({ participants: [...req.body.participants, req.user._id] });
    const commited = await convo.save();
    console.log(commited);
    res.status(201).json({ data: commited });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

const sendMessage = async (req, res) => {
  try {
    const message = new Message(req.body);
    const commited = await message.save();
    console.log(commited);
    res.status(200).json({ data: commited });
  } catch (err) {
    console.log({ err });
    res.status(500).json({ err });
  }
};

module.exports = { getConversations, getConversation, createConversation, sendMessage };
