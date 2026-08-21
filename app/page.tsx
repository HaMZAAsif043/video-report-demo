"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { formatBDT, formatDuration } from "@/lib/format";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { VideoStatusBadge } from "@/components/ui/Badge";
import Link from "next/link";
import type { Video, Payment } from "@/lib/types";
import AppShell from "@/components/layout/AppShell";

export default function ContributorDashboard() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<{ results: Video[] }>("/api/videos/my/").catch(() => ({ results: [] })),
      apiFetch<{ results: Payment[] }>("/api/payments/my/").catch(() => ({ results: [] })),
    ]).then(([v, p]) => {
      setVideos(v.results || []);
      setPayments(p.results || []);
      setLoading(false);
    });
  }, []);

  const totalVideos = videos.length;
  const approved = videos.filter((v) => v.status === "approved").length;
  const totalEarnings = payments.filter((p) => p.status === "paid").reduce((s, p) => s + parseFloat(p.amount), 0);
  const pendingPayments = payments.filter((p) => p.status === "pending").reduce((s, p) => s + parseFloat(p.amount), 0);

  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader title="Dashboard" description="Welcome back! Here's your activity overview." />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Videos" value={totalVideos} />
          <StatCard label="Approved Videos" value={approved} />
          <StatCard label="Total Earnings" value={formatBDT(totalEarnings)} />
          <StatCard label="Pending Payments" value={formatBDT(pendingPayments)} />
        </div>

        {/* Recent Videos */}
        <Card>
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-sm font-semibold">Recent Videos</h2>
            <Link href="/videos" className="text-xs font-medium text-accent hover:text-accent-hover">
              View All
            </Link>
          </div>
          {loading ? (
            <div className="py-12 text-center text-sm text-muted">Loading...</div>
          ) : videos.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-muted">No videos yet</p>
              <Link href="/upload" className="mt-2 inline-block text-sm font-medium text-accent hover:text-accent-hover">
                Upload your first video
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {videos.slice(0, 5).map((video) => (
                <Link key={video.id} href={`/videos/${video.id}`} className="flex items-center gap-4 px-6 py-3 transition hover:bg-gray-50">
                  <div className="relative h-14 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-900">
                    {video.file && (
                      <video src={video.file} className="h-full w-full object-cover" muted preload="metadata" />
                    )}
                    <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[10px] font-medium text-white">
                      {formatDuration(video.duration_seconds)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{video.title}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {video.category} &middot; {new Date(video.uploaded_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <VideoStatusBadge status={video.status} />
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Payment Overview */}
        <Card>
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-sm font-semibold">Payment Overview</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{formatBDT(totalEarnings)}</p>
              <p className="mt-1 text-xs text-muted">Paid</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{formatBDT(pendingPayments)}</p>
              <p className="mt-1 text-xs text-muted">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-danger">
                {formatBDT(payments.filter((p) => p.status === "locked").reduce((s, p) => s + parseFloat(p.amount), 0))}
              </p>
              <p className="mt-1 text-xs text-muted">Locked</p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
