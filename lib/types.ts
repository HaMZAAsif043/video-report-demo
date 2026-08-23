// ─── User & Auth ────────────────────────────────────────────
export type UserRole = "contributor" | "admin";
export type AccountStatus = "active" | "frozen" | "suspended";

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  nid_or_address: string;
  role: UserRole;
  account_status: AccountStatus;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

// ─── Video ──────────────────────────────────────────────────
export type VideoStatus = "pending" | "approved" | "rejected";

export interface Video {
  id: number;
  title: string;
  description: string;
  file: string;
  duration_seconds: number;
  category: string;
  location: string;
  recorded_date: string | null;
  is_claimed_exclusive: boolean;
  status: VideoStatus;
  rejection_reason: string;
  uploaded_at: string;
  reviewed_at: string | null;
  contributor: number;
  contributor_name: string;
  accepted_terms: boolean;
}

export interface VideoUsage {
  id: number;
  video: number;
  used_seconds: number;
  marked_by: number;
  marked_at: string;
}

// ─── Payment ────────────────────────────────────────────────
export type PaymentStatus = "pending" | "paid" | "locked";

export interface Payment {
  id: number;
  contributor: number;
  video: number;
  video_title: string;
  used_seconds: number;
  rate_applied: string;
  amount: string;
  status: PaymentStatus;
  approval_date: string;
  due_date: string;
  paid_date: string | null;
}

// ─── Exclusive Request ──────────────────────────────────────
export type ExclusiveStatus = "pending" | "approved" | "rejected";

export interface ExclusiveRequest {
  id: number;
  video: number;
  video_title: string;
  contributor: number;
  reason: string;
  status: ExclusiveStatus;
  admin_note: string;
  requested_at: string;
  resolved_at: string | null;
}

// ─── Violation ──────────────────────────────────────────────
export type ViolationAction = "warning" | "payment_lock" | "account_suspend";

export interface Violation {
  id: number;
  contributor: number;
  contributor_name: string;
  video: number | null;
  violation_type: string;
  description: string;
  flagged_by: number;
  flagged_by_name: string;
  flagged_at: string;
  action_taken: ViolationAction;
}

// ─── Freeze Log ─────────────────────────────────────────────
export interface FreezeLog {
  id: number;
  contributor: number;
  contributor_name: string;
  reason: string;
  rejected_request_count: number;
  frozen_at: string;
  unfrozen_at: string | null;
  unfrozen_by: number | null;
}

// ─── Admin Dashboard ────────────────────────────────────────
export interface AdminDashboardData {
  total_contributors: number;
  pending_videos: number;
  monthly_payment_outflow: number;
  frozen_accounts: number;
  suspended_accounts: number;
  overdue_payments: number;
  due_soon_payments: number;
  exclusive_stats: {
    total_exclusive_videos: number;
    total_exclusive_requests: number;
    pending_exclusive_requests: number;
    approved_exclusive_requests: number;
    rejected_exclusive_requests: number;
  };
}

// ─── Admin Contributor Detail ───────────────────────────────
export interface AdminContributorDetail {
  user: User;
  stats: {
    total_videos: number;
    approved_videos: number;
    pending_videos: number;
    rejected_videos: number;
    total_earnings: number;
    pending_payments: number;
    exclusive_requests: number;
    violations: number;
  };
  recent_videos: { id: number; title: string; status: string; uploaded_at: string }[];
  recent_payments: { id: number; amount: number; status: string; due_date: string }[];
}

// ─── API Paginated Response ─────────────────────────────────
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
