"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { HomeProductSection } from "@/components/HomeProductSection";
import { fetchProducts } from "@/lib/products";
import { addCartItem } from "@/lib/cart";
import { getErrorMessage } from "@/lib/api";
import type { Product } from "@/types";
import { ErrorState } from "@/components/ui";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  const loadCategoryProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts({ category: params.slug, limit: 100 });
      setProducts(data as Product[]);
    } catch (err) {
      setProducts([]);
      setError(getErrorMessage(err, "Unable to load products for this category."));
    } finally {
      setLoading(false);
    }
  }, [params.slug]);

  useEffect(() => {
    void loadCategoryProducts();
  }, [loadCategoryProducts]);

  const handleAddToCart = useCallback(async (productId: string) => {
    setAddingProductId(productId);
    try {
      await addCartItem(productId, 1);
      toast.success("Added to cart.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't add this item to your cart."));
    } finally {
      setAddingProductId(null);
    }
  }, []);

  // Format slug for title
  const categoryName = params.slug
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  if (error) {
    return (
      <div className="min-h-screen bg-amazon-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <ErrorState
            title="We couldn't load this category"
            description={error}
            onRetry={() => {
              void loadCategoryProducts();
            }}
            homeHref="/"
          />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-amazon-background py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb could go here */}
        <div className="text-sm text-amazon-text-muted mb-4 capitalize">
          Home &rsaquo; {categoryName}
        </div>

        <HomeProductSection
          title={`${categoryName} Products`}
          products={products}
          isLoading={loading}
          onAddToCart={handleAddToCart}
          addingProductId={addingProductId}
        />
      </div>
    </main>
  );
}
