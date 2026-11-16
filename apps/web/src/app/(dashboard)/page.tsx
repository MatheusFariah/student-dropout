import { Suspense } from "react";

import {
  BrainCircuit,
  Database,
  GraduationCap,
  Target,
} from "lucide-react";

import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { Badge } from "@/components/ui/badge";
import { getDatasetSummary } from "@/lib/api/dataset";

const models = [
  {
    name: "DummyClassifier",
    type: "Baseline",
    description: "Referência mínima para comparação.",
  },
  {
    name: "Regressão Logística",
    type: "Classificação",
    description: "Modelo probabilístico e interpretável.",
  },
  {
    name: "Árvore de Decisão",
    type: "Classificação",
    description: "Classificação baseada em regras.",
  },
];

function formatPercentage(value: number) {
  return `${value.toFixed(1).replace(".", ",")}%`;
}

async function DashboardContent() {
  const datasetSummary = await getDatasetSummary();

  const graduateCount = datasetSummary.classes.graduate;
  const dropoutCount = datasetSummary.classes.dropout;
  const enrolledCount = datasetSummary.classes.enrolled;

  const nonDropoutCount = graduateCount + enrolledCount;

  const graduatePercentage =
    (graduateCount / datasetSummary.students) * 100;

  const dropoutPercentage =
    (dropoutCount / datasetSummary.students) * 100;

  const enrolledPercentage =
    (enrolledCount / datasetSummary.students) * 100;

  const metrics = [
    {
      title: "Estudantes",
      value: datasetSummary.students.toLocaleString("pt-BR"),
      description: "Registros disponíveis",
      icon: GraduationCap,
    },
    {
      title: "Atributos",
      value: datasetSummary.features.toString(),
      description: "Variáveis preditoras",
      icon: Database,
    },
    {
      title: "Taxa de evasão",
      value: formatPercentage(dropoutPercentage),
      description: `${dropoutCount.toLocaleString("pt-BR")} estudantes`,
      icon: Target,
    },
    {
      title: "Modelos",
      value: models.length.toString(),
      description: "Algoritmos selecionados",
      icon: BrainCircuit,
    },
  ];

  const targetDistribution = [
    {
      name: "Graduate",
      label: "Graduado",
      value: graduateCount,
      percentage: graduatePercentage,
    },
    {
      name: "Dropout",
      label: "Evasão",
      value: dropoutCount,
      percentage: dropoutPercentage,
    },
    {
      name: "Enrolled",
      label: "Matriculado",
      value: enrolledCount,
      percentage: enrolledPercentage,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
        
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">
            Visão geral
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Indicadores principais da análise de evasão acadêmica.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-green-700">
          <span className="size-2 rounded-full bg-green-500" />
          Dataset conectado
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const MetricIcon = metric.icon;

          return (
            <div
              key={metric.title}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {metric.title}
                  </p>

                  <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950">
                    {metric.value}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    {metric.description}
                  </p>
                </div>

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                  <MetricIcon className="size-4.5 text-slate-700" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <DashboardCharts
        targetDistribution={targetDistribution}
        dropoutCount={dropoutCount}
        nonDropoutCount={nonDropoutCount}
      />

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-950">
              Modelos selecionados
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Algoritmos definidos para a etapa de treinamento e comparação.
            </p>
          </div>

          <Badge
            variant="outline"
            className="w-fit rounded-full border-amber-200 bg-amber-50 text-amber-700"
          >
            Aguardando treinamento
          </Badge>
        </div>

        <div className="grid divide-y divide-slate-200 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {models.map((model) => (
            <div key={model.name} className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100">
                  <BrainCircuit className="size-4.5 text-slate-700" />
                </div>

                <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                  {model.type}
                </span>
              </div>

              <h3 className="mt-5 text-base font-semibold text-slate-950">
                {model.name}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {model.description}
              </p>

              <div className="mt-5 flex items-center gap-2">
                <span className="size-2 rounded-full bg-amber-400" />

                <span className="text-xs font-medium text-slate-500">
                  Sem métricas disponíveis
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-6">
      <div className="h-20 animate-pulse rounded-2xl bg-slate-200" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, metricIndex) => (
          <div
            key={metricIndex}
            className="h-36 animate-pulse rounded-2xl bg-slate-200"
          />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="h-[430px] animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-[430px] animate-pulse rounded-2xl bg-slate-200" />
      </div>

      <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}