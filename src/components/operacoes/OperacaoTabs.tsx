"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function OperacaoTabs({ id }: { id: string }) {
  const pathname = usePathname();
  const base = `/operacoes/${id}`;

  const tabs = [
    { href: base, label: "Visão geral" },
    { href: `${base}/viabilidade`, label: "Viabilidade" },
    { href: `${base}/documentos`, label: "Documentos" },
    { href: `${base}/desocupacao`, label: "Desocupação" },
    { href: `${base}/reforma`, label: "Reforma" },
    { href: `${base}/financeiro`, label: "Financeiro" },
    { href: `${base}/venda`, label: "Venda" },
    { href: `${base}/resultado`, label: "Resultado" },
  ];

  return (
    <div className="mb-6 flex gap-1 overflow-x-auto border-b border-border-subtle">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-foreground-secondary hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
