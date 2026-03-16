"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { CartItem } from "@/components/CartItem";
import { CartSummary } from "@/components/CartSummary";
import { CartPageSkeleton, EmptyState, ErrorState } from "@/components/ui";
import { getErrorMessage } from "@/lib/api";
import { fetchCart, updateCartItem, removeCartItem } from "@/lib/cart";
import type { Cart } from "@/types";

const TAX_RATE = 0.18;

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCart();
      if (data) {
        setCart({
          id: data.id,
          userId: data.userId,
          items: data.items,
          totalAmount: data.totalAmount,
        });
      } else {
        setCart(null);
      }
    } catch (error) {
      setCart(null);
      setError(getErrorMessage(error, "Unable to load your cart."));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleUpdateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      setUpdatingId(productId);
      try {
        const updated = await updateCartItem(productId, quantity);
        if (updated) {
          setCart({
            id: updated.id,
            userId: updated.userId,
            items: updated.items,
            totalAmount: updated.totalAmount,
          });
        }
      } catch (error) {
        toast.error(getErrorMessage(error, "Couldn't update this cart item."));
      } finally {
        setUpdatingId(null);
      }
    },
    []
  );

  const handleRemove = useCallback(async (productId: string) => {
    setUpdatingId(productId);
    try {
      const updated = await removeCartItem(productId);
      if (updated) {
        setCart({
          id: updated.id,
          userId: updated.userId,
          items: updated.items,
          totalAmount: updated.totalAmount,
        });
      }
      toast.success("Item removed from cart.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't remove this item."));
    } finally {
      setUpdatingId(null);
    }
  }, []);

  const subtotal = cart?.totalAmount ?? "0";
  const subtotalNum = parseFloat(subtotal);
  const estimatedTax = Number.isNaN(subtotalNum) ? 0 : Math.round(subtotalNum * TAX_RATE);
  const totalNum = subtotalNum + estimatedTax;
  const total = totalNum.toFixed(2);

  if (loading) {
    return <CartPageSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amazon-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <ErrorState
            title="Your cart couldn't be loaded"
            description={error}
            onRetry={() => {
              void loadCart();
            }}
            homeHref="/"
          />
        </div>
      </div>
    );
  }

  const isEmpty = !cart?.items?.length;

  return (
    <div className="min-h-screen bg-amazon-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-amazon-text text-2xl font-semibold mb-6">
          Shopping Cart
          {cart?.items?.length != null && cart.items.length > 0 && (
            <span className="text-amazon-text-muted font-normal text-base ml-2">
              ({cart.items.length} {cart.items.length === 1 ? "item" : "items"})
            </span>
          )}
        </h1>

        {isEmpty ? (
          <EmptyState
            title="Your cart is empty"
            description="Save something for later or add a few finds to start checkout."
            actionHref="/"
            actionLabel="Continue shopping"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {cart!.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                  isUpdating={updatingId === item.productId}
                />
              ))}
            </div>

            {/* Cart summary panel */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <CartSummary
                  subtotal={subtotal}
                  estimatedTax={estimatedTax}
                  total={total}
                  disabled={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
