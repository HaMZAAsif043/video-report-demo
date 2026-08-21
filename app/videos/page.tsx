"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { formatDuration, formatDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { VideoStatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tabs } from "@/components/ui/Tabs";
import { Table, TableHead, Th, Td, TableRow } from "@/components/ui/Table";
import Link from "next/link";
import type { Video } from "@/lib/types";
import AppShell from "@/components/layout/AppShell";

const TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

export default function MyVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    apiFetch<{ results: Video[] }>("/api/videos/my/")
      .then((data) => setVideos(data.results || []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab === "all" ? videos : videos.filter((v) => v.status === activeTab);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="My Videos" description="Manage your uploaded videos and track their status." />

        <Card padding={false}>
          <div className="px-6 pt-4">
            <Tabs tabs={TABS.map((t) => ({
              ...t,
              count: t.id === "all" ? videos.length : videos.filter((v) => v.status === t.id).length,
            }))} onChange={setActiveTab}>
              <></>
            </Tabs>
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-muted">Loading videos...</div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No videos found"
              description={activeTab === "all" ? "Upload your first video to get started." : `No ${activeTab} videos.`}
              action={activeTab === "all" ? (
                <Link href="/upload" className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover">
                  Upload Video
                </Link>
              ) : undefined}
            />
          ) : (
            <Table>
              <TableHead>
                <Th>Video</Th>
                <Th>Category</Th>
                <Th>Duration</Th>
                <Th>Status</Th>
                <Th>Uploaded</Th>
                <Th className="text-right">Actions</Th>
              </TableHead>
              <tbody>
                {filtered.map((video) => (
                  <TableRow key={video.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-900">
                          {video.file && (
                            <video src={video.file} className="h-full w-full object-cover" muted preload="metadata" />
                          )}
                          <span className="absolute bottom-0.5 right-0.5 rounded bg-black/70 px-1 text-[8px] text-white">
                            {formatDuration(video.duration_seconds)}
                          </span>
                        </div>
                        <span className="truncate text-sm font-medium">{video.title}</span>
                      </div>
                    </Td>
                    <Td><span className="text-xs text-muted">{video.category || "—"}</span></Td>
                    <Td><span className="text-xs">{formatDuration(video.duration_seconds)}</span></Td>
                    <Td><VideoStatusBadge status={video.status} /></Td>
                    <Td><span className="text-xs text-muted">{formatDate(video.uploaded_at)}</span></Td>
                    <Td className="text-right">
                      <Link href={`/videos/${video.id}`} className="text-xs font-medium text-accent hover:text-accent-hover">
                        View
                      </Link>
                    </Td>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
