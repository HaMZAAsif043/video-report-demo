"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { formatBDT, formatDuration, formatDate, formatDateTime } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { VideoStatusBadge, ExclusiveStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import type { Video, ExclusiveRequest } from "@/lib/types";
import AppShell from "@/components/layout/AppShell";

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    apiFetch<Video>(`/api/videos/${params.id}/`)
      .then(setVideo)
      .catch(() => router.push("/videos"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading) {
    return <AppShell><div className="flex items-center justify-center py-20"><img src="/digi-web-pro-assets/loaders/spinner.svg" alt="" className="h-6 w-6 animate-spin" /></div></AppShell>;
  }

  if (!video) return null;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title={video.title}
          description={`Uploaded ${formatDateTime(video.uploaded_at)}`}
          action={
            <Link href="/videos" className="text-sm font-medium text-accent hover:text-accent-hover">
              &larr; Back to Videos
            </Link>
          }
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card padding={false}>
              <div className="overflow-hidden rounded-xl bg-gray-900">
                {video.file ? (
                  <video src={video.file} controls className="w-full" style={{ aspectRatio: "16/9", objectFit: "contain" }} />
                ) : (
                  <div className="flex aspect-video items-center justify-center text-gray-500">No video file</div>
                )}
              </div>
            </Card>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <Card>
              <h3 className="mb-3 text-sm font-semibold">Video Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Status</span>
                  <VideoStatusBadge status={video.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Category</span>
                  <span>{video.category || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Duration</span>
                  <span>{formatDuration(video.duration_seconds)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Location</span>
                  <span>{video.location || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Recorded</span>
                  <span>{video.recorded_date ? formatDate(video.recorded_date) : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Contributor</span>
                  <span>{video.contributor_name}</span>
                </div>
              </div>
            </Card>

            {video.description && (
              <Card>
                <h3 className="mb-2 text-sm font-semibold">Description</h3>
                <p className="text-sm text-gray-600">{video.description}</p>
              </Card>
            )}

            {video.status === "rejected" && video.rejection_reason && (
              <Card className="border-danger/20 bg-danger-light">
                <h3 className="mb-2 text-sm font-semibold text-danger">Rejection Reason</h3>
                <p className="text-sm text-gray-700">{video.rejection_reason}</p>
              </Card>
            )}

            {video.is_claimed_exclusive && (
              <Card className="border-purple/20 bg-purple-light">
                <h3 className="mb-1 text-sm font-semibold text-purple">Exclusive Video</h3>
                <p className="text-xs text-gray-600">
                  This video was claimed as exclusive. Payment rate may be doubled if approved.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
