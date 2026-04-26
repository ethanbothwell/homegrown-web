const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export type Role = "Farmer" | "Buyer";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: { id: string; email: string; name: string; role: Role };
}

export interface Farm {
  id: string;
  name: string;
  description?: string;
  location?: string;
  imageUrl?: string;
  practices: { id: string; name: string }[];
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

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

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
  register: (email: string, password: string, name: string, role: Role) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name, role }),
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
  create: (data: { name: string; description?: string; location?: string; imageUrl?: string }) =>
    request<Farm>("/api/farms", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<{ name: string; description: string; location: string; imageUrl: string }>) =>
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

// ─── Newsletter ───────────────────────────────────────────────────────────
export const newsletter = {
  subscribe: (email: string) =>
    request<{ success: boolean; duplicate: boolean }>("/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};
