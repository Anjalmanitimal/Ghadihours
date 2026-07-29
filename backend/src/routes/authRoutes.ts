import express from "express";
import { register, login, guestLogin, getMe, saveConfig, updateProfile, changePassword } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/guest", guestLogin);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);
router.put("/save-config", protect, saveConfig);

export default router;