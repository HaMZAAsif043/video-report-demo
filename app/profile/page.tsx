"use client";

import { useEffect, useState, type FormEvent } from "react";
import { apiFetch, authApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { AccountStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import type { User } from "@/lib/types";
import AppShell from "@/components/layout/AppShell";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "", nid_or_address: "" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    authApi.getProfile().then((u) => {
      setUser(u);
      setForm({
        first_name: u.first_name,
        last_name: u.last_name,
        phone: u.phone,
        nid_or_address: u.nid_or_address,
      });
    });
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await authApi.updateProfile(form);
      setUser(updated);
      setEditing(false);
      setToast("Profile updated!");
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <AppShell><div className="flex items-center justify-center py-20"><img src="/digi-web-pro-assets/loaders/spinner.svg" alt="" className="h-6 w-6 animate-spin" /></div></AppShell>;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Profile" description="Manage your profile information." />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Profile Information</h3>
                {!editing && (
                  <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>Edit Profile</Button>
                )}
              </div>
              {editing ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">First Name</label>
                      <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">Last Name</label>
                      <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">Phone</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">NID / Address</label>
                    <input value={form.nid_or_address} onChange={(e) => setForm({ ...form, nid_or_address: e.target.value })}
                      className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none" />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" type="button" onClick={() => setEditing(false)}>Cancel</Button>
                    <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted">Full Name</span><span>{user.first_name} {user.last_name}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Email</span><span>{user.email}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Phone</span><span>{user.phone || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted">NID / Address</span><span>{user.nid_or_address || "—"}</span></div>
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <h3 className="mb-3 text-sm font-semibold">Account Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted">Status</span><AccountStatusBadge status={user.account_status} /></div>
                <div className="flex justify-between"><span className="text-muted">Role</span><span className="capitalize">{user.role}</span></div>
                <div className="flex justify-between"><span className="text-muted">Joined</span><span>{formatDate(user.date_joined)}</span></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </AppShell>
  );
}
