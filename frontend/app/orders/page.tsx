"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchOrders } from "@/lib/orders";
import type { Order } from "@/types";
import { getErrorMessage } from "@/lib/api";
import { ErrorState, EmptyState } from "@/components/ui";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrders();
      setOrders(data || []);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load your orders."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-amazon-background py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-amazon-text text-2xl font-semibold mb-6">Your Orders</h1>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-white border border-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amazon-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <ErrorState
            title="We couldn't load your orders"
            description={error}
            onRetry={() => {
              void loadOrders();
            }}
            homeHref="/"
          />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-amazon-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <EmptyState
            title="You don't have any orders yet"
            description="When you place orders, they will appear here."
            actionHref="/"
            actionLabel="Start shopping"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amazon-background py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-amazon-text text-3xl font-medium mb-6">Your Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => {
            const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
            return (
              <div key={order.id} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex flex-wrap gap-x-8 gap-y-4 items-center justify-between text-sm text-amazon-text-muted">
                  <div className="flex gap-8">
                    <div>
                      <div className="uppercase mb-1">Order Placed</div>
                      <div className="text-amazon-text">{date}</div>
                    </div>
                    <div>
                      <div className="uppercase mb-1">Total</div>
                      <div className="text-amazon-text">₹{order.totalAmount}</div>
                    </div>
                    <div>
                      <div className="uppercase mb-1">Dispatch To</div>
                      <div className="text-amazon-link-blue hover:underline cursor-pointer">
                        Amazon Customer
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="uppercase mb-1">Order # {order.id.slice(-8).toUpperCase()}</div>
                    <div className="flex gap-2 text-amazon-link-blue">
                      <Link href={`/orders/${order.id}`} className="hover:underline">
                        View order details
                      </Link>
                      <span className="text-gray-300">|</span>
                      <Link href="#" className="hover:underline">
                        Invoice
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 space-y-4">
                  <div className="text-lg font-medium text-amazon-text mb-4">
                    {order.status === "DELIVERED" ? "Delivered" : "Arriving soon"}
                  </div>
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-24 h-24 flex-shrink-0 relative rounded-md overflow-hidden bg-white border border-gray-100">
                        {item.product?.images?.[0]?.imageUrl ? (
                          <Image
                            src={item.product.images[0].imageUrl}
                            alt={item.product?.title || "Product"}
                            fill
                            className="object-contain p-1"
                            sizes="96px"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No image</div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <Link href={`/products/${item.productId}`} className="text-base text-amazon-link-blue hover:text-amazon-orange-dark hover:underline font-medium line-clamp-2">
                          {item.product?.title}
                        </Link>
                        <div className="text-sm text-amazon-text mt-1 flex gap-2">
                          <button className="bg-amazon-button-secondary-bg hover:bg-amazon-button-secondary-hover mt-3 px-3 py-1 rounded-full border border-gray-300 text-amazon-text text-sm shadow-sm">
                            Buy it again
                          </button>
                          <Link href={`/products/${item.productId}`} className="bg-white hover:bg-gray-50 mt-3 px-3 py-1 rounded-full border border-gray-300 text-amazon-text text-sm shadow-sm">
                            View your item
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
