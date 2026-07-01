import { cn } from "@/lib/utils";

export type BadgeTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "brand"
  | "neutral";

const TONE_CLASSES: Record<BadgeTone, string> = {
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-[#a15c00]",
  danger: "bg-danger-light text-danger",
  info: "bg-info-light text-info",
  brand: "bg-brand-primary-light text-brand-primary",
  neutral: "bg-black/5 text-foreground-secondary",
};

export function StatusBadge({
  label,
  tone = "neutral",
  className,
}: {
  label: string;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        TONE_CLASSES[tone],
        className
      )}
    >
      {label}
    </span>
  );
}
