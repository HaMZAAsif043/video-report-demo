"use client";

import { useEffect, useState } from "react";
import { apiFetch, violationApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tabs } from "@/components/ui/Tabs";
import { Table, TableHead, Th, Td, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import type { Violation } from "@/lib/types";
import AppShell from "@/components/layout/AppShell";

const ACTION_LABELS: Record<string, string> = {
  warning: "Warning",
  payment_lock: "Payment Locked",
  account_suspend: "Account Suspended",
};

const ACTION_VARIANTS: Record<string, "warning" | "danger" | "default"> = {
  warning: "warning",
  payment_lock: "danger",
  account_suspend: "danger",
};

export default function ViolationsPage() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selected, setSelected] = useState<Violation | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [toast, setToast] = useState("");

  const fetchViolations = () => {
    setLoading(true);
    apiFetch<{ results: Violation[] }>("/api/violations/admin/all/")
      .then((data) => setViolations(data.results || []))
      .catch(() => setViolations([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchViolations(); }, []);

  const filtered = activeTab === "all" ? violations
    : activeTab === "payment_locked" ? violations.filter((v) => v.action_taken === "payment_lock")
    : activeTab === "suspended" ? violations.filter((v) => v.action_taken === "account_suspend")
    : violations.filter((v) => v.action_taken === "warning");

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Terms Violations" description="Review reported violations and take action." />

        <Card padding={false}>
          <div className="px-6 pt-4">
            <Tabs tabs={[
              { id: "all", label: "All Violations" },
              { id: "payment_locked", label: "Payment Locked" },
              { id: "suspended", label: "Account Suspended" },
              { id: "warning", label: "Warnings" },
            ]} activeTab={activeTab} onChange={setActiveTab}>
              <></>
            </Tabs>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16"><img src="/digi-web-pro-assets/loaders/spinner.svg" alt="" className="h-6 w-6 animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <EmptyState title="No violations" description="No violations match the current filter." />
          ) : (
            <Table>
              <TableHead>
                <Th>Contributor</Th>
                <Th>Video</Th>
                <Th>Violation Type</Th>
                <Th>Reported By</Th>
                <Th>Date</Th>
                <Th>Action</Th>
                <Th className="text-right">Actions</Th>
              </TableHead>
              <tbody>
                {filtered.map((v) => (
                  <TableRow key={v.id}>
                    <Td><span className="text-sm font-medium">{v.contributor_name}</span></Td>
                    <Td><span className="text-xs text-muted">{v.video || "—"}</span></Td>
                    <Td><span className="text-xs">{v.violation_type}</span></Td>
                    <Td><span className="text-xs text-muted">{v.flagged_by_name}</span></Td>
                    <Td><span className="text-xs text-muted">{formatDate(v.flagged_at)}</span></Td>
                    <Td><Badge variant={ACTION_VARIANTS[v.action_taken] || "default"}>{ACTION_LABELS[v.action_taken] || v.action_taken}</Badge></Td>
                    <Td className="text-right">
                      <button onClick={() => { setSelected(v); setShowDetail(true); }} className="cursor-pointer text-xs font-medium text-accent hover:text-accent-hover">
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

      <Modal open={showDetail} onClose={() => setShowDetail(false)} title="Violation Details">
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-muted">Contributor</span><span>{selected.contributor_name}</span></div>
              <div className="flex justify-between"><span className="text-muted">Video</span><span>{selected.video || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted">Violation Type</span><span>{selected.violation_type}</span></div>
              <div className="flex justify-between"><span className="text-muted">Reported By</span><span>{selected.flagged_by_name}</span></div>
              <div className="flex justify-between"><span className="text-muted">Date</span><span>{formatDate(selected.flagged_at)}</span></div>
              <div className="flex justify-between">
                <span className="text-muted">Action Taken</span>
                <Badge variant={ACTION_VARIANTS[selected.action_taken] || "default"}>
                  {ACTION_LABELS[selected.action_taken] || selected.action_taken}
                </Badge>
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-gray-700">Description:</p>
              <p className="rounded-lg bg-gray-50 p-3 text-gray-600">{selected.description}</p>
            </div>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </AppShell>
  );
}
