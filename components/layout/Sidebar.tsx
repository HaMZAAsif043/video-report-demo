"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const contributorNav = [
  { label: "Dashboard", href: "/", icon: "home" },
  { label: "My Videos", href: "/videos", icon: "video" },
  { label: "Upload Video", href: "/upload", icon: "upload" },
  { label: "Exclusive Requests", href: "/exclusive-requests", icon: "star" },
  { label: "Payments", href: "/payments", icon: "payment" },
  { label: "Profile", href: "/profile", icon: "user" },
];

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: "home" },
  { label: "Review Videos", href: "/admin/videos", icon: "video" },
  { label: "Contributors", href: "/admin/contributors", icon: "users" },
  { label: "Payments", href: "/admin/payments", icon: "payment" },
  { label: "Exclusive Requests", href: "/admin/exclusive-requests", icon: "star" },
  { label: "Violations", href: "/admin/violations", icon: "warning" },
  { label: "Profile", href: "/profile", icon: "user" },
];

function NavIcon({ name }: { name: string }) {
  const cls = "h-5 w-5";
  const assetIcons: Record<string, string> = {
    video: "/digi-web-pro-assets/icons/video.svg",
    upload: "/digi-web-pro-assets/icons/upload.svg",
    payment: "/digi-web-pro-assets/icons/payment.svg",
  };
  if (assetIcons[name]) {
    return <img src={assetIcons[name]} alt="" className={cls} />;
  }
  const icons: Record<string, JSX.Element> = {
    home: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    star: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    user: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    users: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    warning: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  };
  return icons[name] || null;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const navItems = (isAdmin ? adminNav : contributorNav).filter(
    (item) => user?.account_status === "active" || (item.href !== "/upload" && item.href !== "/exclusive-requests")
  );

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-white">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-5">
        <img src="/digi-web-pro-assets/brand/digi-web-pro-mark.svg" alt="Digi Web Pro" className="h-8 w-8" />
        <div className="leading-none">
          <span className="text-sm font-bold tracking-tight">Digi Web Pro</span>
          <span className="block text-[10px] font-medium text-muted capitalize">{user?.role || "User"}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navItems.map((item) => {
          const isActive = item.href === "/"
            ? pathname === "/"
            : pathname === item.href;
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

      {/* User */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
            {user?.first_name?.[0] || user?.username?.[0] || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-[10px] text-muted capitalize">{user?.role}</p>
          </div>
          <button onClick={logout} className="cursor-pointer text-gray-400 hover:text-danger" title="Logout">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
