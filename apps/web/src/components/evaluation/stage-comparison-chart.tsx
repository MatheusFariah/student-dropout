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

import type { StageExperimentItem } from "@/types/stage-experiment";

interface StageComparisonChartProps {
  stages: StageExperimentItem[];
}

function formatPercentage(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export function StageComparisonChart({
  stages,
}: StageComparisonChartProps) {
  const chartData = stages.map((stage) => ({
    name: stage.label,
    Recall: stage.metrics.recall,
    "F1-score": stage.metrics.f1,
    "ROC-AUC": stage.metrics.roc_auc,
  }));

  return (
    <div className="h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          barGap={6}
          barCategoryGap="28%"
          margin={{
            top: 10,
            right: 20,
            bottom: 10,
            left: 0,
          }}
        >
          <CartesianGrid
            vertical={false}
            stroke="#e2e8f0"
            strokeDasharray="3 3"
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
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
            }}
          />

          <Legend
            wrapperStyle={{
              paddingTop: "18px",
              fontSize: "13px",
            }}
          />

          <Bar
            dataKey="Recall"
            fill="#94a3b8"
            radius={[5, 5, 0, 0]}
            maxBarSize={44}
          />

          <Bar
            dataKey="F1-score"
            fill="#64748b"
            radius={[5, 5, 0, 0]}
            maxBarSize={44}
          />

          <Bar
            dataKey="ROC-AUC"
            fill="#087b15"
            radius={[5, 5, 0, 0]}
            maxBarSize={44}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}