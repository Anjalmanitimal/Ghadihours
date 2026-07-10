import express from "express";
import { getReviews, seedReviews } from "../controllers/reviewController";

const router = express.Router();

router.get("/", getReviews);
router.post("/seed", seedReviews);

export default router;