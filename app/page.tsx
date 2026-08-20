"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ReportItem = {
  key: string;
  title: string;
  reporter: string;
  uploadedAt: string;
  viewUrl: string;
};

const stats = [
  { label: "Total Reports", value: "24", accent: false },
  { label: "Processing", value: "8", accent: false },
  { label: "Drafts", value: "3", accent: false },
  { label: "Published", value: "13", accent: false },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Published: "bg-emerald-50 text-emerald-700",
    Review: "bg-amber-50 text-amber-700",
    Processing: "bg-blue-50 text-blue-700",
    Draft: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${styles[status] || styles.Draft}`}>
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const [items, setItems] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then((data) => setItems(data.items || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Good morning, Hamza</h1>
        <p className="mt-1 text-sm text-muted">Here&apos;s what&apos;s happening in your newsroom.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <p className="text-2xl font-bold tracking-tight">{s.value}</p>
            <p className="mt-1 text-xs font-medium text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold">Recent Reports</h2>
          <Link
            href="/upload"
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-accent-hover"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Upload Report
          </Link>
        </div>

        {loading && <div className="py-16 text-center text-sm text-muted">Loading...</div>}

        {!loading && items.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-muted">No reports yet.</p>
            <Link href="/upload" className="mt-2 inline-block text-sm font-medium text-accent hover:text-accent-hover">
              Upload your first report &rarr;
            </Link>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="divide-y divide-border">
            {items.map((item) => (
              <Link
                key={item.key}
                href={`/reports/${encodeURIComponent(item.key)}`}
                className="flex items-center gap-4 px-6 py-3 transition hover:bg-gray-50"
              >
                <div className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-gray-900">
                  <video src={item.viewUrl} className="h-full w-full object-cover" muted preload="metadata" />
                  <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[10px] font-medium text-white">
                    00:00
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{item.title || "Untitled"}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    By {item.reporter} &middot;{" "}
                    {new Date(item.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <StatusBadge status="Uploaded" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
