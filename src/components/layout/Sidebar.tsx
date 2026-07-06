"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Search,
  Calculator,
  Gavel,
  Hammer,
  Tag,
  BarChart3,
  Building2,
  Wallet,
  Truck,
  ChevronsLeft,
  ChevronsRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: LucideIcon };

const NAV_SECTIONS: { titulo: string | null; items: NavItem[] }[] = [
  {
    titulo: null,
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    titulo: "Esteira",
    items: [
      { href: "/prospeccao", label: "Prospecção", icon: Search },
      { href: "/analise", label: "Análise", icon: Calculator },
      { href: "/aquisicao", label: "Aquisição", icon: Gavel },
      { href: "/reforma", label: "Reforma", icon: Hammer },
      { href: "/venda", label: "Venda", icon: Tag },
      { href: "/resultados", label: "Resultados", icon: BarChart3 },
    ],
  },
  {
    titulo: "Gestão",
    items: [
      { href: "/ativos", label: "Ativos", icon: Building2 },
      { href: "/fluxo-caixa", label: "Fluxo de caixa", icon: Wallet },
      { href: "/fornecedores", label: "Fornecedores", icon: Truck },
    ],
  },
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
      <nav className="flex-1 overflow-y-auto p-3">
        {NAV_SECTIONS.map((section, i) => (
          <div key={i} className={i > 0 ? "mt-4" : undefined}>
            {section.titulo && !collapsed && (
              <p className="mb-1 px-3 text-[11px] font-medium uppercase tracking-wide text-foreground-secondary">
                {section.titulo}
              </p>
            )}
            {section.titulo && collapsed && <div className="my-2 border-t border-border-subtle" />}
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = pathname?.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
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
            </div>
          </div>
        ))}
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
