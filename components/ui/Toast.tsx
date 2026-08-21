"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles = {
    success: "bg-success text-white",
    error: "bg-danger text-white",
    info: "bg-info text-white",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all duration-300 ${styles[type]} ${
          visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
