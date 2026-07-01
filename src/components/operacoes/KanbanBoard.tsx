"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { MapPin, Home } from "lucide-react";
import { OPERACAO_STATUS_ORDER, operacaoStatusInfo } from "@/lib/status";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Operacao } from "@/types/database";
import { updateOperacaoStatus } from "@/app/(app)/operacoes/actions";

function OperacaoCard({ operacao }: { operacao: Operacao }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: operacao.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`mb-2 cursor-grab rounded-lg border border-border-subtle bg-surface p-3 shadow-sm active:cursor-grabbing ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Link
        href={`/operacoes/${operacao.id}`}
        onClick={(e) => isDragging && e.preventDefault()}
        className="block"
      >
        <div className="mb-1 text-xs font-medium text-foreground-secondary">
          {operacao.codigo}
        </div>
        <div className="mb-2 flex items-start gap-1.5 text-sm font-medium text-foreground">
          <Home className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground-secondary" />
          <span className="line-clamp-2">{operacao.endereco}</span>
        </div>
        {operacao.cidade && (
          <div className="flex items-center gap-1 text-xs text-foreground-secondary">
            <MapPin className="h-3 w-3" />
            {operacao.cidade}
            {operacao.estado ? `/${operacao.estado}` : ""}
          </div>
        )}
      </Link>
    </div>
  );
}

function KanbanColumn({
  status,
  operacoes,
}: {
  status: string;
  operacoes: Operacao[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const info = operacaoStatusInfo(status);

  return (
    <div
      ref={setNodeRef}
      className={`w-64 shrink-0 rounded-xl border border-border-subtle bg-black/[0.02] p-2 ${
        isOver ? "ring-2 ring-brand-primary" : ""
      }`}
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <StatusBadge label={info.label} tone={info.tone} />
        <span className="text-xs text-foreground-secondary">{operacoes.length}</span>
      </div>
      <div className="max-h-[65vh] overflow-y-auto px-0.5">
        {operacoes.map((op) => (
          <OperacaoCard key={op.id} operacao={op} />
        ))}
      </div>
    </div>
  );
}

export function KanbanBoard({ operacoes }: { operacoes: Operacao[] }) {
  const router = useRouter();
  const [items, setItems] = useState(operacoes);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const columns = useMemo(() => {
    return OPERACAO_STATUS_ORDER.map((status) => ({
      status,
      operacoes: items.filter((op) => op.status === status),
    }));
  }, [items]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const newStatus = String(over.id);
    const operacaoId = String(active.id);
    const current = items.find((op) => op.id === operacaoId);
    if (!current || current.status === newStatus) return;

    setItems((prev) =>
      prev.map((op) => (op.id === operacaoId ? { ...op, status: newStatus as Operacao["status"] } : op))
    );

    try {
      await updateOperacaoStatus(operacaoId, newStatus);
      router.refresh();
    } catch {
      setItems(operacoes);
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {columns.map((col) => (
          <KanbanColumn key={col.status} status={col.status} operacoes={col.operacoes} />
        ))}
      </div>
    </DndContext>
  );
}
