"use client";

import { useState } from "react";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { cn } from "@/lib/utils";

export interface PurchaseBoxProps {
  price: string;
  originalPrice?: string | null;
  inStock: boolean;
  /** Max quantity (stock) */
  maxQuantity?: number;
  /** Delivery estimate text — if omitted, computed from current date */
  deliveryEstimate?: string;
  onAddToCart?: (quantity: number) => void;
  onBuyNow?: (quantity: number) => void;
  isAddingToCart?: boolean;
  className?: string;
}

/** Returns a string like "Fri, 20 Mar – Sun, 22 Mar" offset by startDays–endDays from today */
function getDeliveryRange(startDays = 3, endDays = 6): string {
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() + startDays);
  const end = new Date(now);
  end.setDate(now.getDate() + endDays);
  return `${DAYS[start.getDay()]}, ${start.getDate()} ${MONTHS[start.getMonth()]} – ${DAYS[end.getDay()]}, ${end.getDate()} ${MONTHS[end.getMonth()]}`;
}

export function PurchaseBox({
  price,
  originalPrice,
  inStock,
  maxQuantity = 10,
  deliveryEstimate,
  onAddToCart,
  onBuyNow,
  isAddingToCart = false,
  className,
}: PurchaseBoxProps) {
  const [quantity, setQuantity] = useState(1);
  const [giftWrap, setGiftWrap] = useState(false);
  const qty = Math.max(1, Math.min(maxQuantity, quantity));
  const delivery = deliveryEstimate ?? getDeliveryRange();

  return (
    <div
      className={cn(
        "border border-gray-200 rounded-lg p-4 bg-white shadow-sm transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card-hover",
        className
      )}
    >
      <div className="mb-3">
        <PriceDisplay price={price} originalPrice={originalPrice} size="lg" />
      </div>

      {/* FREE Delivery badge */}
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-xs font-bold text-white bg-green-600 px-1.5 py-0.5 rounded">
          FREE
        </span>
        <span className="text-sm text-amazon-text">
          Delivery <span className="font-medium">{delivery}</span>
        </span>
      </div>
      <p className="text-xs text-amazon-text-muted mb-1">
        Order within{" "}
        <span className="text-green-700 font-medium">
          {new Date().getHours() < 20 ? `${20 - new Date().getHours()} hrs` : "a few mins"}
        </span>{" "}
        to get it by the earliest date
      </p>

      <p className={cn("text-sm font-medium mb-3", inStock ? "text-green-700" : "text-red-600")}>
        {inStock ? "In Stock" : "Currently unavailable"}
      </p>

      {inStock && (
        <>
          {/* Qty selector */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-amazon-text">Qty:</span>
            <select
              value={qty}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm text-amazon-text bg-amazon-background cursor-pointer transition-colors duration-200 hover:border-amazon-orange-dark"
              aria-label="Quantity"
            >
              {Array.from({ length: Math.min(maxQuantity, 10) }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Action buttons — exact Amazon India colors */}
          <div className="flex flex-col gap-2 mb-3">
            <button
              type="button"
              onClick={() => onAddToCart?.(qty)}
              disabled={isAddingToCart}
              className="w-full py-2 px-4 rounded-full text-sm font-medium bg-amazon-orange hover:bg-amber-300 text-amazon-nav-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? "Adding…" : "Add to Cart"}
            </button>
            <button
              type="button"
              onClick={() => onBuyNow?.(qty)}
              disabled={isAddingToCart}
              className="w-full py-2 px-4 rounded-full text-sm font-medium bg-amazon-orange-dark hover:bg-orange-500 text-white transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>

          {/* Gift wrap */}
          <label className="flex items-center gap-2 text-xs text-amazon-text cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={giftWrap}
              onChange={(e) => setGiftWrap(e.target.checked)}
              className="accent-amazon-orange-dark"
            />
            Add gift wrap (₹50)
          </label>

          {/* Secure transaction */}
          <div className="flex items-center gap-1.5 text-xs text-amazon-text-muted border-t border-gray-100 pt-3">
            <LockIcon className="w-3.5 h-3.5 shrink-0" />
            <span>
              <span className="font-medium text-amazon-text">Secure transaction</span> — your
              info is protected
            </span>
          </div>
        </>
      )}
    </div>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  );
}
