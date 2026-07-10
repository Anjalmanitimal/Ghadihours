import { Request, Response } from "express";
import Product from "../models/Product";

// @desc  Get the single product
// @route GET /api/products
export const getProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findOne();
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc  Seed product into database (run once)
// @route POST /api/products/seed
export const seedProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await Product.deleteMany();

    const product = await Product.create({
      name: "Kada Smart Watch",
      tagline: "Built for the life you live.",
      description:
        "One device. Every metric that matters. Designed to disappear on your wrist and show up in your life.",
      price: 32000,
      images: [
        "/images/watch-hero.png",
        "/images/watch-black.png",
        "/images/watch-silver.png",
        "/images/watch-rosegold.png",
      ],
      features: [
        {
          title: "Know your heart.",
          body: "Real-time heart rate, ECG and SpO2 monitoring. Not just numbers — insights that help you act.",
          benefitTag: "Catch irregular patterns early.",
          icon: "heart",
        },
        {
          title: "Sleep smarter.",
          body: "Advanced sleep stage tracking tells you not just how long you slept — but how well.",
          benefitTag: "Wake up actually rested.",
          icon: "moon",
        },
        {
          title: "Train with data, not guesswork.",
          body: "Built-in GPS, VO2 max tracking, and automatic workout detection.",
          benefitTag: "Push harder. Recover smarter.",
          icon: "activity",
        },
        {
          title: "Charge once. Last the week.",
          body: "Up to 7-day battery life. Because your life doesn't stop, your watch shouldn't either.",
          benefitTag: "Less charging. More living.",
          icon: "battery",
        },
      ],
      variants: [
        { caseColor: "Midnight Black", strapColor: "Black",  size: "40mm", stock: 50 },
        { caseColor: "Midnight Black", strapColor: "Black",  size: "44mm", stock: 50 },
        { caseColor: "Midnight Black", strapColor: "Navy",   size: "40mm", stock: 40 },
        { caseColor: "Midnight Black", strapColor: "Navy",   size: "44mm", stock: 40 },
        { caseColor: "Midnight Black", strapColor: "Red",    size: "40mm", stock: 30 },
        { caseColor: "Midnight Black", strapColor: "Beige",  size: "44mm", stock: 30 },
        { caseColor: "Silver Aluminium", strapColor: "Black",  size: "40mm", stock: 45 },
        { caseColor: "Silver Aluminium", strapColor: "Beige",  size: "44mm", stock: 35 },
        { caseColor: "Rose Gold", strapColor: "Beige", size: "40mm", stock: 25 },
        { caseColor: "Rose Gold", strapColor: "Red",   size: "44mm", stock: 20 },
      ],
      waterResistance: "5ATM",
      batteryLife: "Up to 7 days",
      warrantyMonths: 12,
      returnWindowDays: 30,
      freeShipping: true,
      rating: 4.8,
      reviewCount: 247,
    });

    res.status(201).json({
      success: true,
      message: "✅ Product seeded successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};