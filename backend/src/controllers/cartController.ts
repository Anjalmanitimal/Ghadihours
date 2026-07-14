import { Response } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";
import { AuthRequest } from "../middleware/authMiddleware";

// @desc  Get the logged-in user's cart
// @route GET /api/cart
export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let cart = await Cart.findOne({ user: req.user?._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user?._id, items: [] });
    }
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc  Add an item to the cart — merges with an existing identical variant
// @route POST /api/cart
export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { caseColor, strapColor, size, quantity } = req.body;
    const qty = quantity && quantity > 0 ? quantity : 1;

    const product = await Product.findOne();
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    let cart = await Cart.findOne({ user: req.user?._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user?._id, items: [] });
    }

    const existing = cart.items.find(
      (item) =>
        item.caseColor === caseColor &&
        item.strapColor === strapColor &&
        item.size === size
    );

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.items.push({ caseColor, strapColor, size, quantity: qty, price: product.price } as never);
    }

    await cart.save();
    res.status(201).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc  Update an item's quantity — removes the item if quantity <= 0
// @route PUT /api/cart/:itemId
export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user?._id });
    if (!cart) {
      res.status(404).json({ success: false, message: "Cart not found" });
      return;
    }

    const item = cart.items.find((i) => i._id.toString() === req.params.itemId);
    if (!item) {
      res.status(404).json({ success: false, message: "Item not found in cart" });
      return;
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId) as never;
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc  Remove a single item from the cart
// @route DELETE /api/cart/:itemId
export const removeCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user?._id });
    if (!cart) {
      res.status(404).json({ success: false, message: "Cart not found" });
      return;
    }

    cart.items = cart.items.filter(
      (i) => i._id.toString() !== req.params.itemId
    ) as never;

    await cart.save();
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc  Empty the cart — used after an order is placed
// @route DELETE /api/cart
export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user?._id },
      { items: [] },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
