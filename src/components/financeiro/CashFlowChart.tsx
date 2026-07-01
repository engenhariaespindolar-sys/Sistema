"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency, formatDate } from "@/lib/format";
import type { FinanceiroLancamento } from "@/types/database";

export function CashFlowChart({ lancamentos }: { lancamentos: FinanceiroLancamento[] }) {
  const data = lancamentos.reduce<{ data: string; saldo: number }[]>((acc, l) => {
    const anterior = acc.length > 0 ? acc[acc.length - 1].saldo : 0;
    const saldo = anterior + (l.tipo === "entrada" ? Number(l.valor) : -Number(l.valor));
    return [...acc, { data: l.data, saldo }];
  }, []);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E0E2E5" vertical={false} />
        <XAxis dataKey="data" tick={{ fontSize: 11, fill: "#5F6368" }} tickFormatter={(v) => formatDate(v)} />
        <YAxis
          tick={{ fontSize: 11, fill: "#5F6368" }}
          tickFormatter={(v) => formatCurrency(v)}
          width={90}
        />
        <Tooltip
          contentStyle={{ borderRadius: 8, borderColor: "#E0E2E5", fontSize: 12 }}
          formatter={(value) => formatCurrency(Number(value))}
          labelFormatter={(v) => formatDate(v)}
        />
        <Line type="monotone" dataKey="saldo" stroke="#6D1F2D" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
