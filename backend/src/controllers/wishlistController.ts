import { Response } from "express";
import Wishlist from "../models/Wishlist";
import Product from "../models/Product";
import { AuthRequest } from "../middleware/authMiddleware";

// @desc  Get the logged-in user's wishlist
// @route GET /api/wishlist
export const getWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user?._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user?._id, items: [] });
    }
    res.json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc  Save a configuration to the wishlist — ignores exact duplicates
// @route POST /api/wishlist
export const addToWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { caseColor, strapColor, size } = req.body;

    const product = await Product.findOne();
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    let wishlist = await Wishlist.findOne({ user: req.user?._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user?._id, items: [] });
    }

    const alreadySaved = wishlist.items.some(
      (item) =>
        item.caseColor === caseColor &&
        item.strapColor === strapColor &&
        item.size === size
    );

    if (!alreadySaved) {
      wishlist.items.push({ caseColor, strapColor, size, price: product.price } as never);
      await wishlist.save();
    }

    res.status(201).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc  Remove a saved configuration from the wishlist
// @route DELETE /api/wishlist/:itemId
export const removeFromWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user?._id });
    if (!wishlist) {
      res.status(404).json({ success: false, message: "Wishlist not found" });
      return;
    }

    wishlist.items = wishlist.items.filter(
      (i) => i._id.toString() !== req.params.itemId
    ) as never;

    await wishlist.save();
    res.json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
