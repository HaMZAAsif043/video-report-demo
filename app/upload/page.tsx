"use client";

import { useState, useRef, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { videoApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import AppShell from "@/components/layout/AppShell";

const STEPS = ["Video Details", "Terms & Conditions", "Preview & Submit"];
const CATEGORIES = [
  { label: "City", value: "City" },
  { label: "Nature", value: "Nature" },
  { label: "News", value: "News" },
  { label: "Event", value: "Event" },
  { label: "Sports", value: "Sports" },
  { label: "Technology", value: "Technology" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Other", value: "Other" },
];

export default function UploadPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isBlocked = user && user.account_status !== "active";
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [recordedDate, setRecordedDate] = useState("");
  const [isClaimedExclusive, setIsClaimedExclusive] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState({
    original: false,
    unedited: false,
    notShared: false,
    agreeTerms: false,
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allTermsAccepted = Object.values(acceptedTerms).every(Boolean);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("video/")) {
      setFile(dropped);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) { setError("Please select a video file."); return; }
    if (!title.trim()) { setError("Title is required."); return; }
    if (!category) { setError("Please select a category."); return; }

    setUploading(true);
    setError("");

    try {
      const duration = await new Promise<number>((resolve) => {
        const videoEl = document.createElement("video");
        videoEl.preload = "metadata";
        videoEl.onloadedmetadata = () => {
          URL.revokeObjectURL(videoEl.src);
          resolve(Math.floor(videoEl.duration));
        };
        videoEl.onerror = () => resolve(0);
        videoEl.src = URL.createObjectURL(file);
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("location", location);
      formData.append("recorded_date", recordedDate);
      formData.append("is_claimed_exclusive", String(isClaimedExclusive));
      formData.append("accepted_terms", "true");
      formData.append("duration_seconds", String(duration));

      await videoApi.upload(formData);
      router.push("/videos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (isBlocked) {
    return (
      <AppShell>
        <div className="space-y-6">
          <PageHeader title="Upload Video" />
          <Card>
            <div className="flex flex-col items-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger-light">
                <svg className="h-8 w-8 text-danger" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Account {user?.account_status === "frozen" ? "Frozen" : "Suspended"}</h2>
              <p className="mt-2 max-w-sm text-sm text-muted">
                Your account has been {user?.account_status === "frozen" ? "frozen" : "suspended"} and you cannot upload videos at this time. Please contact the admin for more information.
              </p>
              <Button variant="secondary" className="mt-6" onClick={() => router.push("/")}>
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Upload Video" description="Upload a new video and contribute to the platform." />

        {/* Step Indicator */}
        <div className="flex items-center gap-4">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                i + 1 <= step ? "bg-accent text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {i + 1 < step ? "✓" : i + 1}
              </div>
              <span className={`text-sm ${i + 1 <= step ? "font-medium text-gray-900" : "text-gray-400"}`}>{s}</span>
              {i < STEPS.length - 1 && <div className="mx-2 h-px w-8 bg-gray-200" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Video Details */}
          {step === 1 && (
            <div className="space-y-6">
              <Card>
                <h3 className="mb-4 text-sm font-semibold">Video File</h3>
                <input
                  ref={fileInputRef} type="file" accept="video/*" className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {!file ? (
                  <div
                    onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 transition ${
                      dragging ? "border-accent bg-accent/5" : "border-gray-200 hover:border-accent/40"
                    }`}
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <img src="/digi-web-pro-assets/icons/upload.svg" alt="" className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Drag & drop your video here</p>
                    <p className="mt-1 text-xs text-muted">or browse files</p>
                    <p className="mt-3 text-[11px] text-gray-400">MP4, MOV, WebM &middot; Max 2GB</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-gray-50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <img src="/digi-web-pro-assets/icons/video.svg" alt="" className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="truncate text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                    <button type="button" onClick={() => setFile(null)} className="cursor-pointer text-xs text-danger hover:text-red-700">Remove</button>
                  </div>
                )}
              </Card>

              <Card>
                <h3 className="mb-4 text-sm font-semibold">Video Details</h3>
                <div className="space-y-4">
                  <Input label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. City Street View" />
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">Description</label>
                    <textarea
                      value={description} onChange={(e) => setDescription(e.target.value)}
                      rows={3} placeholder="Describe your video..."
                      className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Select label="Category" required options={CATEGORIES} value={category} onChange={(e) => setCategory(e.target.value)} />
                    <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Dhaka, Bangladesh" />
                  </div>
                  <Input label="Recorded Date" type="date" value={recordedDate} onChange={(e) => setRecordedDate(e.target.value)} />
                  <label className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <input
                      type="checkbox" checked={isClaimedExclusive}
                      onChange={(e) => setIsClaimedExclusive(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <div>
                      <p className="text-sm font-medium">Claim as Exclusive</p>
                      <p className="text-xs text-muted">Request double payment rate. Subject to admin approval.</p>
                    </div>
                  </label>
                </div>
              </Card>
            </div>
          )}

          {/* Step 2: Terms */}
          {step === 2 && (
            <Card>
              <h3 className="mb-4 text-sm font-semibold">Before submitting, confirm:</h3>
              <div className="space-y-3">
                {[
                  { key: "original" as const, text: "This video was recorded by me." },
                  { key: "unedited" as const, text: "This video is original and unedited." },
                  { key: "notShared" as const, text: "This video has not been uploaded or shared on another platform." },
                  { key: "agreeTerms" as const, text: "I agree to Digi Web Pro's contributor terms." },
                ].map(({ key, text }) => (
                  <label key={key} className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <input
                      type="checkbox" checked={acceptedTerms[key]}
                      onChange={(e) => setAcceptedTerms((prev) => ({ ...prev, [key]: e.target.checked }))}
                      className="mt-0.5 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{text}</span>
                  </label>
                ))}
              </div>
              {!allTermsAccepted && (
                <p className="mt-4 text-xs text-warning">All declarations must be accepted to proceed.</p>
              )}
            </Card>
          )}

          {/* Step 3: Preview */}
          {step === 3 && (
            <Card>
              <h3 className="mb-4 text-sm font-semibold">Preview & Submit</h3>
              {file && (
                <div className="mb-4 overflow-hidden rounded-lg bg-gray-900">
                  <video src={URL.createObjectURL(file)} controls className="w-full" style={{ aspectRatio: "16/9", objectFit: "contain" }} />
                </div>
              )}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted">Title</span><span>{title}</span></div>
                <div className="flex justify-between"><span className="text-muted">Category</span><span>{category}</span></div>
                <div className="flex justify-between"><span className="text-muted">Location</span><span>{location || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted">Recorded</span><span>{recordedDate || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted">Exclusive</span><span>{isClaimedExclusive ? "Yes" : "No"}</span></div>
              </div>
            </Card>
          )}

          {error && (
            <div className="rounded-lg border border-danger-light bg-danger-light p-3 text-xs text-danger">{error}</div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            {step > 1 ? (
              <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>Previous</Button>
            ) : <div />}
            {step < 3 ? (
              <Button type="button" onClick={() => setStep(step + 1)}
                disabled={step === 2 && !allTermsAccepted}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={uploading}>
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <img src="/digi-web-pro-assets/loaders/spinner.svg" alt="" className="h-4 w-4 animate-spin" />
                    Uploading...
                  </span>
                ) : "Submit Video"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </AppShell>
  );
}
