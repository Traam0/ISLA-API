/** @format */
const Post = require("../models/PostsModel");
const User = require("../models/UserModel");
const { v4: uuidv4 } = require("uuid");

const getAllPages = async (req, res) => {
  try {
    console.table(req.query);
    // const filters = {}

    if (!req.query.page) {
      const posts = await Post.find({ createdAt: new Date(req.query.start) }).sort({
        createdAt: -1,
      });
      console.log(posts);
      res.status(200).json({ data: [...posts] });
    } else {
      req.query.page = req.query.page <= 0 ? 1 : req.query.page;
      const posts = await Post.find().sort({ createdAt: -1 });

      if (posts) {
        for (const post of posts) {
          const user = await User.findById(post.userid);
          const { username, image: userImage, ...rest } = user._doc;

          post._doc.user = { ...post._doc?.user, username, userImage };
        }
        console.log([
          ...posts.slice((Number(req.query.page) - 1) * 15, (Number(req.query.page) - 1) * 15 + 15),
        ]);
        // console.log(new Date(req.query.start).toISOString())
        res.status(200).json({
          pagination: {
            last_page: Number.isInteger(posts.length / 15)
              ? parseInt(posts.length / 15)
              : parseInt(posts.length / 15) + 1,
            has_next_page:
              req.query.page <
              (Number.isInteger(posts.length / 15)
                ? parseInt(posts.length / 15)
                : parseInt(posts.length / 15) + 1)
                ? true
                : false,
            has_previous_page: req.query.page > 1 ? true : false,
            previous_page: Number(req.query.page) - 1 >= 1 ? Number(req.query.page) - 1 : undefined,
            current_page: Number(req.query.page),
            next_page:
              req.query.page <
              (Number.isInteger(posts.length / 15)
                ? parseInt(posts.length / 15)
                : parseInt(posts.length / 15) + 1)
                ? Number(req.query.page) + 1
                : undefined,
            per_page: 15,
            total: posts.length,
          },
          data: [
            ...posts.slice(
              (Number(req.query.page) - 1) * 15,
              (Number(req.query.page) - 1) * 15 + 15
            ),
          ],
        });
      } else {
        res.status(404).json({
          pagination: {
            last_page: null,
            has_next_page: null,
            has_previous_page: null,
            previous_page: null,
            current_page: null,
            next_page: null,
          },
          data: [],
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postid);
    post
      ? (() => {
          console.log(post);
          res.status(200).json(post);
        })()
      : res.status(404).json("Not Found");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userid: req.params.userId });
    const user = await User.find({ _id: req.parms.userId });
    posts
      ? (() => {
          console.log(posts);
          res.status(200).json({ data: { posts } });
        })()
      : res.status(404).json({ message: "No posts to show" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

const publishPost = async (req, res) => {
  try {
    const post = new Post(req.body);
    const commited = await post.save();
    res.status(201).json(commited);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const updatePost = async (req, res) => {
  //! might need a authentication instead of validationg
  try {
    const post = await Post.findById(req.params.postid);
    post.userid == req.body.userid
      ? async () => {
          await post.updateOne({ $set: req.body });
          res.status(204).json(post);
        }
      : res.status(403).json("Action Denied");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const deletePost = async (req, res) => {
  //! might need a authentication instead of validationg
  try {
    const post = await Post.findById(req.params.postid);
    post.userid == req.body.userid
      ? async () => {
          await post.deleteOne();
          res.status(204).json("Post deleted");
        }
      : res.status(403).json("Action Denied");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const votePost = async (req, res) => {
  try {
    if (req.body.vote === 0) {
      await Post.findByIdAndUpdate(
        req.params.puid,
        {
          $pull: { reputation: { uuid: req.user._id } },
        },
        { new: true }
      );
      res.sendStatus(200);
    } else {
      await Post.findByIdAndUpdate(
        req.params.puid,
        {
          $pull: { reputation: { uuid: req.user._id } },
        },
        { new: true }
      );
      const post = await Post.findByIdAndUpdate(
        req.params.puid,
        {
          $addToSet: { reputation: { uuid: req.user._id, vote: req.body.vote } }, //! $pull to remove so updating vote  => remove previous and add new to set
        },
        { new: true }
      );
      post ? res.status(200).json({ data: post }) : res.status(404).json("post not found");
      console.log(`voted for ${post}`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ data: { err } });
  }
};

const uploadPostImage = async (req, res) => {
  try {
    const path = __dirname + "../../data";
    const file = req.files.media;
    const ext = file.name.split(".")[file.name.split(".").length - 1];
    const fileName = uuidv4() + "." + ext;
    file.mv(`${path}/${fileName}`);

    res.status(200).json({ fileName });
  } catch (err) {
    res.status(500).json({ data: { err } });
  }
};

module.exports = {
  getAllPages,
  getPost,
  publishPost,
  updatePost,
  deletePost,
  votePost,
  uploadPostImage,
  getUserPosts,
};
