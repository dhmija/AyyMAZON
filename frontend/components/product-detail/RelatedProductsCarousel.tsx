"use client";

import { useRef } from "react";
import Link from "next/link";
import type { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";

export interface RelatedProductsCarouselProps {
  products: Product[];
  title?: string;
  onAddToCart?: (productId: string) => void;
  addingProductId?: string | null;
  /** Category slug for the "See all" link */
  categorySlug?: string;
  className?: string;
}

export function RelatedProductsCarousel({
  products,
  title = "Related Products",
  onAddToCart,
  addingProductId,
  categorySlug,
  className,
}: RelatedProductsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className={cn("bg-amazon-card-bg rounded shadow-card p-6 relative", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-amazon-text text-lg font-semibold">{title}</h2>
        {categorySlug && (
          <Link
            href={`/products/category/${categorySlug}`}
            className="text-amazon-link-blue text-sm hover:underline shrink-0"
          >
            See all →
          </Link>
        )}
      </div>

      {/* Carousel with overlay arrows */}
      <div className="relative group/carousel">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-10 w-10 flex items-center justify-center bg-gradient-to-r from-white to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200"
          aria-label="Scroll left"
        >
          <div className="w-9 h-9 rounded-full border border-gray-300 bg-white shadow flex items-center justify-center hover:bg-amazon-background transition-colors duration-200">
            <ChevronLeftIcon className="w-5 h-5 text-amazon-text" />
          </div>
        </button>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-10 w-10 flex items-center justify-center bg-gradient-to-l from-white to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200"
          aria-label="Scroll right"
        >
          <div className="w-9 h-9 rounded-full border border-gray-300 bg-white shadow flex items-center justify-center hover:bg-amazon-background transition-colors duration-200">
            <ChevronRightIcon className="w-5 h-5 text-amazon-text" />
          </div>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2 -mx-1 px-1"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="shrink-0 w-44 sm:w-52"
              style={{ scrollSnapAlign: "start" }}
            >
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                isAddingToCart={addingProductId === product.id}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  );
}
