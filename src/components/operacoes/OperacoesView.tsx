"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { KanbanBoard } from "./KanbanBoard";
import { OPERACAO_STATUS_ORDER, operacaoStatusInfo } from "@/lib/status";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Operacao } from "@/types/database";

export function OperacoesView({
  operacoes,
  equipeMap,
}: {
  operacoes: Operacao[];
  equipeMap: Record<string, string>;
}) {
  const router = useRouter();
  const [view, setView] = useState<"kanban" | "lista">("kanban");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [cidadeFiltro, setCidadeFiltro] = useState("todas");
  const [responsavelFiltro, setResponsavelFiltro] = useState("todos");

  const cidades = useMemo(
    () => Array.from(new Set(operacoes.map((o) => o.cidade).filter(Boolean))) as string[],
    [operacoes]
  );

  const filtradas = useMemo(() => {
    return operacoes.filter((op) => {
      if (statusFiltro !== "todos" && op.status !== statusFiltro) return false;
      if (cidadeFiltro !== "todas" && op.cidade !== cidadeFiltro) return false;
      if (responsavelFiltro !== "todos" && op.responsavel_id !== responsavelFiltro) return false;
      return true;
    });
  }, [operacoes, statusFiltro, cidadeFiltro, responsavelFiltro]);

  const columns: DataTableColumn<Operacao>[] = [
    {
      key: "codigo",
      header: "Código",
      accessor: (row) => row.codigo,
      sortable: true,
    },
    {
      key: "endereco",
      header: "Endereço",
      accessor: (row) => row.endereco,
      sortable: true,
    },
    {
      key: "cidade",
      header: "Cidade",
      accessor: (row) => row.cidade,
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      accessor: (row) => row.status,
      sortable: true,
      render: (row) => {
        const info = operacaoStatusInfo(row.status);
        return <StatusBadge label={info.label} tone={info.tone} />;
      },
    },
    {
      key: "responsavel",
      header: "Responsável",
      accessor: (row) => (row.responsavel_id ? equipeMap[row.responsavel_id] ?? "-" : "-"),
    },
    {
      key: "updated_at",
      header: "Atualizado em",
      accessor: (row) => row.updated_at,
      sortable: true,
      render: (row) => formatDate(row.updated_at),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
          className="rounded-lg border border-border-subtle bg-surface px-3 py-1.5 text-sm"
        >
          <option value="todos">Todos os status</option>
          {OPERACAO_STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {operacaoStatusInfo(s).label}
            </option>
          ))}
        </select>

        <select
          value={cidadeFiltro}
          onChange={(e) => setCidadeFiltro(e.target.value)}
          className="rounded-lg border border-border-subtle bg-surface px-3 py-1.5 text-sm"
        >
          <option value="todas">Todas as cidades</option>
          {cidades.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={responsavelFiltro}
          onChange={(e) => setResponsavelFiltro(e.target.value)}
          className="rounded-lg border border-border-subtle bg-surface px-3 py-1.5 text-sm"
        >
          <option value="todos">Todos os responsáveis</option>
          {Object.entries(equipeMap).map(([id, nome]) => (
            <option key={id} value={id}>
              {nome}
            </option>
          ))}
        </select>

        <div className="ml-auto flex rounded-lg border border-border-subtle p-0.5">
          <button
            onClick={() => setView("kanban")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm",
              view === "kanban" ? "bg-brand-primary-light text-brand-primary" : "text-foreground-secondary"
            )}
          >
            <LayoutGrid className="h-4 w-4" /> Kanban
          </button>
          <button
            onClick={() => setView("lista")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm",
              view === "lista" ? "bg-brand-primary-light text-brand-primary" : "text-foreground-secondary"
            )}
          >
            <List className="h-4 w-4" /> Lista
          </button>
        </div>
      </div>

      {view === "kanban" ? (
        <KanbanBoard operacoes={filtradas} />
      ) : (
        <DataTable
          data={filtradas}
          columns={columns}
          searchPlaceholder="Buscar por código, endereço..."
          onRowClick={(row) => router.push(`/operacoes/${row.id}`)}
        />
      )}
    </div>
  );
}
