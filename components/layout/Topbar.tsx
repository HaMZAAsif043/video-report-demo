"use client";

import { useAuth } from "@/lib/auth-context";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-white/80 px-6 backdrop-blur-md">
      <div />
      <div className="flex items-center gap-3">
        <button className="cursor-pointer relative rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
            {user?.first_name?.[0] || user?.username?.[0] || "?"}
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold">{user?.first_name} {user?.last_name}</p>
            <p className="text-[10px] text-muted capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
