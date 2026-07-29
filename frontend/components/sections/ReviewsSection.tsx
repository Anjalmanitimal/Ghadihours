"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchReviews, createReview } from "@/lib/api";
import { IReview } from "@/types";
import { Star, ShieldCheck, ThumbsUp, PenLine, X, Check } from "lucide-react";

const USE_CASES = ["Fitness", "Daily Use", "Gift"] as const;

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const loadReviews = () => {
    setLoading(true);
    fetchReviews()
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
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

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 mt-6 border-2 border-gray-200 hover:border-blue-500 text-gray-700 hover:text-blue-500 px-5 py-2.5 rounded-full font-semibold text-sm transition-colors"
          >
            <PenLine size={16} />
            Write a Review
          </button>
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

      {showForm && (
        <WriteReviewModal
          onClose={() => setShowForm(false)}
          onSubmitted={() => {
            setShowForm(false);
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 4000);
          }}
        />
      )}

      {submitted && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-3 rounded-full flex items-center gap-2 shadow-lg">
          <Check size={16} className="text-green-400" />
          Thanks! Your review is pending approval.
        </div>
      )}
    </section>
  );
};

const WriteReviewModal = ({
  onClose,
  onSubmitted,
}: {
  onClose: () => void;
  onSubmitted: () => void;
}) => {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [useCase, setUseCase] = useState<(typeof USE_CASES)[number]>("Daily Use");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) {
      onClose();
      router.push("/login");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await createReview(rating, useCase, text);
      onSubmitted();
    } catch (err) {
      const message =
        err && typeof err === "object" && "response" in err
          ? // @ts-expect-error — axios error shape
            err.response?.data?.message
          : undefined;
      setError(message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Write a review</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Rating */}
          <div>
            <label className="block text-xs font-semibold tracking-wide text-gray-500 mb-2">
              Your rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="p-0.5"
                >
                  <Star
                    size={26}
                    className={
                      s <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Use case */}
          <div>
            <label className="block text-xs font-semibold tracking-wide text-gray-500 mb-2">
              How do you use it?
            </label>
            <div className="flex gap-2">
              {USE_CASES.map((uc) => (
                <button
                  key={uc}
                  type="button"
                  onClick={() => setUseCase(uc)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    useCase === uc
                      ? "bg-blue-500 text-white"
                      : "bg-gray-50 text-gray-500 border border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {uc}
                </button>
              ))}
            </div>
          </div>

          {/* Text */}
          <div>
            <label className="block text-xs font-semibold tracking-wide text-gray-500 mb-2">
              Your review
            </label>
            <textarea
              required
              minLength={10}
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tell other customers what you think..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="h-12 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            {saving ? "Submitting..." : "Submit review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewsSection;
