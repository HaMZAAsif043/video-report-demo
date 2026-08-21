"use client";

import { type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-60 flex-1">
        <Topbar />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
