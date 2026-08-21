"use client";

import { useEffect, useState } from "react";
import { apiFetch, exclusiveApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ExclusiveStatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, TableHead, Th, Td, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import type { ExclusiveRequest, Video } from "@/lib/types";
import AppShell from "@/components/layout/AppShell";

export default function ExclusiveRequestsPage() {
  const [requests, setRequests] = useState<ExclusiveRequest[]>([]);
  const [approvedVideos, setApprovedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    Promise.all([
      apiFetch<{ results: ExclusiveRequest[] }>("/api/payments/exclusive/my/").catch(() => ({ results: [] })),
      apiFetch<{ results: Video[] }>("/api/videos/my/").catch(() => ({ results: [] })),
    ]).then(([reqs, vids]) => {
      setRequests(reqs.results || []);
      setApprovedVideos((vids.results || []).filter((v) => v.status === "approved" && v.is_claimed_exclusive));
      setLoading(false);
    });
  }, []);

  const handleSubmit = async () => {
    if (!selectedVideo || !reason.trim()) return;
    setSubmitting(true);
    try {
      await exclusiveApi.create(selectedVideo, reason);
      setToast("Exclusive request submitted!");
      setShowForm(false);
      setSelectedVideo(null);
      setReason("");
      // Refresh
      const data = await apiFetch<{ results: ExclusiveRequest[] }>("/api/payments/exclusive/my/");
      setRequests(data.results || []);
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Exclusive Requests"
          description="Request exclusive payment for your approved videos."
          action={
            approvedVideos.length > 0 && (
              <Button onClick={() => setShowForm(true)}>New Request</Button>
            )
          }
        />

        {showForm && (
          <Card>
            <h3 className="mb-4 text-sm font-semibold">Submit Exclusive Request</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Select Video *</label>
                <select
                  value={selectedVideo || ""}
                  onChange={(e) => setSelectedVideo(Number(e.target.value))}
                  className="w-full appearance-none rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none"
                >
                  <option value="">Choose a video</option>
                  {approvedVideos.map((v) => (
                    <option key={v.id} value={v.id}>{v.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Why is this video exclusive? *</label>
                <textarea
                  value={reason} onChange={(e) => setReason(e.target.value)} rows={3}
                  placeholder="Explain why this footage was recorded exclusively..."
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-accent focus:outline-none"
                />
              </div>
              <p className="text-xs text-muted">Exclusive payment is subject to admin approval.</p>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={submitting || !selectedVideo || !reason.trim()}>
                  {submitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </div>
          </Card>
        )}

        <Card padding={false}>
          {loading ? (
            <div className="flex items-center justify-center py-16"><img src="/digi-web-pro-assets/loaders/spinner.svg" alt="" className="h-6 w-6 animate-spin" /></div>
          ) : requests.length === 0 ? (
            <EmptyState
              title="No exclusive requests"
              description="Submit a request for an approved exclusive video to get double payment."
            />
          ) : (
            <Table>
              <TableHead>
                <Th>Video</Th>
                <Th>Requested</Th>
                <Th>Reason</Th>
                <Th>Status</Th>
                <Th>Admin Note</Th>
              </TableHead>
              <tbody>
                {requests.map((r) => (
                  <TableRow key={r.id}>
                    <Td><span className="text-sm font-medium">{r.video_title}</span></Td>
                    <Td><span className="text-xs text-muted">{formatDate(r.requested_at)}</span></Td>
                    <Td><span className="text-xs text-muted line-clamp-1">{r.reason}</span></Td>
                    <Td><ExclusiveStatusBadge status={r.status} /></Td>
                    <Td><span className="text-xs text-muted">{r.admin_note || "—"}</span></Td>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </AppShell>
  );
}
