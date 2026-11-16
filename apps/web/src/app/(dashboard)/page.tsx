import { Suspense } from "react";

import {
  Database,
  GraduationCap,
  Layers3,
  Target,
} from "lucide-react";

import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { getDatasetSummary } from "@/lib/api/dataset";

const loadingMetricKeys = [
  "students",
  "features",
  "dropout",
  "classes",
];

function formatPercentage(value: number) {
  return `${value
    .toFixed(1)
    .replace(".", ",")}%`;
}

async function DashboardContent() {
  const datasetSummary =
    await getDatasetSummary();

  const graduateCount =
    datasetSummary.classes.graduate;

  const dropoutCount =
    datasetSummary.classes.dropout;

  const enrolledCount =
    datasetSummary.classes.enrolled;

  const nonDropoutCount =
    graduateCount + enrolledCount;

  const graduatePercentage =
    (graduateCount /
      datasetSummary.students) *
    100;

  const dropoutPercentage =
    (dropoutCount /
      datasetSummary.students) *
    100;

  const enrolledPercentage =
    (enrolledCount /
      datasetSummary.students) *
    100;

  const nonDropoutPercentage =
    (nonDropoutCount /
      datasetSummary.students) *
    100;

  const metrics = [
    {
      title: "Estudantes",
      value:
        datasetSummary.students.toLocaleString(
          "pt-BR",
        ),
      description:
        "Registros disponíveis para análise",
      icon: GraduationCap,
    },
    {
      title: "Atributos",
      value:
        datasetSummary.features.toString(),
      description:
        "Variáveis preditoras da base",
      icon: Database,
    },
    {
      title: "Taxa de evasão",
      value: formatPercentage(
        dropoutPercentage,
      ),
      description: `${dropoutCount.toLocaleString(
        "pt-BR",
      )} estudantes`,
      icon: Target,
    },
    {
      title: "Classes originais",
      value: "3",
      description:
        "Graduate, Dropout e Enrolled",
      icon: Layers3,
    },
  ];

  const targetDistribution = [
    {
      name: "Graduate",
      label: "Graduado",
      value: graduateCount,
      percentage:
        graduatePercentage,
    },
    {
      name: "Dropout",
      label: "Evasão",
      value: dropoutCount,
      percentage:
        dropoutPercentage,
    },
    {
      name: "Enrolled",
      label: "Matriculado",
      value: enrolledCount,
      percentage:
        enrolledPercentage,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-8">
      <section className="border-b border-slate-200 pb-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-green-700">
              Visão geral · Panorama do problema
            </p>

            <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 lg:text-4xl">
              Panorama da evasão acadêmica
            </h1>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              Uma visão inicial da base utilizada, da distribuição dos
              estudantes e de como o problema de evasão foi definido para
              os modelos.
            </p>
          </div>

          <div className="flex items-center gap-2 pb-1 text-sm font-medium text-green-700">
            <span className="size-2 rounded-full bg-green-500" />

            Dataset conectado
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-400">
            Base analisada
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            O tamanho do problema
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(
            (metric) => {
              const MetricIcon =
                metric.icon;

              return (
                <div
                  key={
                    metric.title
                  }
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {
                          metric.title
                        }
                      </p>

                      <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950">
                        {
                          metric.value
                        }
                      </p>

                      <p className="mt-2 text-sm leading-5 text-slate-500">
                        {
                          metric.description
                        }
                      </p>
                    </div>

                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      <MetricIcon className="size-4.5 text-slate-700" />
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-medium text-slate-400">
            Distribuição dos estudantes
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Como a evasão aparece na base?
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            A base original possui três situações acadêmicas. Para a
            modelagem, elas foram agrupadas em evasão e não evasão.
          </p>
        </div>

        <DashboardCharts
          targetDistribution={
            targetDistribution
          }
          dropoutCount={
            dropoutCount
          }
          nonDropoutCount={
            nonDropoutCount
          }
        />
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-medium text-green-700">
            Leitura inicial
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            O que esses números significam?
          </h2>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-px bg-slate-200 lg:grid-cols-3">
            <SummaryItem
              value={formatPercentage(
                dropoutPercentage,
              )}
              title="dos estudantes evadiram"
              description={`${dropoutCount.toLocaleString(
                "pt-BR",
              )} dos ${datasetSummary.students.toLocaleString(
                "pt-BR",
              )} estudantes pertencem à classe de evasão.`}
            />

            <SummaryItem
              value={formatPercentage(
                nonDropoutPercentage,
              )}
              title="foram classificados como não evasão"
              description="Graduados e estudantes ainda matriculados formam a classe negativa utilizada no problema."
            />

            <SummaryItem
              value="2 classes"
              title="utilizadas na modelagem"
              description="Dropout representa evasão; Graduate e Enrolled foram agrupados como não evasão."
            />
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 py-7">
        <p className="text-sm font-medium text-green-700">
          Ponto de partida
        </p>

        <h2 className="mt-2 max-w-4xl text-xl font-semibold leading-8 text-slate-950">
          Aproximadamente 1 em cada 3 estudantes da base pertence à classe
          de evasão.
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          A partir desse cenário, a próxima etapa explora quais
          características apresentam diferenças entre estudantes que
          evadiram e os que permaneceram.
        </p>
      </section>
    </div>
  );
}

interface SummaryItemProps {
  value: string;
  title: string;
  description: string;
}

function SummaryItem({
  value,
  title,
  description,
}: SummaryItemProps) {
  return (
    <div className="bg-white p-6">
      <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-800">
        {title}
      </p>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-8">
      <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loadingMetricKeys.map(
          (metricKey) => (
            <div
              key={metricKey}
              className="h-36 animate-pulse rounded-2xl bg-slate-200"
            />
          ),
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="h-[430px] animate-pulse rounded-2xl bg-slate-200" />

        <div className="h-[430px] animate-pulse rounded-2xl bg-slate-200" />
      </div>

      <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <DashboardLoading />
      }
    >
      <DashboardContent />
    </Suspense>
  );
}