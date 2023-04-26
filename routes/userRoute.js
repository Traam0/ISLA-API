/** @format */

const router = require("express").Router();
const userController = require("../controllers/userController");
const authenticationMiddlware = require("../middlewares/validation");

router.get("/q=:q", authenticationMiddlware.validateAccessToken, userController.findUser);
router.get("/me", authenticationMiddlware.validateAccessToken, userController.getSelf);
router.get(
  "/leaderboard",
  authenticationMiddlware.validateAccessToken,
  userController.getLeaderBoard
);
router.get(
  "/me/analytics",
  authenticationMiddlware.validateAccessToken,
  userController.getSelfAnalytics
);
router.post(
  "/:id/image",
  authenticationMiddlware.authenticateAccessToken,
  userController.updateProfileImage
);
router.post(
  "/:id/banner",
  authenticationMiddlware.authenticateAccessToken,
  userController.updateProfileBanner
);
router
  .route("/:id")
  .put(authenticationMiddlware.authenticateAccessToken, userController.updateUser)
  .delete(authenticationMiddlware.authenticateAccessToken, userController.deleteUser);

module.exports = router;
