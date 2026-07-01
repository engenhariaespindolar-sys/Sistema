import type { ReactNode } from "react";

export function PageHeader({
  title,
  breadcrumb,
  actions,
}: {
  title: string;
  breadcrumb?: string[];
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="text-xs text-foreground-secondary mb-1">
            {breadcrumb.join("  /  ")}
          </nav>
        )}
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
