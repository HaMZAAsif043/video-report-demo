"use client";

import { useState, useRef, useCallback } from "react";

type ProcessingStep = {
  label: string;
  status: "completed" | "in-progress" | "pending";
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [reporter, setReporter] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "processing" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [savedMsg, setSavedMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processingSteps: ProcessingStep[] = [
    { label: "Video uploaded", status: uploadStatus === "processing" || uploadStatus === "done" ? "completed" : "pending" },
    { label: "Audio extracted", status: uploadStatus === "processing" || uploadStatus === "done" ? "completed" : "pending" },
    { label: "Transcription", status: uploadStatus === "processing" || uploadStatus === "done" ? "completed" : "pending" },
    { label: "AI analysis", status: uploadStatus === "processing" ? "in-progress" : uploadStatus === "done" ? "completed" : "pending" },
    { label: "Generating summary", status: uploadStatus === "done" ? "completed" : "pending" },
    { label: "Detecting key moments", status: uploadStatus === "done" ? "completed" : "pending" },
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("video/")) {
      setFile(dropped);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t));

  const handleUpload = async () => {
    setError("");

    if (!file) {
      setError("Please select a video file.");
      return;
    }
    if (!title.trim()) {
      setError("Report title is required.");
      return;
    }
    if (!category) {
      setError("Please select a category.");
      return;
    }
    if (!reporter) {
      setError("Please select a reporter.");
      return;
    }

    setUploadStatus("uploading");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 5;
      });
    }, 100);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("reporterName", reporter || "unknown");
      formData.append("title", title || file.name);
      formData.append("category", category || "");
      formData.append("location", location || "");
      formData.append("tags", JSON.stringify(tags));

      const res = await fetch("/api/upload-url", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Upload failed (${res.status}): ${errBody}`);
      }

      clearInterval(interval);
      setProgress(100);
      setUploadStatus("processing");
      setTimeout(() => setUploadStatus("done"), 3000);
    } catch (err) {
      clearInterval(interval);
      console.error("Upload failed:", err);
      setUploadStatus("idle");
      setProgress(0);
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upload Video Report</h1>
        <p className="mt-1 text-sm text-muted">Upload, describe, and publish your video report to the newsroom.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left column — form */}
        <div className="space-y-6 lg:col-span-3">
          {/* Step 1: Upload */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold">1. Upload Video</h2>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/mov,video/webm,video/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 transition ${
                  dragging ? "border-accent bg-accent/5" : "border-gray-200 hover:border-accent/40 hover:bg-gray-50"
                }`}
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-700">Drag & drop your video here</p>
                <p className="mt-1 text-xs text-muted">or browse files from your computer</p>
                <p className="mt-3 text-[11px] text-gray-400">MP4, MOV, WebM &middot; Max 2GB &middot; Recommended 1080p</p>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-4 rounded-lg border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Browse Files
                </span>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                  {uploadStatus === "done" && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                      Upload complete ✓
                    </span>
                  )}
                  {uploadStatus === "uploading" && (
                    <span className="text-xs text-muted">{progress}%</span>
                  )}
                </div>
                {uploadStatus === "uploading" && (
                  <div className="mt-3 h-1.5 w-full rounded-full bg-gray-200">
                    <div
                      className="h-1.5 rounded-full bg-accent transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
                {uploadStatus === "idle" && (
                  <button
                    onClick={() => setFile(null)}
                    className="mt-2 text-xs text-red-500 hover:text-red-700"
                  >
                    Remove file
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Step 2: Details */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold">2. Report Details</h2>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Report Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Q3 Sales Summary"
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-border bg-white px-3 py-2 text-sm text-gray-700 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                  >
                    <option value="">Select category</option>
                    <option>Politics</option>
                    <option>Economy</option>
                    <option>Sports</option>
                    <option>Technology</option>
                    <option>Entertainment</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Reporter <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={reporter}
                    onChange={(e) => setReporter(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-border bg-white px-3 py-2 text-sm text-gray-700 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                  >
                    <option value="">Select reporter</option>
                    <option>Sarah Khan</option>
                    <option>Hamza Asif</option>
                    <option>Ayesha Malik</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Islamabad, Pakistan"
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Add tags (e.g. economy, politics)"
                    className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    + Add
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
                      >
                        {t}
                        <button onClick={() => removeTag(t)} className="ml-0.5 hover:text-accent-hover">&times;</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setSavedMsg("Draft saved.");
                    setTimeout(() => setSavedMsg(""), 3000);
                  }}
                  className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Save Draft
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!file || uploadStatus === "uploading" || uploadStatus === "processing"}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  {uploadStatus === "uploading" ? "Uploading..." : uploadStatus === "processing" ? "Processing..." : "Upload & Process"}
                </button>
              </div>
              {error && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}
              {savedMsg && (
                <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 text-xs text-green-700">
                  {savedMsg}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column — preview + processing */}
        <div className="space-y-6 lg:col-span-2">
          {/* Video Preview */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Video Preview</h2>
              {file && uploadStatus === "idle" && (
                <button onClick={() => setFile(null)} className="text-xs text-red-500 hover:text-red-700">
                  Remove
                </button>
              )}
            </div>
            {file ? (
              <div className="overflow-hidden rounded-lg bg-gray-900">
                <video
                  key={file.name}
                  src={URL.createObjectURL(file)}
                  controls
                  className="w-full"
                  style={{ aspectRatio: "16/9", objectFit: "contain" }}
                />
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
                No video selected
              </div>
            )}
          </div>

          {/* Processing Status */}
          {(uploadStatus === "uploading" || uploadStatus === "processing" || uploadStatus === "done") && (
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold">Processing Status</h2>
              <div className="space-y-3">
                {processingSteps.map((step) => (
                  <div key={step.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {step.status === "completed" && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                      )}
                      {step.status === "in-progress" && (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                      )}
                      {step.status === "pending" && (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-200" />
                      )}
                      <span className={`text-sm ${step.status === "pending" ? "text-gray-400" : ""}`}>
                        {step.label}
                      </span>
                    </div>
                    <span className={`text-xs font-medium ${
                      step.status === "completed" ? "text-emerald-600" :
                      step.status === "in-progress" ? "text-accent" : "text-gray-400"
                    }`}>
                      {step.status === "completed" ? "Completed" :
                       step.status === "in-progress" ? "In progress" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-center">
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                    <circle
                      cx="50" cy="50" r="42" fill="none" stroke="#6366f1" strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <span className="absolute text-xl font-bold">{progress}%</span>
                </div>
              </div>
              <p className="mt-2 text-center text-xs text-muted">
                {uploadStatus === "done" ? "Report ready" : "Processing..."}
              </p>
              {uploadStatus === "done" && (
                <div className="mt-4 flex justify-center gap-2">
                  <a
                    href="/reports"
                    className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-hover"
                  >
                    View Report
                  </a>
                  <button
                    onClick={() => {
                      setSavedMsg("Report published!");
                      setTimeout(() => setSavedMsg(""), 3000);
                    }}
                    className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Publish
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold">Recent Uploads</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Election Coverage", date: "Aug 20, 2026", status: "Published", duration: "04:32" },
            { title: "Market Update", date: "Aug 20, 2026", status: "Review", duration: "03:21" },
            { title: "Q3 Business Report", date: "Aug 19, 2026", status: "Processing", duration: "05:10" },
            { title: "Weather Update", date: "Aug 18, 2026", status: "Draft", duration: "02:45" },
          ].map((item) => (
            <div key={item.title} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-gray-900">
                <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-900" />
                <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {item.duration}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900 group-hover:text-accent">{item.title}</p>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-[11px] text-muted">{item.date}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  item.status === "Published" ? "bg-emerald-50 text-emerald-700" :
                  item.status === "Review" ? "bg-amber-50 text-amber-700" :
                  item.status === "Processing" ? "bg-blue-50 text-blue-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
