"use client";

import { useEffect, useState } from "react";
import { apiFetch, paymentApi } from "@/lib/api";
import { formatBDT, formatDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { PaymentStatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tabs } from "@/components/ui/Tabs";
import { Table, TableHead, Th, Td, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import type { Payment } from "@/lib/types";
import AppShell from "@/components/layout/AppShell";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [toast, setToast] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [lockingId, setLockingId] = useState<number | null>(null);

  const fetchPayments = () => {
    setLoading(true);
    const endpoint = activeTab === "overdue" ? "/api/payments/admin/pending/?overdue=true"
      : activeTab === "due_soon" ? "/api/payments/admin/pending/?due_soon=true"
      : "/api/payments/admin/pending/";
    apiFetch<{ results: Payment[] }>(endpoint)
      .then((data) => setPayments(data.results || []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPayments(); }, [activeTab]);

  const handleProcess = async (id: number) => {
    setProcessingId(id);
    try {
      await paymentApi.processPayment(id);
      setToast("Payment processed!");
      fetchPayments();
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleLock = async (id: number) => {
    setLockingId(id);
    try {
      await paymentApi.lockPayment(id);
      setToast("Payment locked!");
      fetchPayments();
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Failed");
    } finally {
      setLockingId(null);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Payments" description="Manage and process contributor payments." />

        <Card padding={false}>
          <div className="px-6 pt-4">
            <Tabs tabs={[
              { id: "all", label: "All Pending" },
              { id: "overdue", label: "Overdue" },
              { id: "due_soon", label: "Due Soon" },
            ]} activeTab={activeTab} onChange={setActiveTab}>
              <></>
            </Tabs>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16"><img src="/digi-web-pro-assets/loaders/spinner.svg" alt="" className="h-6 w-6 animate-spin" /></div>
          ) : payments.length === 0 ? (
            <EmptyState title="No payments found" description="No payments match the current filter." />
          ) : (
            <Table>
              <TableHead>
                <Th>Video</Th>
                <Th>Used Seconds</Th>
                <Th>Rate</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Due Date</Th>
                <Th className="text-right">Actions</Th>
              </TableHead>
              <tbody>
                {payments.map((p) => {
                  const isOverdue = new Date(p.due_date) < new Date();
                  return (
                    <TableRow key={p.id}>
                      <Td><span className="text-sm font-medium">{p.video_title}</span></Td>
                      <Td><span className="text-xs">{p.used_seconds}s</span></Td>
                      <Td><span className="text-xs">৳{p.rate_applied}/s</span></Td>
                      <Td><span className="text-sm font-semibold">{formatBDT(p.amount)}</span></Td>
                      <Td><PaymentStatusBadge status={p.status} /></Td>
                      <Td>
                        <span className={`text-xs ${isOverdue ? "font-medium text-danger" : "text-muted"}`}>
                          {formatDate(p.due_date)}
                          {isOverdue && " (Overdue)"}
                        </span>
                      </Td>
                      <Td className="text-right">
                        {p.status === "pending" && (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="danger" onClick={() => handleLock(p.id)} disabled={lockingId === p.id || processingId === p.id}>
                              {lockingId === p.id ? "Locking..." : "Lock"}
                            </Button>
                            <Button size="sm" onClick={() => handleProcess(p.id)} disabled={processingId === p.id || lockingId === p.id}>
                              {processingId === p.id ? "Processing..." : "Process Payment"}
                            </Button>
                          </div>
                        )}
                      </Td>
                    </TableRow>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </AppShell>
  );
}
