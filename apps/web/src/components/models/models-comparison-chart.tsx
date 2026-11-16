"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ModelResult } from "@/types/models";

interface ModelsComparisonChartProps {
  models: ModelResult[];
}

function formatPercentage(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export function ModelsComparisonChart({
  models,
}: ModelsComparisonChartProps) {
  const chartData = models.map((model) => ({
    name: model.name,
    Precision: model.metrics.precision,
    Recall: model.metrics.recall,
    "F1-score": model.metrics.f1,
  }));

  return (
    <div className="h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 12,
            right: 20,
            bottom: 10,
            left: 0,
          }}
          barGap={6}
          barCategoryGap="28%"
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="#e2e8f0"
          />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: "#64748b",
            }}
          />

          <YAxis
            domain={[0, 1]}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatPercentage}
            tick={{
              fontSize: 12,
              fill: "#94a3b8",
            }}
          />

          <Tooltip
            cursor={false}
            formatter={(value, metricName) => [
              formatPercentage(Number(value)),
              metricName,
            ]}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow:
                "0 8px 24px rgba(15, 23, 42, 0.08)",
              padding: "12px 14px",
            }}
            labelStyle={{
              color: "#0f172a",
              fontWeight: 600,
              marginBottom: "6px",
            }}
            itemStyle={{
              fontSize: "13px",
            }}
          />

          <Legend
            verticalAlign="bottom"
            wrapperStyle={{
              paddingTop: "18px",
              fontSize: "13px",
            }}
          />

          <Bar
            dataKey="Precision"
            fill="#64748b"
            radius={[5, 5, 0, 0]}
            maxBarSize={42}
          />

          <Bar
            dataKey="Recall"
            fill="#94a3b8"
            radius={[5, 5, 0, 0]}
            maxBarSize={42}
          />

          <Bar
            dataKey="F1-score"
            fill="#087b15"
            radius={[5, 5, 0, 0]}
            maxBarSize={42}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}