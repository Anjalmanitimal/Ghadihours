import express from "express";
import { getReviews, createReview, seedReviews } from "../controllers/reviewController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getReviews);
router.post("/", protect, createReview);
router.post("/seed", seedReviews);

export default router;
