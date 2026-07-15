import { Response } from "express";
import Order from "../models/Order";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

const PENDING_STATUSES = ["Order Placed", "Processing"] as const;

// @desc  Dashboard summary stats
// @route GET /api/admin/stats
export const getStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const [totalOrders, pending, shipped, delivered, orders] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: { $in: PENDING_STATUSES } }),
      Order.countDocuments({ orderStatus: "Shipped" }),
      Order.countDocuments({ orderStatus: "Delivered" }),
      Order.find().select("pricing.total"),
    ]);

    const revenue = orders.reduce((sum, o) => sum + o.pricing.total, 0);

    res.json({
      success: true,
      data: { totalOrders, pending, shipped, delivered, revenue },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc  All orders, most recent first
// @route GET /api/admin/orders
export const getAllOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc  All customers with their order count
// @route GET /api/admin/customers
export const getAllCustomers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find({ isGuest: false })
      .select("-password")
      .sort({ createdAt: -1 });

    const orderCounts = await Order.aggregate([
      { $match: { user: { $ne: null } } },
      { $group: { _id: "$user", count: { $sum: 1 }, totalSpent: { $sum: "$pricing.total" } } },
    ]);
    const countByUser = new Map(
      orderCounts.map((o) => [o._id.toString(), { count: o.count, totalSpent: o.totalSpent }])
    );

    const customers = users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      createdAt: u.get("createdAt"),
      orderCount: countByUser.get(u._id.toString())?.count || 0,
      totalSpent: countByUser.get(u._id.toString())?.totalSpent || 0,
    }));

    res.json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
