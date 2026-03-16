"use client";

import { useState } from "react";
import { toast } from "sonner";

export function AddToListButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      // API call will be implemented later
      await new Promise(r => setTimeout(r, 500));
      toast.success("1 item added to Wish List");
    } catch (e) {
      toast.error("Failed to add to list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className="w-full text-left text-sm py-1.5 px-3 border border-gray-300 rounded shadow-sm bg-gray-50 hover:bg-gray-100 disabled:opacity-50 mt-3"
    >
      {loading ? "Adding..." : "Add to Wish List"}
    </button>
  );
}
