/** @format */

const router = require("express").Router();
const postController = require("../controllers/postController");
const { validateAccessToken, authenticateAccessToken } = require("../middlewares/validation");

router.get("/all", validateAccessToken, postController.getAllPages);
router.get("/:postid", validateAccessToken, postController.getPost);
router.post("/:id/publish", authenticateAccessToken, postController.publishPost);
router.post("/:id/upload", validateAccessToken, postController.uploadPostImage);
router.patch("/:puid/vote", validateAccessToken, postController.votePost);
router
  .route("/:id/:postid")
  .put(authenticateAccessToken, postController.updatePost)
  .delete(authenticateAccessToken, postController.deletePost);

module.exports = router;
