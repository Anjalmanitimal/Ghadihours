"use client";

import { useEffect, useState } from "react";
import { fetchReviews } from "@/lib/api";
import { IReview } from "@/types";
import { Star, ShieldCheck, ThumbsUp } from "lucide-react";

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews()
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "All" ? reviews : reviews.filter((r) => r.useCase === filter);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "4.8";

  return (
    <section id="reviews" className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-blue-500 text-sm font-semibold uppercase tracking-widest mb-4">
            Reviews
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Real people. Real results.
          </h2>
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <ShieldCheck size={16} className="text-green-600" />
            <span className="text-sm">Every review is from a verified purchase.</span>
          </div>

          {/* Rating summary */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="text-5xl font-bold text-gray-900">{avgRating}</span>
            <div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={20} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-400 text-sm">{reviews.length} reviews</p>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-3 mb-10">
          {["All", "Fitness", "Daily Use", "Gift"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === tab
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-blue-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Review cards */}
        {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.slice(0, 6).map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Stars + verified */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={
                        s <= review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-200"
                      }
                    />
                  ))}
                </div>
                {review.verifiedPurchase && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <ShieldCheck size={10} />
                    Verified
                  </span>
                )}
              </div>

              {/* Reviewer info */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {review.reviewerName}
                  </p>
                  <p className="text-gray-400 text-xs">{review.location}</p>
                </div>
                <span className="text-xs bg-blue-50 text-blue-500 px-3 py-1 rounded-full font-medium">
                  {review.useCase}
                </span>
              </div>

              {/* Review text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                "{review.text}"
              </p>

              {/* Helpful count */}
              <p className="flex items-center gap-1.5 text-gray-400 text-xs">
                <ThumbsUp size={12} />
                {review.helpfulCount} people found this helpful
              </p>
            </div>
          ))}
        </div>
        )}

        {/* Loading skeleton — Doherty Threshold: acknowledge activity immediately */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-100 h-48 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm">
            No reviews in this category yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;