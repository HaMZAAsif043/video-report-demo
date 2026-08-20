import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "./components/Sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "iNews Newsroom",
  description: "Create, upload, review, and manage video reports.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="flex min-h-screen bg-canvas text-gray-900 antialiased">
        <Sidebar />

        {/* Main area */}
        <div className="ml-56 flex-1">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-white/80 px-6 backdrop-blur-md">
            <div />
            <div className="flex items-center gap-3">
              <button className="relative rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  3
                </span>
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                H
              </div>
            </div>
          </header>

          {/* Page content */}
          <div className="p-6">{children}</div>
        </div>
      </body>
    </html>
  );
}
