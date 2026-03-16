import { ApiError, requestJson } from "@/lib/api";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: { page?: number; limit?: number; total?: number };
  error?: { code: string; message: string };
}

export interface ProductListResponse {
  data: Array<{
    id: string;
    title: string;
    description: string | null;
    price: string;
    originalPrice?: string | null;
    discountPercentage?: string | null;
    rating?: string | null;
    reviewCount?: number | null;
    stock: number;
    categoryId: string;
    category?: { id: string; name: string; slug: string };
    images?: Array<{ id: string; imageUrl: string }>;
  }>;
}

export async function fetchProducts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}): Promise<ProductListResponse["data"]> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);
  const q = searchParams.toString();
  const path = params?.category
    ? `/products/category/${params.category}`
    : "/products";
  return requestJson<ProductListResponse["data"]>(
    `${path}${q ? `?${q}` : ""}`,
    undefined,
    "Unable to load products right now."
  );
}

export type ProductDetail = ProductListResponse["data"][0] & {
  description?: string | null;
};

export async function fetchProductById(id: string): Promise<ProductDetail | null> {
  try {
    return await requestJson<ProductDetail>(
      `/products/${id}`,
      undefined,
      "Unable to load product details."
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
