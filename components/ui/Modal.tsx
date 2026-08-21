"use client";

import { useEffect, useState, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted || !open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} rounded-xl border border-border bg-white p-6 shadow-xl`}>
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">{title}</h2>
            <button onClick={onClose} className="cursor-pointer text-gray-400 hover:text-gray-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: "primary" | "danger";
  loading?: boolean;
  children?: ReactNode;
}

export function ConfirmModal({
  open, onClose, onConfirm, title, message,
  confirmLabel = "Confirm", confirmVariant = "danger", loading, children,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-gray-600">{message}</p>
      {children}
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="cursor-pointer rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-50 ${
            confirmVariant === "danger" ? "bg-danger hover:bg-red-600" : "bg-accent hover:bg-accent-hover"
          }`}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <img src="/digi-web-pro-assets/loaders/spinner.svg" alt="" className="h-4 w-4 animate-spin" />
              Processing...
            </span>
          ) : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
