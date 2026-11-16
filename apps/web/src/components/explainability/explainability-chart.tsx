"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ExplainabilityFeature } from "@/types/analysis";

interface ExplainabilityChartProps {
  features: ExplainabilityFeature[];
}

export function ExplainabilityChart({
  features,
}: ExplainabilityChartProps) {
  const chartData = [...features].reverse();

  return (
    <div className="h-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 8,
            right: 28,
            bottom: 8,
            left: 30,
          }}
        >
          <CartesianGrid
            horizontal={false}
            stroke="#e2e8f0"
            strokeDasharray="3 3"
          />

          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: "#94a3b8",
            }}
          />

          <YAxis
            type="category"
            dataKey="label"
            width={175}
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: "#475569",
            }}
          />

          <Tooltip
            formatter={(value) => [
              Number(value).toFixed(4),
              "Importância",
            ]}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)",
            }}
          />

          <Bar
            dataKey="importance"
            fill="#087b15"
            radius={[0, 7, 7, 0]}
            barSize={25}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}