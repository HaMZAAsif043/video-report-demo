"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { passwordResetApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "reset" | "done">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [devCode, setDevCode] = useState("");

  const handleRequestCode = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await passwordResetApi.requestCode(email);
      setDevCode(res.otp_code || "");
      setStep("reset");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await passwordResetApi.resetPassword(email, code, newPassword);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img src="/digi-web-pro-assets/brand/digi-web-pro-mark.svg" alt="Digi Web Pro" className="mx-auto mb-3 h-12 w-12" />
          <h1 className="text-xl font-bold tracking-tight">Reset Password</h1>
          <p className="mt-1 text-sm text-muted">
            {step === "email" && "Enter your email to receive a reset code."}
            {step === "reset" && "Enter the code and your new password."}
            {step === "done" && "Your password has been reset."}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          {step === "done" ? (
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success-light text-success">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <p className="text-sm text-gray-700">Password reset successful.</p>
              <Link href="/login" className="mt-4 inline-block text-sm font-medium text-accent hover:text-accent-hover">
                Back to Login
              </Link>
            </div>
          ) : step === "email" ? (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Email</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                  required
                />
              </div>
              {error && (
                <div className="rounded-lg border border-danger-light bg-danger-light p-3 text-xs text-danger">{error}</div>
              )}
              <button
                type="submit" disabled={loading}
                className="w-full cursor-pointer rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <img src="/digi-web-pro-assets/loaders/spinner.svg" alt="" className="h-4 w-4 animate-spin" />
                    Sending...
                  </span>
                ) : "Send Reset Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {devCode && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs">
                  <p className="font-medium text-amber-800">Dev Mode — Your reset code:</p>
                  <p className="mt-1 font-mono text-lg font-bold text-amber-900 tracking-widest">{devCode}</p>
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Reset Code</label>
                <input
                  type="text" value={code} onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 pr-10 text-sm placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                    required
                  />
                  <button
                    type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
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
              {error && (
                <div className="rounded-lg border border-danger-light bg-danger-light p-3 text-xs text-danger">{error}</div>
              )}
              <button
                type="submit" disabled={loading}
                className="w-full cursor-pointer rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <img src="/digi-web-pro-assets/loaders/spinner.svg" alt="" className="h-4 w-4 animate-spin" />
                    Resetting...
                  </span>
                ) : "Reset Password"}
              </button>
              <button
                type="button" onClick={() => { setStep("email"); setError(""); setDevCode(""); }}
                className="w-full cursor-pointer rounded-lg border border-border py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Back
              </button>
            </form>
          )}
        </div>

        {step === "email" && (
          <p className="mt-4 text-center text-xs text-muted">
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-accent hover:text-accent-hover">Login</Link>
          </p>
        )}
      </div>
    </div>
  );
}
