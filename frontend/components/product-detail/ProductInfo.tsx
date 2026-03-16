"use client";

import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { RatingStars } from "@/components/ui/RatingStars";
import { DiscountBadge } from "@/components/ui/DiscountBadge";
import { cn } from "@/lib/utils";

export interface ProductInfoProps {
  title: string;
  /** Brand or category name */
  brand?: string | null;
  rating?: string | number | null;
  reviewCount?: number | null;
  price: string;
  originalPrice?: string | null;
  discountPercentage?: string | null;
  inStock: boolean;
  /** Bullet point features (from description or list) */
  features?: string[];
  className?: string;
}

export function ProductInfo({
  title,
  brand,
  rating,
  reviewCount,
  price,
  originalPrice,
  discountPercentage,
  inStock,
  features = [],
  className,
}: ProductInfoProps) {
  const ratingNum = rating != null ? parseFloat(String(rating)) : null;
  const hasDiscount = discountPercentage != null && Number(discountPercentage) > 0;

  return (
    <div className={cn("space-y-3", className)}>
      {brand && (
        <p className="text-amazon-link-blue text-sm hover:underline cursor-pointer transition-colors duration-200 hover:text-teal-800">
          Visit the <span className="font-medium">{brand}</span> Store
        </p>
      )}
      <h1 className="text-amazon-text text-xl md:text-2xl font-medium leading-tight">
        {title}
      </h1>

      {ratingNum != null && (
        <div className="flex items-center gap-2">
          <RatingStars
            rating={ratingNum}
            reviewCount={reviewCount ?? undefined}
            size="md"
          />
          <span className="text-xs text-amazon-text-muted">
            {reviewCount != null && reviewCount > 0
              ? `${reviewCount.toLocaleString("en-IN")} ratings`
              : ""}
          </span>
        </div>
      )}

      <hr className="border-t border-gray-200" />

      {/* Price row */}
      <div className="flex flex-wrap items-center gap-2">
        <PriceDisplay
          price={price}
          originalPrice={originalPrice}
          size="lg"
        />
        {hasDiscount && (
          <DiscountBadge percentage={discountPercentage!} className="text-xs" />
        )}
      </div>

      {/* EMI note */}
      <p className="text-amazon-link-blue text-xs cursor-pointer hover:underline">
        No Cost EMI available
      </p>

      <hr className="border-t border-gray-200" />

      {/* Stock status */}
      <p
        className={cn(
          "text-sm font-medium",
          inStock ? "text-green-700" : "text-red-600"
        )}
      >
        {inStock ? "✔ In Stock" : "Currently unavailable"}
      </p>

      {/* Seller / ships info */}
      <div className="text-sm text-amazon-text space-y-0.5">
        <p>
          <span className="text-amazon-text-muted">Sold by </span>
          <span className="text-amazon-link-blue cursor-pointer hover:underline">
            {brand ?? "Amazon Seller"}
          </span>
        </p>
        <p>
          <span className="text-amazon-text-muted">Ships from </span>
          <span className="font-medium">Amazon.in</span>
        </p>
      </div>

      {/* Feature bullets */}
      {features.length > 0 && (
        <ul className="space-y-1.5 text-sm text-amazon-text">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5 shrink-0">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
