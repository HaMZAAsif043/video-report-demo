"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { formatBDT } from "@/lib/format";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { VideoStatusBadge } from "@/components/ui/Badge";
import Link from "next/link";
import type { AdminDashboardData, Video } from "@/lib/types";
import AppShell from "@/components/layout/AppShell";

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [pendingVideos, setPendingVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<AdminDashboardData>("/api/auth/admin/dashboard/").catch(() => null),
      apiFetch<{ results: Video[] }>("/api/videos/admin/pending/").catch(() => ({ results: [] })),
    ]).then(([d, v]) => {
      setData(d);
      setPendingVideos(v.results || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <AppShell><div className="py-20 text-center text-sm text-muted">Loading dashboard...</div></AppShell>;
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Admin Dashboard" description="Overview of platform activity and key metrics." />

        {data && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Contributors" value={data.total_contributors} />
            <StatCard label="Pending Videos" value={data.pending_videos} />
            <StatCard label="Monthly Payment Outflow" value={formatBDT(data.monthly_payment_outflow)} />
            <StatCard label="Overdue Payments" value={data.overdue_payments} />
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <h3 className="mb-3 text-sm font-semibold">Frozen Accounts</h3>
              <p className="text-2xl font-bold text-warning">{data.frozen_accounts}</p>
            </Card>
            <Card>
              <h3 className="mb-3 text-sm font-semibold">Suspended Accounts</h3>
              <p className="text-2xl font-bold text-danger">{data.suspended_accounts}</p>
            </Card>
            <Card>
              <h3 className="mb-3 text-sm font-semibold">Due Soon Payments</h3>
              <p className="text-2xl font-bold text-info">{data.due_soon_payments}</p>
            </Card>
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <h3 className="mb-3 text-sm font-semibold">Exclusive Request Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted">Total Requests</span><span>{data.exclusive_stats.total_exclusive_requests}</span></div>
                <div className="flex justify-between"><span className="text-muted">Pending</span><span className="font-medium text-warning">{data.exclusive_stats.pending_exclusive_requests}</span></div>
                <div className="flex justify-between"><span className="text-muted">Approved</span><span className="font-medium text-success">{data.exclusive_stats.approved_exclusive_requests}</span></div>
                <div className="flex justify-between"><span className="text-muted">Rejected</span><span className="font-medium text-danger">{data.exclusive_stats.rejected_exclusive_requests}</span></div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Pending Video Reviews</h3>
                <Link href="/admin/videos" className="text-xs font-medium text-accent hover:text-accent-hover">View All</Link>
              </div>
              {pendingVideos.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted">No pending videos</p>
              ) : (
                <div className="space-y-2">
                  {pendingVideos.slice(0, 5).map((v) => (
                    <Link key={v.id} href={`/admin/videos/${v.id}`} className="flex items-center justify-between rounded-lg p-2 transition hover:bg-gray-50">
                      <div>
                        <p className="text-sm font-medium">{v.title}</p>
                        <p className="text-xs text-muted">{v.contributor_name}</p>
                      </div>
                      <VideoStatusBadge status={v.status} />
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
