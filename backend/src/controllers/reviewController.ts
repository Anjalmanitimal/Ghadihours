import { Request, Response } from "express";
import Review from "../models/Review";
import Product from "../models/Product";

// @desc  Get all reviews
// @route GET /api/reviews
export const getReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reviews = await Review.find().sort({ helpfulCount: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc  Seed reviews — run once
// @route POST /api/reviews/seed
export const seedReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await Review.deleteMany();

    const product = await Product.findOne();
    if (!product) {
      res.status(404).json({ success: false, message: "Seed product first" });
      return;
    }

    const reviews = [
      {
        product: product._id,
        reviewerName: "Sita Gurung",
        location: "Lalitpur, Nepal",
        rating: 5,
        useCase: "Daily Use",
        text: "I didn't realise how much I was ignoring my body until I had the data in front of me every morning. The sleep tracking alone changed how I plan my day.",
        verifiedPurchase: true,
        helpfulCount: 43,
      },
      {
        product: product._id,
        reviewerName: "Aarav Thapa",
        location: "Pokhara, Nepal",
        rating: 5,
        useCase: "Fitness",
        text: "GPS accuracy is impressive for the price. VO2 max tracking is genuinely useful for interval training. Battery easily lasts my whole week.",
        verifiedPurchase: true,
        helpfulCount: 38,
      },
      {
        product: product._id,
        reviewerName: "Riya Sharma",
        location: "Kathmandu, Nepal",
        rating: 4,
        useCase: "Daily Use",
        text: "Looks amazing and the customiser was so fun to use. Went with navy strap on midnight black — exactly what I wanted. Delivery was fast too.",
        verifiedPurchase: true,
        helpfulCount: 29,
      },
      {
        product: product._id,
        reviewerName: "Kiran Limbu",
        location: "Biratnagar, Nepal",
        rating: 5,
        useCase: "Fitness",
        text: "I recommend this to all my training clients now. The recovery tracking is spot on and the 5ATM rating held up during open water swimming.",
        verifiedPurchase: true,
        helpfulCount: 51,
      },
      {
        product: product._id,
        reviewerName: "Meera Joshi",
        location: "Butwal, Nepal",
        rating: 4,
        useCase: "Gift",
        text: "Bought this as a gift for my husband. The checkout was simple and order confirmation came instantly. He absolutely loves it.",
        verifiedPurchase: true,
        helpfulCount: 17,
      },
      {
        product: product._id,
        reviewerName: "Bikash Rai",
        location: "Bhaktapur, Nepal",
        rating: 5,
        useCase: "Daily Use",
        text: "The design is exactly what I was looking for. Clean, minimal and the rose gold with beige strap is a head-turner. Premium feel throughout.",
        verifiedPurchase: true,
        helpfulCount: 22,
      },
    ];

    await Review.insertMany(reviews);

    // update product rating average
    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(product._id, {
      rating: Number(avg.toFixed(1)),
      reviewCount: reviews.length,
    });

    res.status(201).json({
      success: true,
      message: "✅ Reviews seeded successfully",
      count: reviews.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};