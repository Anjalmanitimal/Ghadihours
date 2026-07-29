import express from "express";
import {
  getStats,
  getAllOrders,
  getAllCustomers,
  getAllReviews,
  updateReview,
} from "../controllers/adminController";
import { protect, requireAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.use(protect, requireAdmin);

router.get("/stats", getStats);
router.get("/orders", getAllOrders);
router.get("/customers", getAllCustomers);
router.get("/reviews", getAllReviews);
router.put("/reviews/:id", updateReview);

export default router;
