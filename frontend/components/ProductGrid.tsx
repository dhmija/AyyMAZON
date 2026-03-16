"use client";

import type { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/LoaderSkeleton";
import { cn } from "@/lib/utils";

export interface ProductGridProps {
  products: Product[];
  /** Show loading skeletons instead of products */
  isLoading?: boolean;
  /** Number of skeleton cards when loading */
  skeletonCount?: number;
  /** Base path for product links */
  productLinkBase?: string;
  /** Called when Add to cart is clicked on a card */
  onAddToCart?: (productId: string) => void;
  /** Product ID currently being added (shows loading on that card) */
  addingProductId?: string | null;
  className?: string;
}

export function ProductGrid({
  products,
  isLoading = false,
  skeletonCount = 8,
  productLinkBase = "/products",
  onAddToCart,
  addingProductId,
  className,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4",
          className
        )}
      >
        {Array.from({ length: skeletonCount }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12 text-amazon-text-muted",
          className
        )}
      >
        <p className="text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4",
        className
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          hrefBase={productLinkBase}
          onAddToCart={onAddToCart}
          isAddingToCart={addingProductId === product.id}
        />
      ))}
    </div>
  );
}
