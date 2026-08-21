"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        setError("Network connection failed. Please check your internet and try again.");
      } else if (msg.includes("No active account") || msg.includes("credentials")) {
        setError("Invalid username or password.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Brand */}
      <div className="relative hidden w-[45%] overflow-hidden bg-[#0f172a] lg:flex lg:flex-col lg:justify-between lg:p-10">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        {/* Floating play button */}
        <div className="relative z-10 flex flex-1 items-center justify-center">
          <div className="relative animate-float">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[140px] w-[140px] rounded-full bg-indigo-500/20 animate-pulse-ring" />
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/30">
              <svg className="h-12 w-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10">
          <div className="mb-8 flex gap-10">
            <div>
              <p className="text-3xl font-bold text-white">2,450+</p>
              <p className="mt-1 text-sm text-slate-400">Videos Managed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">180+</p>
              <p className="mt-1 text-sm text-slate-400">Contributors</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border-t border-slate-700/50 pt-6">
            <img src="/digi-web-pro-assets/brand/digi-web-pro-mark.svg" alt="" className="h-8 w-8" />
            <div>
              <p className="text-sm font-semibold text-white">Trusted by media professionals</p>
              <p className="text-xs text-slate-400">Professional Video Management Platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
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
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h1>
            <p className="mt-1.5 text-sm text-muted">Sign in to your contributor account</p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm placeholder:text-gray-400 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-11 w-full rounded-xl border border-border bg-white px-4 pr-11 text-sm placeholder:text-gray-400 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300 text-accent focus:ring-accent/30" />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-xs font-medium text-accent transition hover:text-accent-hover">
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-danger-light bg-danger-light px-4 py-3 text-xs text-danger">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="h-11 w-full cursor-pointer rounded-xl bg-accent text-sm font-semibold text-white shadow-sm shadow-accent/25 transition hover:bg-accent-hover hover:shadow-md hover:shadow-accent/30 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <img src="/digi-web-pro-assets/loaders/spinner.svg" alt="" className="h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : "Sign In"}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-accent transition hover:text-accent-hover">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
