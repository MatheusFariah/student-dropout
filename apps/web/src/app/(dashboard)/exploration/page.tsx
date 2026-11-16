import { Suspense } from "react";
import type {
  ElementType,
  ReactNode,
} from "react";

import {
  Binary,
  CheckCircle2,
  Database,
  Layers3,
  Scale,
  Split,
} from "lucide-react";

import { ExplorationCharts } from "@/components/exploration/exploration-charts";
import { getDatasetExploration } from "@/lib/api/dataset";

async function ExplorationContent() {
  const exploration = await getDatasetExploration();

  const overviewMetrics = [
    {
      label: "Estudantes",
      value: exploration.overview.students.toLocaleString(
        "pt-BR",
      ),
      helper: "Registros analisados",
      icon: Database,
    },
    {
      label: "Cursos",
      value: exploration.overview.courses.toString(),
      helper: "Cursos presentes na base",
      icon: Layers3,
    },
    {
      label: "Valores ausentes",
      value: exploration.overview.missing_values.toString(),
      helper:
        exploration.overview.missing_values === 0
          ? "Nenhum valor ausente"
          : "Registros que exigem tratamento",
      icon: CheckCircle2,
    },
    {
      label: "Duplicidades",
      value: exploration.overview.duplicated_rows.toString(),
      helper:
        exploration.overview.duplicated_rows === 0
          ? "Nenhuma linha duplicada"
          : "Duplicidades encontradas",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-8">
      <section className="border-b border-slate-200 pb-7">
        <p className="text-sm font-medium text-green-700">
          Etapa 01 · Exploração dos dados
        </p>

        <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 lg:text-4xl">
          O que os dados mostram antes da modelagem?
        </h1>

        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Primeiro entendemos a qualidade da base e procuramos padrões
          relacionados à evasão. Depois, os dados são preparados para o
          treinamento dos modelos.
        </p>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-400">
            Visão geral
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            Qualidade e composição da base
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewMetrics.map((metric) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              helper={metric.helper}
              icon={metric.icon}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-medium text-slate-400">
            Análise exploratória
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Onde aparecem diferenças entre os grupos?
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Comparamos idade, situação financeira, desempenho acadêmico e
            correlações com a evasão.
          </p>
        </div>

        <ExplorationCharts
          ageDistribution={exploration.age_distribution}
          financialFactors={exploration.financial_factors}
          academicPerformance={exploration.academic_performance}
          correlations={exploration.correlations}
        />
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-medium text-green-700">
            Principais descobertas
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            O que encontramos na base?
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {exploration.insights.map(
            (insight, insightIndex) => (
              <article
                key={insight.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="text-xs font-semibold text-green-700">
                  0{insightIndex + 1}
                </span>

                <h3 className="mt-3 font-semibold text-slate-950">
                  {insight.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {insight.text}
                </p>
              </article>
            ),
          )}
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-medium text-slate-400">
            Preparação
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            Como os dados foram preparados?
          </h2>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-px bg-slate-200 md:grid-cols-2 xl:grid-cols-4">
            <PreparationCard
              icon={Binary}
              title="Alvo binário"
            >
              <p>
                <span className="font-medium text-red-600">
                  Evasão:
                </span>{" "}
                {exploration.preparation.target.positive_class}
              </p>

              <p className="mt-1">
                <span className="font-medium text-green-700">
                  Não evasão:
                </span>{" "}
                {exploration.preparation.target.negative_classes.join(
                  " + ",
                )}
              </p>
            </PreparationCard>

            <PreparationCard
              icon={Split}
              title="Treino e teste"
            >
              <p>
                {
                  exploration.preparation.split
                    .training_students
                }{" "}
                estudantes para treino
              </p>

              <p className="mt-1">
                {exploration.preparation.split.test_students} para
                teste
              </p>

              <p className="mt-2 text-xs text-slate-400">
                {
                  exploration.preparation.split
                    .training_percentage
                }
                % /{" "}
                {exploration.preparation.split.test_percentage}%
                estratificado
              </p>
            </PreparationCard>

            <PreparationCard
              icon={Layers3}
              title="Variáveis categóricas"
            >
              <p>
                {
                  exploration.preparation.preprocessing
                    .categorical_features
                }{" "}
                atributos
              </p>

              <p className="mt-1">
                {
                  exploration.preparation.preprocessing
                    .encoding
                }
              </p>
            </PreparationCard>

            <PreparationCard
              icon={Scale}
              title="Variáveis numéricas"
            >
              <p>
                {
                  exploration.preparation.preprocessing
                    .numeric_features
                }{" "}
                atributos
              </p>

              <p className="mt-1">
                {
                  exploration.preparation.preprocessing
                    .scaling
                }
              </p>
            </PreparationCard>
          </div>

          <div className="flex items-start gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-700" />

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Base pronta para modelagem
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Após o pré-processamento, o conjunto possui{" "}
                {
                  exploration.preparation.preprocessing
                    .transformed_features
                }{" "}
                atributos disponíveis para treinamento.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 py-7">
        <p className="text-sm font-medium text-green-700">
          Conclusão
        </p>

        <h2 className="mt-2 max-w-4xl text-xl font-semibold text-slate-950">
          A base apresenta sinais relevantes de evasão e está preparada
          para a comparação dos modelos.
        </h2>
      </section>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  helper: string;
  icon: ElementType;
}

function MetricCard({
  label,
  value,
  helper,
  icon: MetricIcon,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
            {value}
          </p>

          <p className="mt-2 text-sm leading-5 text-slate-500">
            {helper}
          </p>
        </div>

        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-50">
          <MetricIcon className="size-4 text-slate-500" />
        </div>
      </div>
    </div>
  );
}

interface PreparationCardProps {
  icon: ElementType;
  title: string;
  children: ReactNode;
}

function PreparationCard({
  icon: PreparationIcon,
  title,
  children,
}: PreparationCardProps) {
  return (
    <div className="bg-white p-6">
      <div className="flex size-9 items-center justify-center rounded-xl bg-slate-50">
        <PreparationIcon className="size-4 text-slate-600" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-950">
        {title}
      </h3>

      <div className="mt-2 text-sm leading-6 text-slate-500">
        {children}
      </div>
    </div>
  );
}

function ExplorationLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-8">
      <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, metricIndex) => (
            <div
              key={metricIndex}
              className="h-32 animate-pulse rounded-2xl bg-slate-200"
            />
          ),
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {Array.from({ length: 4 }).map(
          (_, chartIndex) => (
            <div
              key={chartIndex}
              className="h-[390px] animate-pulse rounded-2xl bg-slate-200"
            />
          ),
        )}
      </div>
    </div>
  );
}

export default function ExplorationPage() {
  return (
    <Suspense fallback={<ExplorationLoading />}>
      <ExplorationContent />
    </Suspense>
  );
}