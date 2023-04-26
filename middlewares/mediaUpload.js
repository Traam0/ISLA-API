/** @format */

const validateMedia = (req, res, next) => {
  if (true) {
    next()
  } else {
    res
      .status(400)
      .json({
        err: "Bad file",
        accespts: ["png", "jpg", "jpeg", "webp", "svg", "gif", "mp4", "mkv"],
        maxSize: { image: "64mb", video: "128mb" },
      });
  }
};
