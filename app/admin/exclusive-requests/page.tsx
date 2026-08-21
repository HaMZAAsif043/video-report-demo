"use client";

import { useEffect, useState } from "react";
import { apiFetch, exclusiveApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ExclusiveStatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tabs } from "@/components/ui/Tabs";
import { Table, TableHead, Th, Td, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import type { ExclusiveRequest } from "@/lib/types";
import AppShell from "@/components/layout/AppShell";

export default function AdminExclusiveRequestsPage() {
  const [requests, setRequests] = useState<ExclusiveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selected, setSelected] = useState<ExclusiveRequest | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState("");

  const fetchRequests = () => {
    setLoading(true);
    const q = activeTab !== "all" ? `?status=${activeTab}` : "";
    apiFetch<{ results: ExclusiveRequest[] }>(`/api/payments/admin/exclusive/${q}`)
      .then((data) => setRequests(data.results || []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRequests(); }, [activeTab]);

  const handleAction = async (action: "approve" | "reject") => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await exclusiveApi.adminAction(selected.id, action);
      setToast(`Request ${action}d!`);
      setShowDetail(false);
      setSelected(null);
      fetchRequests();
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Exclusive Requests" description="Review and manage exclusive payment requests." />

        <Card padding={false}>
          <div className="px-6 pt-4">
            <Tabs tabs={[
              { id: "all", label: "All" },
              { id: "pending", label: "Pending" },
              { id: "approved", label: "Approved" },
              { id: "rejected", label: "Rejected" },
            ]} activeTab={activeTab} onChange={setActiveTab}>
              <></>
            </Tabs>
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-muted">Loading...</div>
          ) : requests.length === 0 ? (
            <EmptyState title="No requests" description="No exclusive requests match the current filter." />
          ) : (
            <Table>
              <TableHead>
                <Th>Video</Th>
                <Th>Requested</Th>
                <Th>Reason</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </TableHead>
              <tbody>
                {requests.map((r) => (
                  <TableRow key={r.id}>
                    <Td><span className="text-sm font-medium">{r.video_title}</span></Td>
                    <Td><span className="text-xs text-muted">{formatDate(r.requested_at)}</span></Td>
                    <Td><span className="text-xs text-muted line-clamp-1 max-w-[200px]">{r.reason}</span></Td>
                    <Td><ExclusiveStatusBadge status={r.status} /></Td>
                    <Td className="text-right">
                      <button
                        onClick={() => { setSelected(r); setShowDetail(true); }}
                        className="cursor-pointer text-xs font-medium text-accent hover:text-accent-hover"
                      >
                        View
                      </button>
                    </Td>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </div>

      {/* Detail Modal */}
      <Modal open={showDetail} onClose={() => setShowDetail(false)} title="Exclusive Request">
        {selected && (
          <div className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Video</span><span className="font-medium">{selected.video_title}</span></div>
              <div className="flex justify-between"><span className="text-muted">Status</span><ExclusiveStatusBadge status={selected.status} /></div>
              <div className="flex justify-between"><span className="text-muted">Requested</span><span>{formatDate(selected.requested_at)}</span></div>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-gray-700">Reason:</p>
              <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{selected.reason}</p>
            </div>
            {selected.admin_note && (
              <div>
                <p className="mb-1 text-xs font-medium text-gray-700">Admin Note:</p>
                <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{selected.admin_note}</p>
              </div>
            )}
            {selected.status === "pending" && (
              <div className="flex gap-3 pt-2">
                <Button variant="danger" onClick={() => handleAction("reject")} disabled={actionLoading}>
                  Reject
                </Button>
                <Button onClick={() => handleAction("approve")} disabled={actionLoading}>
                  {actionLoading ? "Processing..." : "Approve Exclusive"}
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </AppShell>
  );
}
