"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TargetDistributionItem {
  name: string;
  label: string;
  value: number;
  percentage: number;
}

interface DashboardChartsProps {
  targetDistribution: TargetDistributionItem[];
  dropoutCount: number;
  nonDropoutCount: number;
}

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR");
}

function formatPercentage(value: number) {
  return `${value.toFixed(1).replace(".", ",")}%`;
}

export function DashboardCharts({
  targetDistribution,
  dropoutCount,
  nonDropoutCount,
}: DashboardChartsProps) {
  const binaryTotal = dropoutCount + nonDropoutCount;

  const binaryDistribution = [
    {
      name: "Não evasão",
      value: nonDropoutCount,
      percentage: (nonDropoutCount / binaryTotal) * 100,
    },
    {
      name: "Evasão",
      value: dropoutCount,
      percentage: (dropoutCount / binaryTotal) * 100,
    },
  ];

  const pieColors = ["#16a34a", "#ef4444"];

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold tracking-tight text-slate-950">
            Distribuição original
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Composição das três classes presentes no conjunto de dados.
          </p>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={targetDistribution}
              layout="vertical"
              margin={{
                top: 8,
                right: 28,
                bottom: 8,
                left: 12,
              }}
            >
              <CartesianGrid
                horizontal={false}
                strokeDasharray="3 3"
                stroke="#e2e8f0"
              />

              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 12,
                }}
              />

              <YAxis
                type="category"
                dataKey="label"
                axisLine={false}
                tickLine={false}
                width={92}
                tick={{
                  fill: "#475569",
                  fontSize: 13,
                }}
              />

              <Tooltip
                cursor={{
                  fill: "#f8fafc",
                }}
                formatter={(value) => [
                  formatNumber(Number(value)),
                  "Estudantes",
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)",
                }}
              />

              <Bar
                dataKey="value"
                fill="#16a34a"
                radius={[0, 8, 8, 0]}
                barSize={34}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {targetDistribution.map((targetItem) => (
            <div
              key={targetItem.name}
              className="rounded-xl bg-slate-50 px-4 py-3"
            >
              <p className="text-xs font-medium text-slate-500">
                {targetItem.label}
              </p>

              <div className="mt-1 flex items-end justify-between gap-3">
                <span className="text-lg font-semibold text-slate-950">
                  {formatNumber(targetItem.value)}
                </span>

                <span className="text-xs font-medium text-slate-500">
                  {formatPercentage(targetItem.percentage)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-950">
            Classificação utilizada
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Conversão do alvo original para evasão e não evasão.
          </p>
        </div>

        <div className="relative mt-2 h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={binaryDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius={76}
                outerRadius={105}
                paddingAngle={3}
                strokeWidth={0}
              >
                {binaryDistribution.map((binaryItem, binaryIndex) => (
                  <Cell
                    key={binaryItem.name}
                    fill={pieColors[binaryIndex]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  formatNumber(Number(value)),
                  "Estudantes",
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold tracking-tight text-slate-950">
              {formatNumber(binaryTotal)}
            </span>

            <span className="text-xs text-slate-500">estudantes</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {binaryDistribution.map((binaryItem, binaryIndex) => (
            <div
              key={binaryItem.name}
              className="rounded-xl border border-slate-200 px-4 py-4"
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{
                    backgroundColor: pieColors[binaryIndex],
                  }}
                />

                <span className="text-sm font-medium text-slate-600">
                  {binaryItem.name}
                </span>
              </div>

              <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                {formatPercentage(binaryItem.percentage)}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {formatNumber(binaryItem.value)} estudantes
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}