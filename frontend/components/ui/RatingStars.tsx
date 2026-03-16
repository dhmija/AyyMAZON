"use client";

import { cn } from "@/lib/utils";

export interface RatingStarsProps {
  /** Rating value between 0 and 5 (e.g. 3.5, 4.8) */
  rating: number;
  /** Optional review count to show next to stars */
  reviewCount?: number | null;
  /** Size of the stars */
  size?: "sm" | "md";
  className?: string;
}

const MAX_STARS = 5;

export function RatingStars({
  rating,
  reviewCount,
  size = "md",
  className,
}: RatingStarsProps) {
  const clamped = Math.min(MAX_STARS, Math.max(0, Number(rating)));
  const full = Math.floor(clamped);
  const hasHalf = clamped - full >= 0.5;

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <span
        className="flex text-amazon-orange-dark"
        aria-label={`Rating: ${rating} out of ${MAX_STARS}`}
      >
        {Array.from({ length: MAX_STARS }, (_, i) => {
          const filled = i < full || (i === full && hasHalf);
          return (
            <span
              key={i}
              className={cn(
                size === "sm" ? "text-sm" : "text-base",
                filled ? "text-amazon-orange-dark" : "text-gray-300"
              )}
            >
              {filled ? "★" : "☆"}
            </span>
          );
        })}
      </span>
      {reviewCount != null && reviewCount > 0 && (
        <span className="text-amazon-link-blue text-xs ml-0.5">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
