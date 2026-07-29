import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, getWishlist);
router.post("/", protect, addToWishlist);
router.delete("/:itemId", protect, removeFromWishlist);

export default router;
