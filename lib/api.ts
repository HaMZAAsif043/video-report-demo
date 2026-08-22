import { AuthTokens } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Token Management ───────────────────────────────────────
function getTokens(): AuthTokens | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("tokens");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveTokens(tokens: AuthTokens) {
  localStorage.setItem("tokens", JSON.stringify(tokens));
}

export function clearTokens() {
  localStorage.removeItem("tokens");
  localStorage.removeItem("user");
}

export function getAccessToken(): string | null {
  return getTokens()?.access || null;
}

// ─── User Cache ─────────────────────────────────────────────
export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function storeUser(user: unknown) {
  localStorage.setItem("user", JSON.stringify(user));
}

// ─── Refresh Token ──────────────────────────────────────────
async function refreshAccessToken(): Promise<string | null> {
  const tokens = getTokens();
  if (!tokens?.refresh) return null;

  try {
    const res = await fetch(`${API_BASE}/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: tokens.refresh }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const newTokens = { access: data.access, refresh: data.refresh || tokens.refresh };
    saveTokens(newTokens);
    return newTokens.access;
  } catch {
    return null;
  }
}

// ─── Core Fetch Helper ──────────────────────────────────────
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers = new Headers(options.headers);

  const token = getAccessToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let res = await fetch(url, { ...options, headers });

  // Try token refresh on 401
  if (res.status === 401 && token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      res = await fetch(url, { ...options, headers });
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = body.detail || body.non_field_errors?.[0] || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Auth API ───────────────────────────────────────────────
export const authApi = {
  login(email: string, password: string) {
    return apiFetch<{ access: string; refresh: string }>(
      "/api/token/",
      { method: "POST", body: JSON.stringify({ username: email, password }) }
    );
  },
  register(data: {
    username: string;
    email: string;
    phone: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
    nid_or_address?: string;
  }) {
    return apiFetch("/api/auth/register/", { method: "POST", body: JSON.stringify(data) });
  },
  getProfile() {
    return apiFetch<import("./types").User>("/api/auth/profile/");
  },
  updateProfile(data: Partial<import("./types").User>) {
    return apiFetch<import("./types").User>("/api/auth/profile/", { method: "PATCH", body: JSON.stringify(data) });
  },
  changePassword(old_password: string, new_password: string) {
    return apiFetch("/api/auth/change-password/", { method: "POST", body: JSON.stringify({ old_password, new_password }) });
  },
};

// ─── Video API ──────────────────────────────────────────────
export const videoApi = {
  upload(formData: FormData) {
    return apiFetch<{ id: number }>("/api/videos/upload/", { method: "POST", body: formData });
  },
  getMyVideos() {
    return apiFetch<import("./types").PaginatedResponse<import("./types").Video>>("/api/videos/my/");
  },
  getVideo(id: number) {
    return apiFetch<import("./types").Video>(`/api/videos/${id}/`);
  },
  getPendingVideos() {
    return apiFetch<import("./types").PaginatedResponse<import("./types").Video>>("/api/videos/admin/pending/");
  },
  getAllVideos(status?: string) {
    const q = status ? `?status=${status}` : "";
    return apiFetch<import("./types").PaginatedResponse<import("./types").Video>>(`/api/videos/admin/all/${q}`);
  },
  approveVideo(id: number, used_seconds: number) {
    return apiFetch(`/api/videos/admin/${id}/action/`, {
      method: "POST",
      body: JSON.stringify({ action: "approve", used_seconds }),
    });
  },
  rejectVideo(id: number, reason: string) {
    return apiFetch(`/api/videos/admin/${id}/action/`, {
      method: "POST",
      body: JSON.stringify({ action: "reject", reason }),
    });
  },
};

// ─── Payment API ────────────────────────────────────────────
export const paymentApi = {
  getMyPayments() {
    return apiFetch<import("./types").PaginatedResponse<import("./types").Payment>>("/api/payments/my/");
  },
  getPendingPayments(overdue?: boolean, dueSoon?: boolean) {
    const params = new URLSearchParams();
    if (overdue) params.set("overdue", "true");
    if (dueSoon) params.set("due_soon", "true");
    const q = params.toString() ? `?${params}` : "";
    return apiFetch<import("./types").PaginatedResponse<import("./types").Payment>>(`/api/payments/admin/pending/${q}`);
  },
  processPayment(id: number) {
    return apiFetch(`/api/payments/${id}/process/`, { method: "POST", body: JSON.stringify({}) });
  },
  lockPayment(id: number) {
    return apiFetch(`/api/payments/${id}/lock/`, { method: "POST", body: JSON.stringify({}) });
  },
};

// ─── Exclusive Request API ──────────────────────────────────
export const exclusiveApi = {
  create(videoId: number, reason: string) {
    return apiFetch("/api/payments/exclusive/request/", {
      method: "POST",
      body: JSON.stringify({ video: videoId, reason }),
    });
  },
  getMyRequests() {
    return apiFetch<import("./types").PaginatedResponse<import("./types").ExclusiveRequest>>("/api/payments/exclusive/my/");
  },
  getAdminRequests(status?: string) {
    const q = status ? `?status=${status}` : "";
    return apiFetch<import("./types").PaginatedResponse<import("./types").ExclusiveRequest>>(`/api/payments/admin/exclusive/${q}`);
  },
  adminAction(id: number, action: "approve" | "reject", note?: string) {
    return apiFetch(`/api/payments/admin/exclusive/${id}/action/`, {
      method: "POST",
      body: JSON.stringify({ action, note: note || "" }),
    });
  },
};

// ─── Violation API ──────────────────────────────────────────
export const violationApi = {
  getMyViolations() {
    return apiFetch<import("./types").PaginatedResponse<import("./types").Violation>>("/api/violations/my/");
  },
  getAllViolations() {
    return apiFetch<import("./types").PaginatedResponse<import("./types").Violation>>("/api/violations/admin/all/");
  },
  flagViolation(data: {
    contributor_id: number;
    video_id?: number;
    violation_type: string;
    description: string;
    action_taken: string;
  }) {
    return apiFetch("/api/violations/admin/flag/", { method: "POST", body: JSON.stringify(data) });
  },
};

// ─── Password Reset API ─────────────────────────────────────
export const passwordResetApi = {
  requestCode(email: string) {
    return apiFetch<{ detail: string; otp_code?: string }>("/api/auth/request-password-reset/", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
  resetPassword(email: string, code: string, newPassword: string) {
    return apiFetch<{ detail: string }>("/api/auth/reset-password/", {
      method: "POST",
      body: JSON.stringify({ email, code, new_password: newPassword }),
    });
  },
};

// ─── Admin API ──────────────────────────────────────────────
export const adminApi = {
  getDashboard() {
    return apiFetch<import("./types").AdminDashboardData>("/api/auth/admin/dashboard/");
  },
  getUsers(status?: string) {
    const q = status ? `?status=${status}` : "";
    return apiFetch<import("./types").PaginatedResponse<import("./types").User>>(`/api/auth/admin/users/${q}`);
  },
  getContributorDetail(id: number) {
    return apiFetch<import("./types").AdminContributorDetail>(`/api/auth/admin/users/${id}/detail/`);
  },
  updateUser(id: number, data: { account_status?: string }) {
    return apiFetch(`/api/auth/admin/users/${id}/`, { method: "PATCH", body: JSON.stringify(data) });
  },
  unfreezeUser(id: number) {
    return apiFetch(`/api/payments/admin/unfreeze/${id}/`, { method: "POST", body: JSON.stringify({}) });
  },
  getFreezeLogs() {
    return apiFetch<import("./types").PaginatedResponse<import("./types").FreezeLog>>("/api/payments/admin/freeze-logs/");
  },
};
