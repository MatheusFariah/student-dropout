"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  AcademicPerformanceItem,
  AgeDistributionItem,
  CorrelationItem,
  FinancialFactorItem,
} from "@/types/dataset";

interface ExplorationChartsProps {
  ageDistribution: AgeDistributionItem[];
  financialFactors: FinancialFactorItem[];
  academicPerformance: AcademicPerformanceItem[];
  correlations: CorrelationItem[];
}

export function ExplorationCharts({
  ageDistribution,
  financialFactors,
  academicPerformance,
  correlations,
}: ExplorationChartsProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-950">
              Idade na matrícula
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Volume de estudantes e taxa de evasão por faixa etária.
            </p>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={ageDistribution}>
                <CartesianGrid
                  vertical={false}
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="range"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#64748b",
                  }}
                />

                <YAxis
                  yAxisId="students"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#94a3b8",
                  }}
                />

                <YAxis
                  yAxisId="dropout"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                  tick={{
                    fontSize: 12,
                    fill: "#94a3b8",
                  }}
                />

                <Tooltip />

                <Legend />

                <Bar
                  yAxisId="students"
                  dataKey="total"
                  name="Estudantes"
                  fill="#cbd5e1"
                  radius={[6, 6, 0, 0]}
                />

                <Line
                  yAxisId="dropout"
                  type="monotone"
                  dataKey="dropout_rate"
                  name="Taxa de evasão"
                  stroke="#087b15"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#087b15",
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-950">
              Indicadores financeiros
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Taxa de evasão observada em diferentes condições financeiras.
            </p>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={financialFactors}
                layout="vertical"
                margin={{
                  left: 20,
                  right: 20,
                }}
              >
                <CartesianGrid
                  horizontal={false}
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                />

                <XAxis
                  type="number"
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                  tick={{
                    fontSize: 12,
                    fill: "#94a3b8",
                  }}
                />

                <YAxis
                  type="category"
                  dataKey="status"
                  width={120}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#475569",
                  }}
                />

                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toFixed(1)}%`,
                    "Taxa de evasão",
                  ]}
                />

                <Bar
                  dataKey="dropout_rate"
                  name="Taxa de evasão"
                  fill="#087b15"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-950">
              Aprovações por situação acadêmica
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Média de unidades aprovadas no primeiro e segundo semestre.
            </p>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={academicPerformance}>
                <CartesianGrid
                  vertical={false}
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#64748b",
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#94a3b8",
                  }}
                />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="first_sem_approved"
                  name="1º semestre"
                  fill="#94a3b8"
                  radius={[6, 6, 0, 0]}
                />

                <Bar
                  dataKey="second_sem_approved"
                  name="2º semestre"
                  fill="#087b15"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-950">
              Principais correlações com evasão
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Associação linear das variáveis numéricas com a classe de evasão.
            </p>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={correlations}
                layout="vertical"
                margin={{
                  left: 40,
                  right: 20,
                }}
              >
                <CartesianGrid
                  horizontal={false}
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                />

                <XAxis
                  type="number"
                  domain={[-0.7, 0.7]}
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
                  width={150}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "#475569",
                  }}
                />

                <Tooltip
                  formatter={(value) => [
                    Number(value).toFixed(3),
                    "Correlação",
                  ]}
                />

                <Bar
                  dataKey="correlation"
                  name="Correlação"
                  fill="#087b15"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            Correlação indica associação linear e não implica causalidade.
          </p>
        </section>
      </div>
    </div>
  );
}