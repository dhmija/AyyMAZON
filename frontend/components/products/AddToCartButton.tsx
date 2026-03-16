"use client";

import { useState } from "react";
import { toast } from "sonner";
import { addCartItem } from "@/lib/cart";
import { getErrorMessage } from "@/lib/api";

interface AddToCartButtonProps {
  productId: string;
  maxQuantity?: number;
}

export function AddToCartButton({ productId, maxQuantity = 1 }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAdd = async () => {
    setLoading(true);
    try {
      await addCartItem(productId, quantity);
      toast.success("Added to cart");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to add to cart"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {maxQuantity > 1 && (
        <label className="text-sm font-medium flex items-center gap-2">
          Quantity:
          <select 
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-amazon-orange"
            disabled={loading}
          >
            {Array.from({ length: Math.min(10, maxQuantity) }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </label>
      )}
      
      <button
        onClick={handleAdd}
        disabled={loading}
        className="w-full py-2 px-4 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] border-none text-amazon-text text-sm transition-colors disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>

      <button
        onClick={handleAdd}
        disabled={loading}
        className="w-full py-2 px-4 rounded-full bg-[#FFA41C] hover:bg-[#FA8900] active:bg-[#EA7700] border-none text-amazon-text text-sm transition-colors disabled:opacity-50"
      >
        Buy Now
      </button>
    </div>
  );
}
