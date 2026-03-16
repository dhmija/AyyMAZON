"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { RatingStars } from "@/components/ui/RatingStars";
import { DiscountBadge } from "@/components/ui/DiscountBadge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  product: Product;
  /** Optional base path for product links (e.g. /products) */
  hrefBase?: string;
  /** Called when Add to cart is clicked */
  onAddToCart?: (productId: string) => void;
  /** Show loading state on Add to cart button */
  isAddingToCart?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  hrefBase = "/products",
  onAddToCart,
  isAddingToCart = false,
  className,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const href = `${hrefBase}/${product.id}`;
  const imageUrl =
    product.images?.[0]?.imageUrl ??
    "https://via.placeholder.com/400x400?text=No+Image";
  const rating = product.rating != null ? parseFloat(String(product.rating)) : null;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((v) => !v);
    toast.success(wishlisted ? "Removed from Wishlist" : "Added to Wishlist");
  };

  return (
    <article
      className={cn(
        "group bg-amazon-card-bg rounded shadow-card overflow-hidden flex flex-col h-full surface-hover",
        className
      )}
    >
      <Link href={href} className="block flex-1 flex flex-col p-4">
        <div className="relative w-full aspect-square mb-3 bg-amazon-background rounded overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized
          />
          {product.discountPercentage != null &&
            Number(product.discountPercentage) > 0 && (
              <div className="absolute top-2 left-2">
                <DiscountBadge percentage={product.discountPercentage} />
              </div>
            )}
          {/* Wishlist heart — visible on group-hover */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={cn(
              "absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 border border-gray-200 shadow flex items-center justify-center transition-all duration-200",
              "opacity-0 group-hover:opacity-100 hover:scale-110"
            )}
          >
            <HeartIcon
              className={cn(
                "w-4 h-4 transition-colors duration-200",
                wishlisted ? "text-red-500 fill-red-500" : "text-gray-400"
              )}
            />
          </button>
        </div>
        <h3 className="text-amazon-text text-sm font-medium line-clamp-2 mb-1 transition-colors duration-200 group-hover:text-amazon-link-blue">
          {product.title}
        </h3>
        {rating != null && (
          <div className="mb-1">
            <RatingStars
              rating={rating}
              reviewCount={product.reviewCount ?? undefined}
              size="sm"
            />
          </div>
        )}
        <PriceDisplay
          price={product.price}
          originalPrice={product.originalPrice}
          size="sm"
        />
      </Link>
      {onAddToCart && (
        <div className="p-4 pt-0">
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product.id);
            }}
            isLoading={isAddingToCart}
          >
            Add to Cart
          </Button>
        </div>
      )}
    </article>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}
