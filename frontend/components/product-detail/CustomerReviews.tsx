"use client";

import { useMemo } from "react";
import { RatingStars } from "@/components/ui/RatingStars";
import { cn } from "@/lib/utils";

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  title?: string;
  body: string;
  date: string;
}

export interface CustomerReviewsProps {
  reviews?: ReviewItem[];
  productTitle?: string;
  /** Total review count from product */
  totalReviewCount?: number | null;
  /** Average rating from product */
  averageRating?: number | null;
  className?: string;
}

/** Deterministic number from string — for stable mock data */
function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const MOCK_NAMES = [
  "Priya S.", "Rahul M.", "Anjali K.", "Vikram R.", "Sneha T.",
  "Arjun P.", "Meera D.", "Suresh L.", "Kavita N.", "Aditya B.",
];
const MOCK_TITLES = [
  "Excellent product!", "Value for money", "Very satisfied",
  "Good quality", "Highly recommend", "Exactly as described",
];
const MOCK_BODIES = [
  "Really happy with this purchase. Build quality is solid and it arrived quickly. Would definitely buy again.",
  "Great value for the price. Functions exactly as described and the packaging was secure. Five stars!",
  "Impressed with the overall quality. My family loves it. Delivery was fast and customer support was responsive.",
  "Very good product. Matches the description perfectly. The material feels premium and durable.",
  "Ordered this on a friend's recommendation and I'm not disappointed. Works perfectly right out of the box.",
];

function generateMockReviews(seed: string, rating: number): ReviewItem[] {
  const h = simpleHash(seed);
  const count = 3 + (h % 2); // 3 or 4 reviews
  return Array.from({ length: count }, (_, i) => {
    const ih = simpleHash(`${seed}${i}`);
    const stars = Math.min(5, Math.max(3, Math.round(rating) - (i === 2 ? 1 : 0)));
    return {
      id: `mock-${h}-${i}`,
      author: MOCK_NAMES[ih % MOCK_NAMES.length]!,
      rating: stars,
      title: MOCK_TITLES[(ih + i) % MOCK_TITLES.length],
      body: MOCK_BODIES[(ih + i) % MOCK_BODIES.length]!,
      date: new Date(2025, (ih + i) % 12, 1 + (ih % 28)).toLocaleDateString("en-IN", {
        year: "numeric", month: "short", day: "numeric",
      }),
    };
  });
}

/** Rating breakdown distribution seeded on productTitle */
function getRatingDistribution(avgRating: number, totalCount: number, seed: string) {
  const h = simpleHash(seed);
  // Weights shaped around the average
  const raw = [1, 2, 3, 4, 5].map((star) => {
    const dist = Math.abs(star - avgRating);
    return Math.max(1, Math.round((5 - dist * 1.5) * 10) + (h % 5));
  });
  const total = raw.reduce((a, b) => a + b, 0);
  return [5, 4, 3, 2, 1].map((star) => ({
    star,
    pct: Math.round(((raw[star - 1]!) / total) * 100),
    count: Math.round(((raw[star - 1]!) / total) * Math.max(totalCount, 20)),
  }));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-orange-200 text-orange-800",
  "bg-blue-200 text-blue-800",
  "bg-green-200 text-green-800",
  "bg-purple-200 text-purple-800",
  "bg-teal-200 text-teal-800",
];

export function CustomerReviews({
  reviews,
  productTitle = "this product",
  totalReviewCount = 0,
  averageRating,
  className,
}: CustomerReviewsProps) {
  const avgRating = averageRating ?? 4.2;
  const count = totalReviewCount ?? 0;

  const displayedReviews = useMemo(() => {
    if (reviews && reviews.length > 0) return reviews;
    return generateMockReviews(productTitle, avgRating);
  }, [reviews, productTitle, avgRating]);

  const distribution = useMemo(
    () => getRatingDistribution(avgRating, count, productTitle),
    [avgRating, count, productTitle]
  );

  return (
    <section className={cn("bg-amazon-card-bg rounded shadow-card p-6", className)}>
      <h2 className="text-amazon-text text-lg font-semibold mb-4">
        Customer Reviews
        {count > 0 && (
          <span className="text-amazon-text-muted font-normal ml-2">
            ({count.toLocaleString("en-IN")} {count === 1 ? "review" : "reviews"})
          </span>
        )}
      </h2>

      {/* Rating summary */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-6 border-b border-gray-200">
        {/* Big average */}
        <div className="flex flex-col items-center justify-center sm:w-28 shrink-0">
          <span className="text-5xl font-bold text-amazon-text">{avgRating.toFixed(1)}</span>
          <RatingStars rating={avgRating} size="sm" />
          <span className="text-xs text-amazon-text-muted mt-1">out of 5</span>
        </div>
        {/* Breakdown bars */}
        <div className="flex-1 space-y-1.5">
          {distribution.map(({ star, pct, count: starCount }) => (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-8 text-right text-amazon-link-blue cursor-pointer hover:underline shrink-0">
                {star} star
              </span>
              <div className="flex-1 h-3 bg-gray-200 rounded overflow-hidden">
                <div
                  className="h-full bg-amazon-orange-dark rounded"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 text-amazon-text-muted shrink-0">{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual reviews */}
      <ul className="space-y-5 divide-y divide-gray-100">
        {displayedReviews.map((r, idx) => (
          <li key={r.id} className="pt-5 first:pt-0">
            <div className="flex items-center gap-3 mb-2">
              {/* Avatar */}
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                  AVATAR_COLORS[idx % AVATAR_COLORS.length]
                )}
                aria-hidden
              >
                {getInitials(r.author)}
              </div>
              <div>
                <p className="text-sm font-medium text-amazon-text">{r.author}</p>
                <RatingStars rating={r.rating} size="sm" />
              </div>
              <span className="text-xs text-amazon-text-muted ml-auto">{r.date}</span>
            </div>
            {r.title && (
              <p className="text-sm font-semibold text-amazon-text mb-1">{r.title}</p>
            )}
            <p className="text-sm text-amazon-text leading-relaxed">{r.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
