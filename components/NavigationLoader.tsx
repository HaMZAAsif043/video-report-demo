"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function NavigationLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http")) return;
      if (href === pathname) return;
      setLoading(true);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  useEffect(() => {
    if (loading) {
      timerRef.current = setTimeout(() => setLoading(false), 400);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [pathname, loading]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        {/* Spinner ring */}
        <svg
          className="h-20 w-20 animate-spin"
          viewBox="0 0 50 50"
          style={{ animationDuration: "1s" }}
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="4"
          />
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#6366f1"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="80, 200"
            strokeDashoffset="0"
          />
        </svg>
        {/* Logo centered inside */}
        <img
          src="/digi-web-pro-assets/brand/digi-web-pro-mark.svg"
          alt="Loading..."
          className="absolute h-8 w-8"
        />
      </div>
    </div>
  );
}
