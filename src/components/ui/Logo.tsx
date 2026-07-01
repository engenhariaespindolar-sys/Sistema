import { cn } from "@/lib/utils";

/**
 * Wordmark aproximado da identidade visual enviada pelo cliente (casa + "E").
 * Substituir por public/logo.svg quando o arquivo original for exportado.
 */
export function Logo({ className, iconOnly = false }: { className?: string; iconOnly?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg viewBox="0 0 48 48" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8 22L24 8L40 22"
          stroke="var(--brand-primary)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 22V38H36V22"
          stroke="var(--brand-primary)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M17 29H31" stroke="var(--brand-primary)" strokeWidth="4" strokeLinecap="round" />
      </svg>
      {!iconOnly && (
        <span className="font-semibold tracking-wide text-foreground">ESPINDOLAR</span>
      )}
    </span>
  );
}
