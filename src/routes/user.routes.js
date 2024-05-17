import { Router } from "express";
import {
  changeCurrentUserPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAcessToken,
  registerUser,
  updateAccountDetails,
  updatedUserAvatar,
  updatedUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multter.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("./login").post(loginUser);
//secured  routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAcessToken);
//changed password
router.route("/change-password").post(verifyJWT, changeCurrentUserPassword);

//currentuser
router.route("/current-user").get(verifyJWT, getCurrentUser);
//update account detials
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

//updatedUserAvatar
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updatedUserAvatar);
//updatedUserCoverImage
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updatedUserCoverImage);

//getUserChannelProfile
router.route("/channel/:username").get(verifyJWT, getUserChannelProfile);

//etWatchHistory
router.route("/watch-history").get(verifyJWT, getWatchHistory);
export default router;
