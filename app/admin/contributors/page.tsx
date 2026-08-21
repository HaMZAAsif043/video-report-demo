"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { AccountStatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, TableHead, Th, Td, TableRow } from "@/components/ui/Table";
import Link from "next/link";
import type { User } from "@/lib/types";
import AppShell from "@/components/layout/AppShell";

export default function ContributorsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ results: User[] }>("/api/auth/admin/users/")
      .then((data) => setUsers(data.results || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const contributors = users.filter((u) => u.role === "contributor");

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Contributors" description="Manage contributors and their account statuses." />

        <Card padding={false}>
          {loading ? (
            <div className="flex items-center justify-center py-16"><img src="/digi-web-pro-assets/loaders/spinner.svg" alt="" className="h-6 w-6 animate-spin" /></div>
          ) : contributors.length === 0 ? (
            <EmptyState title="No contributors" description="No contributors have registered yet." />
          ) : (
            <Table>
              <TableHead>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Status</Th>
                <Th>Joined</Th>
                <Th className="text-right">Actions</Th>
              </TableHead>
              <tbody>
                {contributors.map((u) => (
                  <TableRow key={u.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                          {u.first_name?.[0] || u.username[0]}
                        </div>
                        <span className="text-sm font-medium">{u.first_name} {u.last_name}</span>
                      </div>
                    </Td>
                    <Td><span className="text-xs text-muted">{u.email}</span></Td>
                    <Td><AccountStatusBadge status={u.account_status} /></Td>
                    <Td><span className="text-xs text-muted">{formatDate(u.date_joined)}</span></Td>
                    <Td className="text-right">
                      <Link href={`/admin/contributors/${u.id}`} className="text-xs font-medium text-accent hover:text-accent-hover">
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
