"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/operacoes", label: "Operações", icon: Building2 },
  { href: "/indicadores", label: "Indicadores", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-14 flex h-[calc(100vh-56px)] shrink-0 flex-col border-r border-border-subtle bg-surface transition-all",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-primary-light text-brand-primary"
                  : "text-foreground-secondary hover:bg-black/[0.04]"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center gap-2 border-t border-border-subtle p-3 text-xs text-foreground-secondary hover:bg-black/[0.04]"
      >
        {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        {!collapsed && "Recolher"}
      </button>
    </aside>
  );
}
