import express from "express";
import { createOrder, getOrderByNumber, getMyOrders, updateOrderStatus } from "../controllers/orderController";
import { protect, optionalAuth, requireAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", optionalAuth, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:orderNumber", getOrderByNumber);
router.put("/:orderNumber/status", protect, requireAdmin, updateOrderStatus);

export default router;