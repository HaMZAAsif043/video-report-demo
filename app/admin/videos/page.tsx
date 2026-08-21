"use client";

import { useEffect, useState } from "react";
import { apiFetch, videoApi } from "@/lib/api";
import { formatDuration, formatDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { VideoStatusBadge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";
import type { Video } from "@/lib/types";
import AppShell from "@/components/layout/AppShell";

const TABS = [
  { id: "pending", label: "Pending Review" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  const fetchVideos = () => {
    setLoading(true);
    apiFetch<{ results: Video[] }>(`/api/videos/admin/all/?status=${activeTab}`)
      .then((data) => setVideos(data.results || []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVideos();
  }, [activeTab]);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Review Videos" description="Review and take action on submitted videos." />

        <Card padding={false}>
          <div className="px-6 pt-4">
            <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab}>
              <></>
            </Tabs>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16"><img src="/digi-web-pro-assets/loaders/spinner.svg" alt="" className="h-6 w-6 animate-spin" /></div>
          ) : videos.length === 0 ? (
            <EmptyState
              title={`No ${activeTab} videos`}
              description={activeTab === "pending" ? "All caught up!" : `No ${activeTab} videos found.`}
            />
          ) : (
            <div className="divide-y divide-border">
              {videos.map((video) => (
                <Link key={video.id} href={`/admin/videos/${video.id}`} className="flex items-center gap-4 px-6 py-4 transition hover:bg-gray-50">
                  <div className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-gray-900">
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
                      {video.contributor_name} &middot; {video.category} &middot; {formatDate(video.uploaded_at)}
                    </p>
                  </div>
                  <VideoStatusBadge status={video.status} />
                  <span className="text-xs font-medium text-accent">Review</span>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
