import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middleware/verifyjwt.middleware.js";
import {
  notificationpost,
  getnotifications,
  getnotificationsbyId,
} from "../controllers/notification.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/notifications").post(verifyJwt, notificationpost);
router.route("/notifications").get(verifyJwt, getnotifications);
router.route("/notifications/:id").get(verifyJwt, getnotificationsbyId);

export default router;
