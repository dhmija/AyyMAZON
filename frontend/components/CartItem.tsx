"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import type { CartItem as CartItemType } from "@/types";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface CartItemProps {
  item: CartItemType;
  /** Called when quantity is updated (new quantity or 0 to remove) */
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  /** Called when remove is clicked */
  onRemove?: (productId: string) => void;
  /** Show loading state for update/remove */
  isUpdating?: boolean;
  className?: string;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
  className,
}: CartItemProps) {
  const imageUrl =
    item.product.image ??
    "https://via.placeholder.com/160x160?text=No+Image";

  const handleSaveForLater = () => {
    toast.success("Saved for later!", { description: item.product.title });
  };

  return (
    <div
      className={cn(
        "flex gap-4 p-4 bg-amazon-card-bg rounded shadow-card transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card-hover",
        className
      )}
    >
      {/* Product image */}
      <Link href={`/products/${item.productId}`} className="shrink-0">
        <div className="relative w-24 h-24 rounded overflow-hidden bg-amazon-background hover:opacity-90 transition-opacity">
          <Image
            src={imageUrl}
            alt={item.product.title}
            fill
            className="object-contain"
            sizes="96px"
            unoptimized
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        {/* Clickable title */}
        <Link href={`/products/${item.productId}`} className="group">
          <h3 className="text-amazon-text font-medium text-sm line-clamp-2 group-hover:text-amazon-link-blue transition-colors duration-200">
            {item.product.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-1">
          <PriceDisplay price={item.product.price} size="sm" />
        </div>

        {/* In stock badge */}
        <p className="text-xs text-green-700 font-medium mt-1">
          {item.product.stock > 0 ? "In Stock" : "Out of stock"}
        </p>

        {/* Controls */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {onUpdateQuantity && (
            <div className="flex items-center border border-amazon-nav-mid rounded overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  onUpdateQuantity(item.productId, Math.max(0, item.quantity - 1))
                }
                disabled={isUpdating || item.quantity <= 1}
                className="w-8 h-8 flex items-center justify-center bg-amazon-background hover:bg-gray-200 disabled:opacity-50 text-amazon-text transition-colors duration-200"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span
                className="w-8 h-8 flex items-center justify-center text-sm font-medium bg-white border-x border-amazon-nav-mid"
                aria-live="polite"
              >
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  onUpdateQuantity(item.productId, item.quantity + 1)
                }
                disabled={
                  isUpdating || item.quantity >= item.product.stock
                }
                className="w-8 h-8 flex items-center justify-center bg-amazon-background hover:bg-gray-200 disabled:opacity-50 text-amazon-text transition-colors duration-200"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}

          {/* Separator */}
          <span className="text-gray-300 text-sm">|</span>

          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.productId)}
              disabled={isUpdating}
              className="text-amazon-link-blue"
            >
              Delete
            </Button>
          )}

          <span className="text-gray-300 text-sm">|</span>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveForLater}
            disabled={isUpdating}
            className="text-amazon-link-blue"
          >
            Save for later
          </Button>
        </div>
      </div>

      {/* Line total */}
      <div className="text-right shrink-0">
        <p className="text-amazon-text font-semibold text-sm">
          ₹{(Number(item.product.price) * item.quantity).toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}
