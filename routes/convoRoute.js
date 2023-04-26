/** @format */

const router = require("express").Router();
const chatController = require("../controllers/chatController");
const authenticationMiddlware = require("../middlewares/validation");

router.get(
  "/:id",
  authenticationMiddlware.authenticateAccessToken,
  chatController.getConversations
);
router.get(
  "/:id/:cuid",
  authenticationMiddlware.authenticateAccessToken,
  chatController.getConversation
);
router.post(
  "/:id/new",
  authenticationMiddlware.authenticateAccessToken,
  chatController.createConversation
);

// module.export= router; <=== was previously
module.exports = router;
