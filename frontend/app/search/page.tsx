"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { HomeProductSection } from "@/components/HomeProductSection";
import { fetchProducts } from "@/lib/products";
import { addCartItem } from "@/lib/cart";
import { getErrorMessage } from "@/lib/api";
import type { Product } from "@/types";
import { ErrorState } from "@/components/ui";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  const loadSearchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts({ search: query, category, limit: 100 });
      setProducts((data as Product[]) || []);
    } catch (err) {
      setProducts([]);
      setError(getErrorMessage(err, "Unable to load search results."));
    } finally {
      setLoading(false);
    }
  }, [query, category]);

  useEffect(() => {
    void loadSearchResults();
  }, [loadSearchResults]);

  const handleAddToCart = useCallback(async (productId: string) => {
    setAddingProductId(productId);
    try {
      await addCartItem(productId, 1);
      toast.success("Added to cart.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't add this item to your cart."));
    } finally {
      setAddingProductId(null);
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-amazon-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <ErrorState
            title="We couldn't load your search results"
            description={error}
            onRetry={() => {
              void loadSearchResults();
            }}
            homeHref="/"
          />
        </div>
      </div>
    );
  }

  const title = query ? `Results for "${query}"` : "Search Results";
  const categoryName = category
    ? category
        .split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

  return (
    <main className="min-h-screen bg-amazon-background py-6">
      <div className="max-w-7xl mx-auto px-4">
        {categoryName && (
          <div className="text-sm text-amazon-text-muted mb-4 capitalize">
            Category &rsaquo; {categoryName}
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="py-12 text-center text-amazon-text-muted text-lg">
            No results found for {"\""}{query}{"\""}
            {categoryName && ` in ${categoryName}`}
          </div>
        )}

        {(products.length > 0 || loading) && (
          <HomeProductSection
            title={title}
            products={products}
            isLoading={loading}
            onAddToCart={handleAddToCart}
            addingProductId={addingProductId}
          />
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-amazon-background py-12 px-4 text-center">Loading search results...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
