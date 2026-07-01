"use client";

import { useMemo, useState } from "react";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  accessor: (row: T) => string | number | null | undefined;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
};

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchPlaceholder = "Buscar...",
  pageSize = 10,
  onRowClick,
}: {
  data: T[];
  columns: DataTableColumn<T>[];
  searchPlaceholder?: string;
  pageSize?: number;
  onRowClick?: (row: T) => void;
}) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const term = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => String(col.accessor(row) ?? "").toLowerCase().includes(term))
    );
  }, [data, search, columns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return filtered;
    return [...filtered].sort((a, b) => {
      const va = col.accessor(a) ?? "";
      const vb = col.accessor(b) ?? "";
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = sorted.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-secondary" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-border-subtle bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-black/[0.02]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-medium text-foreground-secondary",
                    col.sortable && "cursor-pointer select-none"
                  )}
                  onClick={() => col.sortable && toggleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-foreground-secondary">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
            {pageData.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "border-b border-border-subtle last:border-0",
                  onRowClick && "cursor-pointer hover:bg-black/[0.02]"
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-foreground">
                    {col.render ? col.render(row) : String(col.accessor(row) ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between text-sm text-foreground-secondary">
          <span>
            Página {page} de {totalPages} · {sorted.length} registros
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-md border border-border-subtle px-3 py-1 disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-md border border-border-subtle px-3 py-1 disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
