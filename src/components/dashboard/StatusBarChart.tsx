"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function StatusBarChart({
  data,
}: {
  data: { label: string; total: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E0E2E5" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#5F6368" }}
          interval={0}
          angle={-25}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fontSize: 11, fill: "#5F6368" }} allowDecimals={false} />
        <Tooltip
          cursor={{ fill: "rgba(109,31,45,0.06)" }}
          contentStyle={{ borderRadius: 8, borderColor: "#E0E2E5", fontSize: 12 }}
        />
        <Bar dataKey="total" fill="#6D1F2D" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
