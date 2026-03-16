import { requestJson } from "./api";
import { getUserId } from "./cart";

function getWishlistHeaders(): HeadersInit {
  const userId = getUserId();
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (userId) (headers as Record<string, string>)["x-user-id"] = userId;
  return headers;
}

export async function fetchWishlist() {
  return requestJson(
    "/wishlist",
    { headers: getWishlistHeaders(), cache: "no-store" },
    "Unable to load wishlist."
  );
}

export async function addToWishlist(productId: string) {
  return requestJson(
    "/wishlist/items",
    {
      method: "POST",
      headers: getWishlistHeaders(),
      body: JSON.stringify({ productId }),
    },
    "Could not add to wishlist."
  );
}

export async function removeFromWishlist(productId: string) {
  return requestJson(
    `/wishlist/items/${productId}`,
    {
      method: "DELETE",
      headers: getWishlistHeaders(),
    },
    "Could not remove from wishlist."
  );
}
