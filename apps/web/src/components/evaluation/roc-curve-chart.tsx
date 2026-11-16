"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RocCurvePoint } from "@/types/evaluation";

interface RocCurveChartProps {
  curve: RocCurvePoint[];
}

function formatPercentage(value: number) {
  return `${(value * 100).toFixed(0)}%`;
}

export function RocCurveChart({
  curve,
}: RocCurveChartProps) {
  const chartData = curve.map((point) => ({
    falsePositiveRate:
      point.false_positive_rate,
    truePositiveRate:
      point.true_positive_rate,
    randomRate:
      point.false_positive_rate,
  }));

  return (
    <div className="h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 20,
            bottom: 10,
            left: 0,
          }}
        >
          <CartesianGrid
            stroke="#e2e8f0"
            strokeDasharray="3 3"
          />

          <XAxis
            type="number"
            dataKey="falsePositiveRate"
            domain={[0, 1]}
            tickFormatter={formatPercentage}
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: "#94a3b8",
            }}
          />

          <YAxis
            domain={[0, 1]}
            tickFormatter={formatPercentage}
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: "#94a3b8",
            }}
          />

          <Tooltip
            cursor={false}
            formatter={(value, metricName) => [
              formatPercentage(
                Number(value),
              ),
              metricName ===
              "truePositiveRate"
                ? "Sensibilidade"
                : "Referência",
            ]}
            labelFormatter={(value) =>
              `Falsos positivos: ${formatPercentage(
                Number(value),
              )}`
            }
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          />

          <Line
            type="linear"
            dataKey="randomRate"
            stroke="#cbd5e1"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />

          <Line
            type="linear"
            dataKey="truePositiveRate"
            stroke="#087b15"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}