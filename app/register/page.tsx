"use client";

import { useState, type FormEvent } from "react";
import { authApi, saveTokens, storeUser } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    password_confirm: "",
    nid_or_address: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("You must agree to the Terms & Conditions.");
      return;
    }
    if (form.password !== form.password_confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authApi.register(form);
      // Auto-login after registration
      await login(form.username, form.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
            <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4h6l-2 8h4l-6 8 2-8H4l2-8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Create Contributor Account</h1>
          <p className="mt-1 text-sm text-muted">Join Digi Web Pro and start contributing videos.</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">First Name *</label>
                <input
                  type="text" value={form.first_name} onChange={(e) => update("first_name", e.target.value)}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30" required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Last Name *</label>
                <input
                  type="text" value={form.last_name} onChange={(e) => update("last_name", e.target.value)}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30" required
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Username *</label>
              <input
                type="text" value={form.username} onChange={(e) => update("username", e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30" required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Email *</label>
              <input
                type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30" required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Phone *</label>
              <input
                type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30" required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">NID / Address (optional)</label>
              <input
                type="text" value={form.nid_or_address} onChange={(e) => update("nid_or_address", e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Password *</label>
                <input
                  type="password" value={form.password} onChange={(e) => update("password", e.target.value)}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30" required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Confirm Password *</label>
                <input
                  type="password" value={form.password_confirm} onChange={(e) => update("password_confirm", e.target.value)}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30" required
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-gray-600">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 rounded border-gray-300" />
              <span>I agree to the Terms & Conditions</span>
            </label>

            {error && (
              <div className="rounded-lg border border-danger-light bg-danger-light p-3 text-xs text-danger">{error}</div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full cursor-pointer rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent hover:text-accent-hover">Login</Link>
        </p>
      </div>
    </div>
  );
}
