const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type Role = "Farmer" | "Buyer";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: { id: string; email: string; name: string; role: Role };
  waitlistPosition?: number;
  remaining?: number;
  community?: string;
}

export interface CommunityStats {
  name: string;
  farmerCount: number;
  buyerCount: number;
  farmerTarget: number;
  buyerTarget: number;
  totalCount: number;
  totalTarget: number;
  unlocked: boolean;
}

export interface WaitlistStats {
  farmerCount: number;
  buyerCount: number;
  farmerTarget: number;
  buyerTarget: number;
  totalCount: number;
  totalTarget: number;
  unlocked: boolean;
  communities: CommunityStats[];
}

export interface Farm {
  id: string;
  name: string;
  bio?: string;
  philosophy?: string;
  location?: string;
  city?: string;
  state?: string;
  imageUrl?: string;
  rating: number;
  reviewCount: number;
  practices: { id: string; name: string }[];
  ownerName: string;
  ownerImageUrl?: string;
  subscriptionPlans: SubscriptionPlan[];
}

export interface SubscriptionPlan {
  id: string;
  farmId: string;
  farmName: string;
  name: string;
  description?: string;
  price: number;
  frequency: "Weekly" | "Biweekly" | "Monthly";
  maxSubscribers?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FarmSubscription {
  id: string;
  subscriptionPlanId: string;
  planName: string;
  farmName: string;
  price: number;
  frequency: "Weekly" | "Biweekly" | "Monthly";
  status: "Active" | "Paused" | "Cancelled";
  startDate: string;
  nextDeliveryDate: string;
  shippingAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

// Attempt a silent token refresh. Returns the new access token, or null if
// the refresh token is missing/expired.
async function silentRefresh(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data: AuthResponse = await res.json();
    localStorage.setItem("access_token", data.accessToken);
    localStorage.setItem("refresh_token", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data.accessToken;
  } catch {
    return null;
  }
}

function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const buildHeaders = (token: string | null): Record<string, string> => {
    const h: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (token) h["Authorization"] = `Bearer ${token}`;
    return h;
  };

  // First attempt
  let res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(getToken()),
  });

  // If 401, try refreshing once then retry
  if (res.status === 401) {
    const newToken = await silentRefresh();
    if (newToken) {
      res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: buildHeaders(newToken),
      });
    } else {
      clearSession();
      throw new Error("Session expired. Please sign in again.");
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Auth ──────────────────────────────────────────────────────────────────
export const auth = {
  register: (email: string, password: string, name: string, role: Role, community?: string) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name, role, community }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

// ─── Farms ────────────────────────────────────────────────────────────────
export const farms = {
  list: () => request<Farm[]>("/api/farms"),
  get: (id: string) => request<Farm>(`/api/farms/${id}`),
  getMine: () => request<Farm>("/api/farms/mine"),
  create: (data: { name: string; bio?: string; location?: string; imageUrl?: string }) =>
    request<Farm>("/api/farms", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<{ name: string; bio: string; location: string; imageUrl: string }>) =>
    request<Farm>(`/api/farms/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  addPractice: (farmId: string, name: string) =>
    request<{ id: string; name: string }>(`/api/farms/${farmId}/practices`, {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  removePractice: (farmId: string, practiceId: string) =>
    request<void>(`/api/farms/${farmId}/practices/${practiceId}`, { method: "DELETE" }),
};

// ─── Subscription Plans ───────────────────────────────────────────────────
export const subscriptionPlans = {
  listByFarm: (farmId: string) =>
    request<SubscriptionPlan[]>(`/api/farms/${farmId}/subscription-plans`),
  create: (
    farmId: string,
    data: {
      name: string;
      description?: string;
      price: number;
      frequency: "Weekly" | "Biweekly" | "Monthly";
      maxSubscribers?: number;
    }
  ) =>
    request<SubscriptionPlan>(`/api/farms/${farmId}/subscription-plans`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (
    id: string,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      frequency: "Weekly" | "Biweekly" | "Monthly";
      maxSubscribers: number;
      isActive: boolean;
    }>
  ) =>
    request<SubscriptionPlan>(`/api/subscription-plans/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deactivate: (id: string) =>
    request<void>(`/api/subscription-plans/${id}`, { method: "DELETE" }),
  subscribe: (planId: string, data: { shippingAddress?: string; notes?: string }) =>
    request<FarmSubscription>(`/api/subscription-plans/${planId}/subscribe`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ─── My Subscriptions ─────────────────────────────────────────────────────
export const mySubscriptions = {
  list: () => request<FarmSubscription[]>("/api/my/subscriptions"),
  pause: (id: string) =>
    request<FarmSubscription>(`/api/my/subscriptions/${id}/pause`, { method: "POST" }),
  cancel: (id: string) =>
    request<FarmSubscription>(`/api/my/subscriptions/${id}/cancel`, { method: "POST" }),
};

// ─── Checkout ─────────────────────────────────────────────────────────────
export const checkout = {
  createSession: (
    planId: string,
    successUrl: string,
    cancelUrl: string,
    opts?: { shippingAddress?: string; notes?: string }
  ) =>
    request<{ url: string }>("/api/checkout/session", {
      method: "POST",
      body: JSON.stringify({ planId, successUrl, cancelUrl, ...opts }),
    }),
};

export interface Product {
  id: string;
  farmId: string;
  farmName: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  unit?: string;
  imageUrl?: string;
  inStock: boolean;
  tags?: string;
}

// ─── Products ─────────────────────────────────────────────────────────────
export const products = {
  list: (params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
    sort?: string;
  }) => {
    const q = new URLSearchParams();
    if (params?.category)           q.set("category",    params.category);
    if (params?.minPrice != null)   q.set("minPrice",    String(params.minPrice));
    if (params?.maxPrice != null)   q.set("maxPrice",    String(params.maxPrice));
    if (params?.inStockOnly)        q.set("inStockOnly", "true");
    if (params?.sort)               q.set("sort",        params.sort);
    const qs = q.toString();
    return request<Product[]>(`/api/products${qs ? `?${qs}` : ""}`);
  },
  get:    (id: string) => request<Product>(`/api/products/${id}`),
  create: (data: {
    name: string; description?: string; category: string;
    price: number; unit?: string; imageUrl?: string; inStock?: boolean; tags?: string;
  }) => request<Product>("/api/products", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<{
    name: string; description: string; category: string;
    price: number; unit: string; imageUrl: string; inStock: boolean; tags: string;
  }>) => request<Product>(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/api/products/${id}`, { method: "DELETE" }),
};

// ─── Waitlist ─────────────────────────────────────────────────────────────
export const waitlist = {
  getStats: () => request<WaitlistStats>("/api/waitlist/stats"),
  getCommunityStats: (community: string) =>
    request<CommunityStats>(`/api/waitlist/stats/${encodeURIComponent(community)}`),
};

// ─── Newsletter ───────────────────────────────────────────────────────────
export const newsletter = {
  subscribe: (email: string) =>
    request<{ success: boolean; duplicate: boolean }>("/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};
