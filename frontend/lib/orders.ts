import type { Order } from "@/types";
import { requestJson } from "@/lib/api";

const USER_ID_KEY = "amazon_clone_user_id";

function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_ID_KEY);
}

function orderHeaders(): HeadersInit {
  const userId = getUserId();
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (userId) (headers as Record<string, string>)["x-user-id"] = userId;
  return headers;
}

export interface PlaceOrderResponse {
  success: boolean;
  data?: {
    id: string;
    userId: string;
    totalAmount: string;
    status: string;
    createdAt: string;
    items: unknown[];
  };
  error?: { code: string; message: string };
}

export async function placeOrder(userEmail?: string): Promise<PlaceOrderResponse["data"] | null> {
  const body = userEmail ? JSON.stringify({ email: userEmail }) : undefined;
  
  return requestJson<PlaceOrderResponse["data"]>(
    "/orders",
    {
      method: "POST",
      headers: orderHeaders(),
      body,
    },
    "Could not place your order."
  );
}

export async function fetchOrderById(orderId: string): Promise<Order> {
  return requestJson<Order>(
    `/orders/${orderId}`,
    {
      method: "GET",
      headers: orderHeaders(),
    },
    "Could not load your order details."
  );
}

export async function fetchOrders(): Promise<Order[]> {
  return requestJson<Order[]>(
    "/orders/user",
    {
      method: "GET",
      headers: orderHeaders(),
    },
    "Could not load your orders."
  );
}
