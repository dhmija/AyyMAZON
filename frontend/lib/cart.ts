import { requestJson } from "@/lib/api";

const USER_ID_KEY = "amazon_clone_user_id";

/** Get user ID for cart/orders (e.g. from auth). For demo, use stored or generate. */
export function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = "demo-user-" + Math.random().toString(36).slice(2, 11);
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

function cartHeaders(): HeadersInit {
  const userId = getUserId();
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (userId) (headers as Record<string, string>)["x-user-id"] = userId;
  return headers;
}

export interface CartResponse {
  success: boolean;
  data?: {
    id: string;
    userId: string;
    items: Array<{
      id: string;
      productId: string;
      quantity: number;
      product: {
        id: string;
        title: string;
        description?: string | null;
        price: string;
        stock: number;
        category: { id: string; name: string; slug: string };
        image: string | null;
      };
    }>;
    totalAmount: string;
  };
}

export async function fetchCart(): Promise<CartResponse["data"] | null> {
  return requestJson<CartResponse["data"]>(
    "/cart",
    { headers: cartHeaders() },
    "Unable to load your cart."
  );
}

export async function addCartItem(
  productId: string,
  quantity: number
): Promise<CartResponse["data"]> {
  return requestJson<CartResponse["data"]>(
    "/cart/add",
    {
      method: "POST",
      headers: cartHeaders(),
      body: JSON.stringify({ productId, quantity }),
    },
    "Could not add this item to your cart."
  );
}

export async function updateCartItem(
  productId: string,
  quantity: number
): Promise<CartResponse["data"] | null> {
  return requestJson<CartResponse["data"]>(
    "/cart/update",
    {
      method: "PATCH",
      headers: cartHeaders(),
      body: JSON.stringify({ productId, quantity }),
    },
    "Could not update this cart item."
  );
}

export async function removeCartItem(productId: string): Promise<CartResponse["data"] | null> {
  return requestJson<CartResponse["data"]>(
    "/cart/remove",
    {
      method: "DELETE",
      headers: cartHeaders(),
      body: JSON.stringify({ productId }),
    },
    "Could not remove this item from your cart."
  );
}
