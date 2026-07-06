"use client";

import { useRouter } from "next/navigation";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { operacaoStatusInfo } from "@/lib/status";
import { formatDate, formatCurrency } from "@/lib/format";
import type { Operacao } from "@/types/database";

export function EtapaLista({
  operacoes,
  tabDetalhe,
  mostrarStatus = true,
  mostrarValorAnuncio = false,
}: {
  operacoes: Operacao[];
  tabDetalhe: string;
  mostrarStatus?: boolean;
  mostrarValorAnuncio?: boolean;
}) {
  const router = useRouter();

  const columns: DataTableColumn<Operacao>[] = [
    { key: "codigo", header: "Código", accessor: (row) => row.codigo, sortable: true },
    { key: "endereco", header: "Endereço", accessor: (row) => row.endereco, sortable: true },
    { key: "cidade", header: "Cidade", accessor: (row) => row.cidade, sortable: true },
  ];

  if (mostrarValorAnuncio) {
    columns.push({
      key: "valor_anuncio",
      header: "Valor anunciado",
      accessor: (row) => row.valor_anuncio,
      sortable: true,
      render: (row) => (row.valor_anuncio != null ? formatCurrency(row.valor_anuncio) : "-"),
    });
  }

  if (mostrarStatus) {
    columns.push({
      key: "status",
      header: "Status",
      accessor: (row) => row.status,
      sortable: true,
      render: (row) => {
        const info = operacaoStatusInfo(row.status);
        return <StatusBadge label={info.label} tone={info.tone} />;
      },
    });
  }

  columns.push({
    key: "updated_at",
    header: "Atualizado em",
    accessor: (row) => row.updated_at,
    sortable: true,
    render: (row) => formatDate(row.updated_at),
  });

  return (
    <DataTable
      data={operacoes}
      columns={columns}
      searchPlaceholder="Buscar por código, endereço..."
      onRowClick={(row) => router.push(`/operacoes/${row.id}${tabDetalhe}`)}
    />
  );
}
