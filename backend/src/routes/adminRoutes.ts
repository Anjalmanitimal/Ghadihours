import express from "express";
import { getStats, getAllOrders, getAllCustomers } from "../controllers/adminController";
import { protect, requireAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.use(protect, requireAdmin);

router.get("/stats", getStats);
router.get("/orders", getAllOrders);
router.get("/customers", getAllCustomers);

export default router;
