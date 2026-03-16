"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { EmptyState, ErrorState, OrderConfirmationSkeleton } from "@/components/ui";
import { getErrorMessage } from "@/lib/api";
import { fetchOrderById } from "@/lib/orders";
import type { AddressFormData } from "@/types";

function getOrderAddress(orderId: string): AddressFormData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`order_${orderId}_address`);
    if (!raw) return null;
    return JSON.parse(raw) as AddressFormData;
  } catch {
    return null;
  }
}

function formatDeliveryDate(createdAt: string): string {
  const d = new Date(createdAt);
  d.setDate(d.getDate() + 4);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatAddress(addr: AddressFormData): string {
  const cityState = [addr.city, addr.state].filter(Boolean).join(", ");
  const lastLine = [cityState, addr.pincode].filter(Boolean).join(" - ");
  const lines = [addr.name, addr.phone, addr.street, lastLine].filter(Boolean);
  return lines.join("\n");
}

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: string;
  product: { id: string; title: string; image: string | null };
}

interface OrderData {
  id: string;
  totalAmount: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!id);

  const loadOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const d = await fetchOrderById(id);
      setOrder({
        id: d.id,
        totalAmount: d.totalAmount,
        status: d.status,
        createdAt: d.createdAt,
        items: d.items ?? [],
      });
    } catch (error) {
      setOrder(null);
      setError(getErrorMessage(error, "Could not load your order details."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    void loadOrder();
  }, [id, loadOrder]);

  const address = id ? getOrderAddress(id) : null;

  if (!id) {
    return (
      <div className="min-h-screen bg-amazon-background flex items-center justify-center px-4">
        <p className="text-amazon-text-muted">Invalid order.</p>
      </div>
    );
  }

  if (loading) {
    return <OrderConfirmationSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amazon-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <ErrorState
            title="We couldn't load your order"
            description={error}
            onRetry={() => {
              void loadOrder();
            }}
            homeHref="/"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amazon-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-amazon-card-bg rounded shadow-card overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-amazon-text text-xl font-semibold mb-1">
              Order placed successfully
            </h1>
            <p className="text-amazon-text-muted text-sm">
              Order ID: <span className="font-mono text-amazon-text">{id}</span>
            </p>
          </div>

          {order ? (
            <div className="flex flex-col gap-0 border-t-0 p-0 m-0 border-transparent divide-y divide-gray-200">
              
              {/* Order Tracking Bar */}
              <section className="p-6 bg-white shrink">
                <div className="mb-8">
                  <h2 className="text-xl font-medium text-amazon-text mb-2">
                    {order.status === "DELIVERED" ? "Delivered" : "Arriving soon"}
                  </h2>
                  <p className="text-sm text-green-700">Your package is on the way</p>
                </div>
                
                <div className="relative max-w-2xl mx-auto">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
                    <div style={{ width: "25%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600"></div>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-gray-500 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-green-600 mb-1 absolute -top-7"></div>
                      <span className="text-green-700 font-bold">Ordered</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-gray-300 mb-1 absolute -top-7"></div>
                      <span>Shipped</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-gray-300 mb-1 absolute -top-7"></div>
                      <span>Out for delivery</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-gray-300 mb-1 absolute -top-7"></div>
                      <span>Arriving</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Products purchased */}
              <section className="p-6">
                <h2 className="text-amazon-text font-semibold mb-3">
                  Products purchased
                </h2>
                <ul className="space-y-3">
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-3 p-3 rounded bg-amazon-background"
                    >
                      <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden bg-white">
                        <Image
                          src={
                            item.product.image ??
                            "https://via.placeholder.com/64?text=No+Image"
                          }
                          alt={item.product.title}
                          fill
                          className="object-contain"
                          sizes="64px"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-amazon-text text-sm font-medium line-clamp-2">
                          {item.product.title}
                        </p>
                        <p className="text-amazon-text-muted text-xs mt-0.5">
                          Qty: {item.quantity} × ₹
                          {Number(item.price).toLocaleString("en-IN")} = ₹
                          {(
                            Number(item.price) * item.quantity
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Delivery address */}
              <section className="p-6">
                <h2 className="text-amazon-text font-semibold mb-2">
                  Delivery address
                </h2>
                {address ? (
                  <p className="text-amazon-text text-sm whitespace-pre-line">
                    {formatAddress(address)}
                  </p>
                ) : (
                  <p className="text-amazon-text-muted text-sm">
                    Delivery address not saved with this order.
                  </p>
                )}
              </section>

              {/* Total & estimated delivery */}
              <section className="p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-amazon-text-muted">Total price</span>
                  <span className="text-amazon-text font-semibold text-lg">
                    ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-amazon-text-muted">
                    Estimated delivery
                  </span>
                  <span className="text-amazon-text font-medium">
                    {formatDeliveryDate(order.createdAt)}
                  </span>
                </div>
                <p className="text-amazon-text-muted text-xs pt-1">
                  Status: {order.status}
                </p>
              </section>
            </div>
          ) : (
            <div className="p-6">
              <EmptyState
                title="Order details unavailable"
                description="We couldn't find the details for this order. It may no longer be available for this account."
                actionHref="/"
                actionLabel="Continue shopping"
                compact
              />
            </div>
          )}

          <div className="p-6 border-t border-gray-200 bg-amazon-background">
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-amazon-orange-dark text-white rounded font-medium hover:bg-amber-600"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
