import type {
  ApiSuccess,
  Cart,
  CategorySalesRow,
  DailyRevenueRow,
  Order,
  Product,
  TopSpenderRow,
} from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

const getStoredToken = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("token");
};

const buildHeaders = (init?: HeadersInit, auth?: boolean) => {
  const headers = new Headers(init);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (auth) {
    const token = getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return headers;
};

const parseJson = async (res: Response) => {
  const text = await res.text();
  if (!text) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
};

export const registerRequest = async (body: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });
  const json = await parseJson(res);
  if (!res.ok) {
    throw new Error((json as { error?: string }).error || "Registration failed");
  }
  return json as ApiSuccess<{
    token: string;
    user: { id: number; name: string; email: string };
  }>;
};

export const loginRequest = async (body: { email: string; password: string }) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });
  const json = await parseJson(res);
  if (!res.ok) {
    throw new Error((json as { error?: string }).error || "Login failed");
  }
  return json as ApiSuccess<{
    token: string;
    user: { id: number; name: string; email: string };
  }>;
};

export const fetchProducts = async (params: {
  page: number;
  limit?: number;
  search?: string;
}) => {
  const qs = new URLSearchParams();
  qs.set("page", String(params.page));
  qs.set("limit", String(params.limit ?? 10));
  if (params.search) {
    qs.set("search", params.search);
  }
  const res = await fetch(`${API_BASE}/products?${qs.toString()}`, {
    cache: "no-store",
  });
  const json = await parseJson(res);
  if (!res.ok) {
    throw new Error((json as { error?: string }).error || "Failed to load products");
  }
  return json as ApiSuccess<{
    items: Product[];
    total: number;
    page: number;
    limit: number;
  }>;
};

export const fetchProductById = async (id: string) => {
  const res = await fetch(`${API_BASE}/products/${id}`, { cache: "no-store" });
  const json = await parseJson(res);
  if (!res.ok) {
    throw new Error((json as { error?: string }).error || "Product not found");
  }
  return json as ApiSuccess<Product>;
};

export const createProductRequest = async (body: {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
}) => {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: buildHeaders(undefined, true),
    body: JSON.stringify(body),
  });
  const json = await parseJson(res);
  if (!res.ok) {
    throw new Error((json as { error?: string }).error || "Failed to create product");
  }
  return json as ApiSuccess<Product>;
};

export const fetchCart = async () => {
  const res = await fetch(`${API_BASE}/cart`, {
    headers: buildHeaders(undefined, true),
  });
  const json = await parseJson(res);
  if (!res.ok) {
    throw new Error((json as { error?: string }).error || "Failed to load cart");
  }
  return json as ApiSuccess<Cart>;
};

export const addCartItemRequest = async (body: {
  productId: string;
  quantity: number;
}) => {
  const res = await fetch(`${API_BASE}/cart/add`, {
    method: "POST",
    headers: buildHeaders(undefined, true),
    body: JSON.stringify(body),
  });
  const json = await parseJson(res);
  if (!res.ok) {
    throw new Error((json as { error?: string }).error || "Failed to update cart");
  }
  return json as ApiSuccess<Cart>;
};

export const removeCartItemRequest = async (productId: string) => {
  const res = await fetch(`${API_BASE}/cart/remove/${productId}`, {
    method: "DELETE",
    headers: buildHeaders(undefined, true),
  });
  const json = await parseJson(res);
  if (!res.ok) {
    throw new Error((json as { error?: string }).error || "Failed to remove item");
  }
  return json as ApiSuccess<Cart>;
};

export const clearCartRequest = async () => {
  const res = await fetch(`${API_BASE}/cart/clear`, {
    method: "DELETE",
    headers: buildHeaders(undefined, true),
  });
  const json = await parseJson(res);
  if (!res.ok) {
    throw new Error((json as { error?: string }).error || "Failed to clear cart");
  }
  return json as ApiSuccess<null>;
};

export const checkoutRequest = async () => {
  const res = await fetch(`${API_BASE}/orders/checkout`, {
    method: "POST",
    headers: buildHeaders(undefined, true),
    body: JSON.stringify({}),
  });
  const json = await parseJson(res);
  if (!res.ok) {
    throw new Error((json as { error?: string }).error || "Checkout failed");
  }
  return json as ApiSuccess<{ orderId: number }>;
};

export const fetchOrders = async () => {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: buildHeaders(undefined, true),
  });
  const json = await parseJson(res);
  if (!res.ok) {
    throw new Error((json as { error?: string }).error || "Failed to load orders");
  }
  return json as ApiSuccess<Order[]>;
};

export const fetchDailyRevenue = async () => {
  const res = await fetch(`${API_BASE}/reports/daily-revenue`, {
    headers: buildHeaders(undefined, true),
  });
  const json = await parseJson(res);
  if (!res.ok) {
    throw new Error((json as { error?: string }).error || "Failed to load report");
  }
  return json as ApiSuccess<DailyRevenueRow[]>;
};

export const fetchTopSpenders = async () => {
  const res = await fetch(`${API_BASE}/reports/top-spenders`, {
    headers: buildHeaders(undefined, true),
  });
  const json = await parseJson(res);
  if (!res.ok) {
    throw new Error((json as { error?: string }).error || "Failed to load report");
  }
  return json as ApiSuccess<TopSpenderRow[]>;
};

export const fetchCategorySales = async () => {
  const res = await fetch(`${API_BASE}/reports/category-sales`, {
    headers: buildHeaders(undefined, true),
  });
  const json = await parseJson(res);
  if (!res.ok) {
    throw new Error((json as { error?: string }).error || "Failed to load report");
  }
  return json as ApiSuccess<CategorySalesRow[]>;
};
