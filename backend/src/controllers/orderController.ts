import { Request, Response } from "express";
import Order from "../models/Order";
import Product from "../models/Product";
import { AuthRequest } from "../middleware/authMiddleware";

// generate clean order number e.g. SW-293847
const generateOrderNumber = (): string => {
  return "SW-" + Date.now().toString().slice(-6);
};

// estimated delivery 5 business days from now
const getEstimatedDelivery = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date;
};

// @desc  Create new order
// @route POST /api/orders
export const createOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      items,
      deliveryDetails,
      paymentMethod,
      isGuestOrder,
      guestEmail,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: "No items to order" });
      return;
    }

    // find product and verify stock for every line item
    const product = await Product.findOne();
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    const variants = items.map((item) => {
      const variant = product.variants.find(
        (v) =>
          v.caseColor === item.caseColor &&
          v.strapColor === item.strapColor &&
          v.size === item.size
      );
      return { item, variant };
    });

    const outOfStock = variants.find(
      ({ item, variant }) => !variant || variant.stock < item.quantity
    );
    if (outOfStock) {
      res.status(400).json({
        success: false,
        message: `${outOfStock.item.caseColor} / ${outOfStock.item.strapColor} / ${outOfStock.item.size} is out of stock`,
      });
      return;
    }

    // calculate pricing — no hidden fees
    const subtotal = items.reduce(
      (sum: number, item: { quantity: number }) => sum + product.price * item.quantity,
      0
    );
    const shipping = product.freeShipping ? 0 : 500;
    const tax = Math.round(subtotal * 0.13); // 13% VAT Nepal
    const total = subtotal + shipping + tax;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: isGuestOrder ? null : req.user?._id,
      guestEmail: isGuestOrder ? guestEmail : null,
      isGuestOrder,
      items: items.map((item) => ({ ...item, price: product.price })),
      deliveryDetails,
      pricing: { subtotal, shipping, tax, total },
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "Order Placed",
      estimatedDeliveryDate: getEstimatedDelivery(),
    });

    // reduce stock per variant
    variants.forEach(({ item, variant }) => {
      variant!.stock -= item.quantity;
    });
    await product.save();

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc  Get order by order number — used on confirmation page
// @route GET /api/orders/:orderNumber
export const getOrderByNumber = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
    });
    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc  Get all orders for logged in user — profile/tracking page
// @route GET /api/orders/my-orders
export const getMyOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user?._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc  Update order status
// @route PUT /api/orders/:orderNumber/status
export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findOneAndUpdate(
      { orderNumber: req.params.orderNumber },
      {
        orderStatus: req.body.orderStatus,
        paymentStatus: req.body.paymentStatus,
      },
      { new: true }
    );

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};