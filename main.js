/** @format */

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const uploadProvider = require("express-fileupload");
const fs = require("fs");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const convoRoute = require("./routes/convoRoute");
const challengeRoute = require("./routes/challengeRoute");
const User = require("./models/UserModel");
const Post = require("./models/PostsModel");

const weeklyRotate = require("./services/weeklyRotation");
const dailyRotate = require("./services/dailyRotation");

const app = express();
const PORT = 5000;
dotenv.config();
app.use(cors({ origin: "*" }));
4;
app.use(uploadProvider({ createParentPath: true }));
app.use(express.json());
mongoose.set("strictQuery", true);
try {
  // mongoose
  //   .connect(
  //     `mongodb+srv://${process.env.MongoUser}:${process.env.MongoPass}@isla.zocaxkf.mongodb.net/${process.env.mongoDB}?retryWrites=true&w=majority`
  //   )
  //   .then(() => {
  //     console.log("db linked");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  mongoose
    .connect("mongodb://127.0.0.1:27017/ISLA?directConnection=true")
    .then(() => {
      console.log("db linked");
    })
    .catch((err) => {
      console.log(err);
    });
} catch (err) {
  console.log("Failed to connect to the MongoDB! 😕");
}

app.use("/isla/api/auth", authRoute);
app.use("/isla/api/user", userRoute);
app.use("/isla/api/post", postRoute);
app.use("/isla/api/conversation", convoRoute);
app.use("/isla/api/challenge", challengeRoute);

app

app.get("/isla/api/ping", (req, res) => {
  const data = { message: "Pinged XD", uuid: uuidv4() };
  console.table(data);
  res.status(200).json({ data });
});

app.get("/isla/api/search", async (req, res) => {
  // ~spr as in search param;
  const profiles = await User.find({
    $or: [
      { username: { $regex: `/${req.query.spr}/` } },
      { fname: { $regex: `/${req.query.spr}/` } },
      { lname: { $regex: `/${req.query.spr}/` } },
    ],
  });

  const posts = await Post.find({ tags: { $in: [req.query.spr] } });
  console.log({ data: { profiles, posts } });
  res.status(200).json({ data: { profiles, posts } });
});

app.get("/isla/api/media/:muid", (req, res) => {
  try {
    const path_ = __dirname + `/data/${req.params.muid}`;
    if (fs.existsSync(path_)) {
      const stat = fs.statSync(path_);
      const fileSize = stat.size;
      const head = {
        "Content-Length": fileSize,
        "Content-Type": [".mkv", ".mp4"].includes(path.extname(req.params.muid))
          ? `video/${path.extname(req.params.muid).split(".")[1]}`
          : [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"].includes(
              path.extname(req.params.muid)
            )
          ? `image/${path.extname(req.params.muid).split(".")[1]}`
          : null,
      };
      res.writeHead(200, head);
      fs.createReadStream(path_).pipe(res);
    } else {
      res.status(404).json({ err: "File Not Found." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

weeklyRotate();
dailyRotate();

app.listen(PORT, () => {
  console.log("service up and runnig. 🔥");
});
