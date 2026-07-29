import { Response } from "express";
import Order from "../models/Order";
import User from "../models/User";
import Review from "../models/Review";
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

// @desc  All customers (registered + guest) with order count and most recent order
// @route GET /api/admin/customers
export const getAllCustomers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    // registered-user orders are linked via `user`; guest orders are stored
    // anonymously (user: null) and only traceable via guestEmail — so both
    // need their own aggregation, sorted newest-first so $first is the latest.
    const [byUser, byGuestEmail] = await Promise.all([
      Order.aggregate([
        { $match: { user: { $ne: null } } },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: "$user",
            count: { $sum: 1 },
            totalSpent: { $sum: "$pricing.total" },
            lastOrderStatus: { $first: "$orderStatus" },
            lastOrderNumber: { $first: "$orderNumber" },
          },
        },
      ]),
      Order.aggregate([
        { $match: { isGuestOrder: true, guestEmail: { $ne: null } } },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: "$guestEmail",
            count: { $sum: 1 },
            totalSpent: { $sum: "$pricing.total" },
            lastOrderStatus: { $first: "$orderStatus" },
            lastOrderNumber: { $first: "$orderNumber" },
          },
        },
      ]),
    ]);

    const byUserMap = new Map(byUser.map((o) => [o._id.toString(), o]));
    const byEmailMap = new Map(byGuestEmail.map((o) => [o._id, o]));

    const customers = users.map((u) => {
      const stats = byUserMap.get(u._id.toString()) || byEmailMap.get(u.email);
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone || null,
        isGuest: u.isGuest,
        createdAt: u.get("createdAt"),
        orderCount: stats?.count || 0,
        totalSpent: stats?.totalSpent || 0,
        lastOrderStatus: stats?.lastOrderStatus || null,
        lastOrderNumber: stats?.lastOrderNumber || null,
      };
    });

    res.json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc  All reviews regardless of status — moderation queue
// @route GET /api/admin/reviews
export const getAllReviews = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc  Approve, hide, or toggle the verified badge on a review
// @route PUT /api/admin/reviews/:id
export const updateReview = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status, verifiedPurchase } = req.body;
    const update: Partial<{ status: string; verifiedPurchase: boolean }> = {};
    if (status !== undefined) update.status = status;
    if (verifiedPurchase !== undefined) update.verifiedPurchase = verifiedPurchase;

    const review = await Review.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!review) {
      res.status(404).json({ success: false, message: "Review not found" });
      return;
    }

    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
