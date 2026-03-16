"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchWishlist, removeFromWishlist } from "@/lib/wishlist";
import { addCartItem } from "@/lib/cart";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const data: any = await fetchWishlist();
      if (data && data.items) {
        setWishlistItems(data.items);
      }
    } catch (e) {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      setWishlistItems(wishlistItems.filter(item => item.product.id !== productId));
      toast.success("Removed from wishlist");
    } catch (e) {
      toast.error("Failed to remove item");
    }
  };

  const handleMoveToCart = async (productId: string) => {
    try {
      await addCartItem(productId, 1);
      await handleRemove(productId);
      toast.success("Moved to cart");
      router.push("/cart");
    } catch (e) {
      toast.error("Failed to move to cart");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-[50vh]">
        <h1 className="text-3xl font-normal text-amazon-text mb-6">Your Lists</h1>
        <div className="animate-pulse space-y-4">
           {/* Skeleton Loader */}
           <div className="bg-gray-200 h-24 w-full rounded"></div>
           <div className="bg-gray-200 h-24 w-full rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-10">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-6">
          <h1 className="text-3xl font-medium text-amazon-text">Your Lists</h1>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border border-gray-200 rounded">
            <h2 className="text-xl font-medium mb-2">Your Wish List is empty</h2>
            <p className="text-sm text-gray-500 mb-6">Explore today's deals and add items to your list.</p>
            <Link href="/" className="bg-[#FFD814] hover:bg-[#F7CA00] text-black px-6 py-2 rounded-full border border-[#FCD200] shadow-sm text-sm">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
             <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
               <h2 className="font-semibold text-amazon-text">Wish List ({wishlistItems.length} items)</h2>
             </div>
             <ul className="divide-y divide-gray-200">
                {wishlistItems.map((item) => (
                  <li key={item.id} className="p-4 flex flex-col sm:flex-row gap-6 hover:bg-gray-50 transition-colors">
                     <Link href={`/products/${item.product.id}`} className="shrink-0 w-32 h-32 relative bg-white border border-gray-100 rounded">
                       <Image 
                         src={item.product.images?.[0]?.imageUrl || "https://dummyjson.com/image/400x400"}
                         alt={item.product.title}
                         fill
                         className="object-contain p-2 mix-blend-multiply"
                       />
                     </Link>
                     <div className="flex-1">
                        <Link href={`/products/${item.product.id}`} className="text-lg font-medium text-amazon-link-blue hover:text-amazon-orange hover:underline line-clamp-2">
                          {item.product.title}
                        </Link>
                        <div className="text-xl font-medium text-amazon-text mt-2">
                           ₹{item.product.price}
                        </div>
                        {item.product.stock > 0 ? (
                           <div className="text-sm text-green-700 mt-1 font-medium">In Stock</div>
                        ) : (
                           <div className="text-sm text-red-700 mt-1 font-medium">Out of Stock</div>
                        )}
                        
                        <div className="mt-4 flex flex-wrap gap-3">
                           <button 
                             onClick={() => handleMoveToCart(item.product.id)}
                             disabled={item.product.stock <= 0}
                             className="bg-white hover:bg-gray-50 text-xs py-1.5 px-3 border border-gray-300 rounded shadow-sm disabled:opacity-50"
                           >
                             Add to Cart
                           </button>
                           <button 
                             onClick={() => handleRemove(item.product.id)}
                             className="text-amazon-link-blue hover:underline text-xs py-1.5"
                           >
                             Delete
                           </button>
                        </div>
                     </div>
                  </li>
                ))}
             </ul>
          </div>
        )}
      </div>
    </div>
  );
}
