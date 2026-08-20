"use client";

import { useEffect, useState } from "react";

type ReportItem = {
  key: string;
  title: string;
  reporter: string;
  category: string;
  location: string;
  tags: string[];
  uploadedAt: string;
  viewUrl: string;
};

export default function ReportsPage() {
  const [items, setItems] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/reports")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Failed to load");
        return data;
      })
      .then((data) => setItems(data.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="mt-1 text-sm text-muted">All uploaded video reports.</p>
      </div>

      {loading && <div className="py-20 text-center text-sm text-muted">Loading reports...</div>}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
          <p className="text-sm text-muted">No reports uploaded yet.</p>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.key}
            className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
          >
            <div className="grid gap-0 lg:grid-cols-5">
              {/* Video */}
              <div className="bg-gray-900 lg:col-span-3">
                <video
                  src={item.viewUrl}
                  controls
                  className="w-full"
                  style={{ aspectRatio: "16/9", objectFit: "contain" }}
                  preload="metadata"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col justify-between p-5 lg:col-span-2">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {item.title || "Untitled Report"}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    By {item.reporter} &middot;{" "}
                    {new Date(item.uploadedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <div className="mt-4 space-y-2 text-sm">
                    {item.category && (
                      <div className="flex gap-2">
                        <span className="font-medium text-gray-500">Category</span>
                        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                          {item.category}
                        </span>
                      </div>
                    )}
                    {item.location && (
                      <div className="flex gap-2">
                        <span className="font-medium text-gray-500">Location</span>
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>

                  {item.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
