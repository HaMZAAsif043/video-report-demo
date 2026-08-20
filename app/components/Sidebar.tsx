"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarNav = [
  { label: "Dashboard", href: "/", icon: "home" },
  { label: "Upload Report", href: "/upload", icon: "upload" },
  { label: "Reports", href: "/reports", icon: "reports" },
];

function NavIcon({ name }: { name: string }) {
  const cls = "h-5 w-5";
  switch (name) {
    case "home":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      );
    case "upload":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      );
    case "reports":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-border bg-sidebar">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4h6l-2 8h4l-6 8 2-8H4l2-8z" />
          </svg>
        </div>
        <div className="leading-none">
          <span className="text-sm font-bold tracking-tight">iNews</span>
          <span className="block text-[10px] font-medium text-muted">Newsroom</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {sidebarNav.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-accent-light text-accent"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Storage */}
      <div className="mx-3 mb-3 rounded-xl border border-border bg-gray-50 p-4">
        <p className="text-[11px] font-medium text-muted">Storage Used</p>
        <p className="mt-1 text-lg font-bold">
          120 GB <span className="text-xs font-normal text-muted">/ 500 GB</span>
        </p>
        <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200">
          <div className="h-1.5 w-[24%] rounded-full bg-accent" />
        </div>
        <p className="mt-1 text-[11px] text-muted">24%</p>
      </div>

      {/* User */}
      <div className="flex items-center gap-3 border-t border-border px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
          H
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold">Hamza Asif</p>
          <p className="text-[10px] text-muted">Reporter</p>
        </div>
        <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </aside>
  );
}
