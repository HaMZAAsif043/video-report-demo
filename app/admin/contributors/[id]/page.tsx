"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch, adminApi } from "@/lib/api";
import { formatBDT, formatDate } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { AccountStatusBadge, VideoStatusBadge, PaymentStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import type { AdminContributorDetail } from "@/lib/types";
import AppShell from "@/components/layout/AppShell";

export default function ContributorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<AdminContributorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFreeze, setShowFreeze] = useState(false);
  const [showUnfreeze, setShowUnfreeze] = useState(false);
  const [showSuspend, setShowSuspend] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!params.id) return;
    apiFetch<AdminContributorDetail>(`/api/auth/admin/users/${params.id}/detail/`)
      .then(setData)
      .catch(() => router.push("/admin/contributors"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  const handleFreeze = async () => {
    if (!data) return;
    setActionLoading(true);
    try {
      await adminApi.updateUser(data.user.id, { account_status: "frozen" });
      setData({ ...data, user: { ...data.user, account_status: "frozen" } });
      setToast("Account frozen");
      setShowFreeze(false);
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnfreeze = async () => {
    if (!data) return;
    setActionLoading(true);
    try {
      await adminApi.unfreezeUser(data.user.id);
      setData({ ...data, user: { ...data.user, account_status: "active" } });
      setToast("Account unfrozen");
      setShowUnfreeze(false);
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!data) return;
    setActionLoading(true);
    try {
      await adminApi.updateUser(data.user.id, { account_status: "suspended" });
      setData({ ...data, user: { ...data.user, account_status: "suspended" } });
      setToast("Account suspended");
      setShowSuspend(false);
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <AppShell><div className="py-20 text-center text-sm text-muted">Loading...</div></AppShell>;
  if (!data) return null;

  const { user, stats, recent_videos, recent_payments } = data;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title={`${user.first_name} ${user.last_name}`}
          description={user.email}
          action={
            <Button variant="secondary" size="sm" onClick={() => router.push("/admin/contributors")}>
              &larr; Back
            </Button>
          }
        />

        {/* Status + Actions */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-white">
                {user.first_name?.[0] || user.username[0]}
              </div>
              <div>
                <p className="font-semibold">{user.first_name} {user.last_name}</p>
                <div className="flex items-center gap-2">
                  <AccountStatusBadge status={user.account_status} />
                  <span className="text-xs text-muted">Joined {formatDate(user.date_joined)}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {user.account_status === "active" && (
                <>
                  <Button variant="secondary" size="sm" onClick={() => setShowFreeze(true)}>Freeze Account</Button>
                  <Button variant="danger" size="sm" onClick={() => setShowSuspend(true)}>Suspend Account</Button>
                </>
              )}
              {user.account_status === "frozen" && (
                <Button size="sm" onClick={() => setShowUnfreeze(true)}>Unfreeze Account</Button>
              )}
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card><p className="text-xs text-muted">Total Videos</p><p className="text-2xl font-bold">{stats.total_videos}</p></Card>
          <Card><p className="text-xs text-muted">Approved</p><p className="text-2xl font-bold text-success">{stats.approved_videos}</p></Card>
          <Card><p className="text-xs text-muted">Total Earnings</p><p className="text-2xl font-bold">{formatBDT(stats.total_earnings)}</p></Card>
          <Card><p className="text-xs text-muted">Pending Payments</p><p className="text-2xl font-bold text-warning">{formatBDT(stats.pending_payments)}</p></Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Videos */}
          <Card>
            <h3 className="mb-3 text-sm font-semibold">Recent Videos</h3>
            {recent_videos.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted">No videos</p>
            ) : (
              <div className="space-y-2">
                {recent_videos.map((v) => (
                  <div key={v.id} className="flex items-center justify-between rounded-lg p-2">
                    <span className="text-sm">{v.title}</span>
                    <VideoStatusBadge status={v.status} />
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Payments */}
          <Card>
            <h3 className="mb-3 text-sm font-semibold">Recent Payments</h3>
            {recent_payments.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted">No payments</p>
            ) : (
              <div className="space-y-2">
                {recent_payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg p-2">
                    <span className="text-sm font-medium">{formatBDT(p.amount)}</span>
                    <PaymentStatusBadge status={p.status} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <ConfirmModal open={showFreeze} onClose={() => setShowFreeze(false)} onConfirm={handleFreeze}
        title="Freeze Contributor?" message={`${user.first_name} will no longer be able to upload videos or submit exclusive requests.`}
        confirmLabel="Freeze Account" loading={actionLoading} />
      <ConfirmModal open={showUnfreeze} onClose={() => setShowUnfreeze(false)} onConfirm={handleUnfreeze}
        title="Unfreeze Account?" message={`Restore ${user.first_name}'s account to active status.`}
        confirmLabel="Unfreeze Account" confirmVariant="primary" loading={actionLoading} />
      <ConfirmModal open={showSuspend} onClose={() => setShowSuspend(false)} onConfirm={handleSuspend}
        title="Suspend Account?" message={`Suspend ${user.first_name}'s account permanently. This action should be used for serious terms violations.`}
        confirmLabel="Suspend Account" loading={actionLoading} />
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </AppShell>
  );
}
