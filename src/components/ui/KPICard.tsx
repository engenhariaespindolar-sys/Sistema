import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";
import { cn } from "@/lib/utils";

export function KPICard({
  label,
  value,
  icon: Icon,
  variation,
  variationTone = "neutral",
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  variation?: string;
  variationTone?: "positive" | "negative" | "neutral";
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <span className="text-sm text-foreground-secondary">{label}</span>
        {Icon && (
          <div className="rounded-lg bg-brand-primary-light p-2">
            <Icon className="h-4 w-4 text-brand-primary" />
          </div>
        )}
      </div>
      <div className="mt-2 text-2xl font-semibold text-foreground">{value}</div>
      {variation && (
        <div
          className={cn(
            "mt-1 text-xs font-medium",
            variationTone === "positive" && "text-success",
            variationTone === "negative" && "text-danger",
            variationTone === "neutral" && "text-foreground-secondary"
          )}
        >
          {variation}
        </div>
      )}
    </Card>
  );
}
