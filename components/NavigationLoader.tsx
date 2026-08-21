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
      timerRef.current = setTimeout(() => setLoading(false), 350);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [pathname, loading]);

  if (!loading) return null;

  return (
    <div className="fixed left-0 top-0 z-[9999] h-1 w-full">
      <div className="h-full bg-accent rounded-r-full animate-loading-bar" />
    </div>
  );
}
