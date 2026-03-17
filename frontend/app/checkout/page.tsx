"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckoutForm } from "@/components/CheckoutForm";
import { OrderSummary } from "@/components/OrderSummary";
import { CheckoutPageSkeleton, EmptyState, ErrorState } from "@/components/ui";
import { getErrorMessage } from "@/lib/api";
import { fetchCart } from "@/lib/cart";
import { placeOrder } from "@/lib/orders";
import type { AddressFormData } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartTotal, setCartTotal] = useState<string>("0");
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<AddressFormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  const loadCheckout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cart = await fetchCart();
      if (cart) setCartTotal(cart.totalAmount);
    } catch (error) {
      setCartTotal("0");
      setError(getErrorMessage(error, "Unable to load your checkout details."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCheckout();
  }, [loadCheckout]);

  const handleAddressSubmit = useCallback((data: AddressFormData) => {
    setAddress(data);
    toast.success("Delivery address saved.");
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    if (!address) return;
    setPlacing(true);
    try {
      const order = await placeOrder(address.email);
      if (order && address) {
        try {
          sessionStorage.setItem(
            `order_${order.id}_address`,
            JSON.stringify(address)
          );
        } catch {
          // ignore
        }
        toast.success("Order placed successfully. Confirmation email sent!");
        router.push(`/orders/${order.id}`);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not place your order."));
    } finally {
      setPlacing(false);
    }
  }, [address, router]);

  if (loading) {
    return <CheckoutPageSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amazon-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <ErrorState
            title="Checkout is unavailable"
            description={error}
            onRetry={() => {
              void loadCheckout();
            }}
            homeHref="/cart"
            homeLabel="Back to cart"
          />
        </div>
      </div>
    );
  }

  const subtotalNum = parseFloat(cartTotal);
  const isEmpty = Number.isNaN(subtotalNum) || subtotalNum <= 0;

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-amazon-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <EmptyState
            title="Nothing to check out yet"
            description="Add a few products to your cart before heading back here."
            actionHref="/cart"
            actionLabel="View cart"
            secondaryActionHref="/"
            secondaryActionLabel="Continue shopping"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amazon-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-amazon-text text-2xl font-semibold mb-6">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping address form */}
          <div className="lg:col-span-2">
            <CheckoutForm onSubmit={handleAddressSubmit} isSubmitting={placing} />
          </div>

          {/* Order summary + Place order */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <OrderSummary
                subtotal={cartTotal}
                total={cartTotal}
                deliveryMessage="Standard delivery"
                primaryButtonLabel="Place order"
                onPrimaryAction={handlePlaceOrder}
                isPrimaryLoading={placing}
                primaryButtonDisabled={!address}
                secondaryButtonLabel="Back to cart"
                onSecondaryAction={() => router.push("/cart")}
              />
              {!address && (
                <p className="text-amazon-text-muted text-xs mt-2">
                  Fill in and save your delivery address to enable Place order.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
