"use client";

import { useState, type ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange: (tabId: string) => void;
  children: ReactNode;
}

export function Tabs({ tabs, activeTab, onChange, children }: TabsProps) {
  const [active, setActive] = useState(activeTab || tabs[0]?.id || "");
  const current = activeTab || active;

  const handleChange = (id: string) => {
    setActive(id);
    onChange(id);
  };

  return (
    <div>
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleChange(tab.id)}
            className={`cursor-pointer flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              current === tab.id
                ? "border-accent text-accent"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                current === tab.id ? "bg-accent/10 text-accent" : "bg-gray-100 text-gray-500"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="pt-4">{children}</div>
    </div>
  );
}
