"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { formatBDT, formatDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { PaymentStatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, TableHead, Th, Td, TableRow } from "@/components/ui/Table";
import type { Payment } from "@/lib/types";
import AppShell from "@/components/layout/AppShell";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ results: Payment[] }>("/api/payments/my/")
      .then((data) => setPayments(data.results || []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  const paid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + parseFloat(p.amount), 0);
  const pending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + parseFloat(p.amount), 0);
  const locked = payments.filter((p) => p.status === "locked").reduce((s, p) => s + parseFloat(p.amount), 0);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Payments" description="Track your earnings and payment history." />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <StatCard label="Total Earnings" value={formatBDT(paid + pending + locked)} />
          <StatCard label="Paid" value={formatBDT(paid)} />
          <StatCard label="Pending" value={formatBDT(pending)} />
          <StatCard label="Locked" value={formatBDT(locked)} />
        </div>

        <Card padding={false}>
          {loading ? (
            <div className="flex items-center justify-center py-16"><img src="/digi-web-pro-assets/loaders/spinner.svg" alt="" className="h-6 w-6 animate-spin" /></div>
          ) : payments.length === 0 ? (
            <EmptyState title="No payments yet" description="Payments appear after your videos are approved." />
          ) : (
            <Table>
              <TableHead>
                <Th>Video</Th>
                <Th>Used Seconds</Th>
                <Th>Rate</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Due Date</Th>
              </TableHead>
              <tbody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <Td><span className="text-sm font-medium">{p.video_title}</span></Td>
                    <Td><span className="text-xs">{p.used_seconds}s</span></Td>
                    <Td><span className="text-xs">৳{p.rate_applied}/s</span></Td>
                    <Td><span className="text-sm font-semibold">{formatBDT(p.amount)}</span></Td>
                    <Td><PaymentStatusBadge status={p.status} /></Td>
                    <Td><span className="text-xs text-muted">{formatDate(p.due_date)}</span></Td>
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
