"use client";

import { useEffect, useMemo, useState } from "react";
import { Star, ShieldCheck, Eye, EyeOff, Check } from "lucide-react";
import { fetchAllReviews, updateReview } from "@/lib/api";
import { IReview } from "@/types";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminGuard } from "@/hooks/useAdminGuard";

const FILTER_TABS = ["All", "Pending", "Approved", "Hidden"] as const;

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  hidden: "bg-gray-200 text-gray-600",
};

export default function AdminReviewsPage() {
  const ready = useAdminGuard();
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTER_TABS)[number]>("All");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    fetchAllReviews()
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ready]);

  const counts = useMemo(
    () => ({
      All: reviews.length,
      Pending: reviews.filter((r) => r.status === "pending").length,
      Approved: reviews.filter((r) => r.status === "approved").length,
      Hidden: reviews.filter((r) => r.status === "hidden").length,
    }),
    [reviews]
  );

  const filtered =
    filter === "All" ? reviews : reviews.filter((r) => r.status === filter.toLowerCase());

  const applyUpdate = async (
    review: IReview,
    changes: { status?: string; verifiedPurchase?: boolean }
  ) => {
    setSavingId(review._id);
    try {
      const updated = await updateReview(review._id, changes);
      setReviews((prev) => prev.map((r) => (r._id === review._id ? updated : r)));
    } catch (err) {
      console.error(err);
      alert("Couldn't update review.");
    } finally {
      setSavingId(null);
    }
  };

  if (!ready) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 px-10 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-500 mt-1">
          Approve or hide reviews before they show on the store.
        </p>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full p-1 mt-6 w-fit">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                filter === tab
                  ? "bg-blue-500 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
              <span className="ml-1.5 opacity-70">{counts[tab]}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-6">
            {filtered.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-gray-900">{review.reviewerName}</p>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                          STATUS_STYLES[review.status]
                        }`}
                      >
                        {review.status}
                      </span>
                    </div>
                    {review.location && (
                      <p className="text-gray-400 text-xs">{review.location}</p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
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
                </div>

                <span className="inline-block text-xs bg-blue-50 text-blue-500 px-3 py-1 rounded-full font-medium mb-3">
                  {review.useCase}
                </span>

                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  "{review.text}"
                </p>

                <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-gray-50">
                  {/* Verified purchase toggle */}
                  <button
                    onClick={() =>
                      applyUpdate(review, { verifiedPurchase: !review.verifiedPurchase })
                    }
                    disabled={savingId === review._id}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 ${
                      review.verifiedPurchase
                        ? "bg-green-50 text-green-600 hover:bg-green-100"
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    <ShieldCheck size={12} />
                    {review.verifiedPurchase ? "Verified Purchase" : "Not Verified"}
                  </button>

                  {/* Status actions */}
                  <div className="flex gap-2">
                    {review.status !== "approved" && (
                      <button
                        onClick={() => applyUpdate(review, { status: "approved" })}
                        disabled={savingId === review._id}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-50"
                      >
                        <Check size={12} />
                        Approve
                      </button>
                    )}
                    {review.status !== "hidden" && (
                      <button
                        onClick={() => applyUpdate(review, { status: "hidden" })}
                        disabled={savingId === review._id}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <EyeOff size={12} />
                        Hide
                      </button>
                    )}
                    {review.status === "hidden" && (
                      <button
                        onClick={() => applyUpdate(review, { status: "pending" })}
                        disabled={savingId === review._id}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <Eye size={12} />
                        Unhide
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
                No {filter !== "All" ? filter.toLowerCase() : ""} reviews.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
