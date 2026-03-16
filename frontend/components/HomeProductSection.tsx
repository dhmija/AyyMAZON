"use client";

import type { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCardSkeleton } from "@/components/ui/LoaderSkeleton";
import { cn } from "@/lib/utils";

export interface HomeProductSectionProps {
  title: string;
  products: Product[];
  isLoading?: boolean;
  /** Base path for product links */
  productLinkBase?: string;
  onAddToCart?: (productId: string) => void;
  addingProductId?: string | null;
  /** Max number of products to show (default all) */
  maxItems?: number;
  className?: string;
}

export function HomeProductSection({
  title,
  products,
  isLoading = false,
  productLinkBase = "/products",
  onAddToCart,
  addingProductId,
  maxItems,
  className,
}: HomeProductSectionProps) {
  const list = maxItems ? products.slice(0, maxItems) : products;
  const skeletonCount = maxItems ?? 8;

  return (
    <section className={cn("bg-amazon-card-bg rounded shadow-card p-4", className)}>
      <h2 className="text-amazon-text text-lg font-semibold mb-4">{title}</h2>
      {isLoading ? (
        <div
          className={cn(
            "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          )}
        >
          {Array.from({ length: skeletonCount }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="This section will fill in as soon as products are available."
          compact
        />
      ) : (
        <div
          className={cn(
            "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          )}
        >
          {list.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              hrefBase={productLinkBase}
              onAddToCart={onAddToCart}
              isAddingToCart={addingProductId === product.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}
