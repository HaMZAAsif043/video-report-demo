"use client";

import { useState, type FormEvent } from "react";
import { authApi } from "@/lib/api";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!agreed) { setError("You must agree to the Terms & Conditions."); return; }
    if (form.password !== form.password_confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    try {
      await authApi.register(form);
      await login(form.username, form.password);
      setSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        setError("Network connection failed. Please check your internet and try again.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen">
        <div className="relative hidden w-1/2 overflow-hidden bg-[#0f172a] lg:flex lg:flex-col lg:justify-between lg:p-10">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="relative z-10 flex flex-1 items-center justify-center">
            <div className="relative animate-float">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[140px] w-[140px] rounded-full bg-indigo-500/20 animate-pulse-ring" />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/30">
                <svg className="h-12 w-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
          </div>
          <div className="relative z-10">
            <div className="mb-8 flex gap-10">
              <div><p className="text-3xl font-bold text-white">2,450+</p><p className="mt-1 text-sm text-slate-400">Videos Managed</p></div>
              <div><p className="text-3xl font-bold text-white">180+</p><p className="mt-1 text-sm text-slate-400">Contributors</p></div>
            </div>
            <div className="flex items-center gap-3 border-t border-slate-700/50 pt-6">
              <img src="/digi-web-pro-assets/brand/digi-web-pro-mark.svg" alt="" className="h-8 w-8" />
              <div><p className="text-sm font-semibold text-white">Trusted by media professionals</p><p className="text-xs text-slate-400">Professional Video Management Platform</p></div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center p-6 lg:p-10">
          <div className="w-full max-w-md animate-fade-in-up text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-light">
              <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Account Created</h1>
            <p className="mt-2 text-sm text-muted">Welcome to Digi Web Pro! Your contributor account has been created successfully.</p>
            <button onClick={() => router.push("/")} className="mt-6 h-11 w-full cursor-pointer rounded-xl bg-accent text-sm font-semibold text-white shadow-sm shadow-accent/25 transition hover:bg-accent-hover hover:shadow-md hover:shadow-accent/30 active:scale-[0.98]">Continue to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = "h-11 w-full rounded-xl border border-border bg-white px-4 text-sm placeholder:text-gray-400 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="relative hidden w-[45%] overflow-hidden bg-[#0f172a] lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 flex flex-1 items-center justify-center">
            <div className="relative animate-float">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[140px] w-[140px] rounded-full bg-indigo-500/20 animate-pulse-ring" />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/30">
                <svg className="h-12 w-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
          </div>
        <div className="relative z-10">
          <div className="mb-8 flex gap-10">
            <div><p className="text-3xl font-bold text-white">2,450+</p><p className="mt-1 text-sm text-slate-400">Videos Managed</p></div>
            <div><p className="text-3xl font-bold text-white">180+</p><p className="mt-1 text-sm text-slate-400">Contributors</p></div>
          </div>
          <div className="flex items-center gap-3 border-t border-slate-700/50 pt-6">
            <img src="/digi-web-pro-assets/brand/digi-web-pro-mark.svg" alt="" className="h-8 w-8" />
            <div><p className="text-sm font-semibold text-white">Trusted by media professionals</p><p className="text-xs text-slate-400">Professional Video Management Platform</p></div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile brand */}
          <div className="mb-8 text-center lg:hidden">
            <img src="/digi-web-pro-assets/brand/digi-web-pro-mark.svg" alt="Digi Web Pro" className="mx-auto mb-3 h-12 w-12" />
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Digi Web Pro</h1>
            <p className="mt-1 text-sm text-muted">Professional Video Management Platform</p>
          </div>

          {/* Desktop heading */}
          <div className="mb-6 hidden lg:block">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create Account</h1>
            <p className="mt-1.5 text-sm text-muted">Create your contributor account and start submitting original videos.</p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Row 1: Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">First Name</label>
                  <input type="text" value={form.first_name} onChange={(e) => update("first_name", e.target.value)} placeholder="First name" className={inputClass} required />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Last Name</label>
                  <input type="text" value={form.last_name} onChange={(e) => update("last_name", e.target.value)} placeholder="Last name" className={inputClass} required />
                </div>
              </div>

              {/* Row 2: Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Phone number" className={inputClass} required />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Email</label>
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" className={inputClass} required />
                </div>
              </div>

              {/* Row 3: Account */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Username</label>
                  <input type="text" value={form.username} onChange={(e) => update("username", e.target.value)} placeholder="Choose a username" className={inputClass} required />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">NID / Address <span className="text-gray-400">(optional)</span></label>
                  <input type="text" value={form.nid_or_address} onChange={(e) => update("nid_or_address", e.target.value)} placeholder="National ID or address" className={inputClass} />
                </div>
              </div>

              {/* Row 4: Passwords */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Min 8 characters" className={`${inputClass} pr-11`} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition hover:text-gray-600">
                      {showPassword ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <input type={showConfirm ? "text" : "password"} value={form.password_confirm} onChange={(e) => update("password_confirm", e.target.value)} placeholder="Re-enter password" className={`${inputClass} pr-11`} required />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition hover:text-gray-600">
                      {showConfirm ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 text-accent focus:ring-accent/30" />
                <span>By creating an account, I agree to the <span className="font-medium text-accent">Terms &amp; Conditions</span> and <span className="font-medium text-accent">Contributor Guidelines</span>.</span>
              </label>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-danger-light bg-danger-light px-4 py-3 text-xs text-danger">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading} className="h-11 w-full cursor-pointer rounded-xl bg-accent text-sm font-semibold text-white shadow-sm shadow-accent/25 transition hover:bg-accent-hover hover:shadow-md hover:shadow-accent/30 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100">
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <img src="/digi-web-pro-assets/loaders/spinner.svg" alt="" className="h-4 w-4 animate-spin" />
                    Creating account...
                  </span>
                ) : "Create Account"}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-accent transition hover:text-accent-hover">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
