"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch, videoApi } from "@/lib/api";
import { formatBDT, formatDuration, formatDate, formatDateTime } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { VideoStatusBadge } from "@/components/ui/Badge";
import { Toast } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/Modal";
import type { Video } from "@/lib/types";
import AppShell from "@/components/layout/AppShell";

const STANDARD_RATE = 5;

export default function AdminVideoReviewPage() {
  const params = useParams();
  const router = useRouter();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [usedSeconds, setUsedSeconds] = useState(0);
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!params.id) return;
    apiFetch<Video>(`/api/videos/${params.id}/`)
      .then((v) => {
        setVideo(v);
        setUsedSeconds(Math.floor(v.duration_seconds / 2));
      })
      .catch(() => router.push("/admin/videos"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  const handleApprove = async () => {
    if (!video) return;
    setActionLoading(true);
    try {
      await videoApi.approveVideo(video.id, usedSeconds);
      setToast("Video approved!");
      router.push("/admin/videos");
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!video || !rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await videoApi.rejectVideo(video.id, rejectReason);
      setToast("Video rejected");
      router.push("/admin/videos");
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <AppShell><div className="flex items-center justify-center py-20"><img src="/digi-web-pro-assets/loaders/spinner.svg" alt="" className="h-6 w-6 animate-spin" /></div></AppShell>;
  }
  if (!video) return null;

  const estimatedPayment = usedSeconds * STANDARD_RATE;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Review Video"
          action={
            <Button variant="secondary" size="sm" onClick={() => router.push("/admin/videos")}>
              &larr; Back
            </Button>
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
                  <div className="flex aspect-video items-center justify-center text-gray-500">No video</div>
                )}
              </div>
            </Card>
          </div>

          {/* Info + Actions */}
          <div className="space-y-4">
            <Card>
              <h3 className="mb-3 text-sm font-semibold">Video Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted">Title</span><span className="font-medium">{video.title}</span></div>
                <div className="flex justify-between"><span className="text-muted">Contributor</span><span>{video.contributor_name}</span></div>
                <div className="flex justify-between"><span className="text-muted">Category</span><span>{video.category || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted">Location</span><span>{video.location || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted">Recorded</span><span>{video.recorded_date ? formatDate(video.recorded_date) : "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted">Duration</span><span>{formatDuration(video.duration_seconds)}</span></div>
                <div className="flex justify-between"><span className="text-muted">Status</span><VideoStatusBadge status={video.status} /></div>
              </div>
            </Card>

            {video.status === "pending" && (
              <>
                {/* Usage Input */}
                <Card>
                  <h3 className="mb-3 text-sm font-semibold">Mark Used Footage</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs text-muted">Video duration: {formatDuration(video.duration_seconds)}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number" min={0} max={video.duration_seconds}
                          value={usedSeconds}
                          onChange={(e) => setUsedSeconds(Math.min(Number(e.target.value), video.duration_seconds))}
                          className="w-24 rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none"
                        />
                        <span className="text-xs text-muted">/ {video.duration_seconds} sec</span>
                      </div>
                    </div>

                    {/* Payment Preview */}
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-muted mb-1">Payment Preview</p>
                      <p className="text-sm">
                        <span className="font-medium">{usedSeconds}</span> sec × ৳{STANDARD_RATE} ={" "}
                        <span className="font-bold text-accent">{formatBDT(estimatedPayment)}</span>
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button variant="danger" onClick={() => setShowReject(true)}>
                    Reject Video
                  </Button>
                  <Button onClick={handleApprove} disabled={actionLoading || usedSeconds === 0}>
                    {actionLoading ? "Processing..." : "Approve Video"}
                  </Button>
                </div>
              </>
            )}

            {video.status === "rejected" && video.rejection_reason && (
              <Card className="border-danger/20 bg-danger-light">
                <h3 className="mb-2 text-sm font-semibold text-danger">Rejection Reason</h3>
                <p className="text-sm text-gray-700">{video.rejection_reason}</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <ConfirmModal
        open={showReject}
        onClose={() => setShowReject(false)}
        onConfirm={handleReject}
        title="Reject Video"
        message="Are you sure you want to reject this video? The contributor will see your rejection reason."
        confirmLabel="Reject Video"
        loading={actionLoading}
      >
        <div className="mt-4">
          <label className="mb-1 block text-xs font-medium text-gray-700">Reason *</label>
          <textarea
            value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3}
            placeholder="Explain why this video is being rejected..."
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-accent focus:outline-none"
          />
        </div>
      </ConfirmModal>

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </AppShell>
  );
}
