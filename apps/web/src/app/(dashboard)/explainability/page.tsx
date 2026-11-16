import { Suspense } from "react";
import type { ElementType } from "react";

import {
  BrainCircuit,
  Gauge,
  Lightbulb,
  SearchCheck,
  Target,
} from "lucide-react";

import { ExplainabilityChart } from "@/components/explainability/explainability-chart";
import { getExplainability } from "@/lib/api/analysis";

function formatMetric(value: number) {
  return `${(value * 100).toFixed(1).replace(".", ",")}%`;
}

async function ExplainabilityContent() {
  const explainability = await getExplainability();

  const metricCards = [
    {
      label: "Modelo analisado",
      value: explainability.model.name,
      helper: "Melhor resultado entre os modelos comparados",
      icon: BrainCircuit,
    },
    {
      label: "F1-score",
      value: formatMetric(
        explainability.model.metrics.f1,
      ),
      helper: "Equilíbrio entre Precision e Recall",
      icon: Gauge,
    },
    {
      label: "Recall de evasão",
      value: formatMetric(
        explainability.model.metrics.recall,
      ),
      helper: "Evasões identificadas corretamente",
      icon: Target,
    },
    {
      label: "Amostras de teste",
      value:
        explainability.method.test_samples.toLocaleString(
          "pt-BR",
        ),
      helper: "Registros usados na avaliação",
      icon: SearchCheck,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-8">
      <section className="border-b border-slate-200 pb-7">
        <p className="text-sm font-medium text-green-700">
          Etapa 04 · Explicabilidade
        </p>

        <div className="mt-3 max-w-4xl">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 lg:text-4xl">
            O que mais influencia a previsão de evasão?
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Depois de selecionar o melhor modelo, analisamos quais
            informações possuem maior peso em suas decisões.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-l-2 border-green-600 pl-4 sm:flex-row sm:items-center sm:gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
              Método
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {explainability.method.name}
            </p>
          </div>

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            {explainability.method.description}.
          </p>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-400">
            Modelo utilizado
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            Contexto da análise
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((metric) => (
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
        <div className="mb-5 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">
              Resultado
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Variáveis mais relevantes para o modelo
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-slate-500">
            Quanto maior a barra, maior a participação relativa da
            variável nas decisões realizadas pelo modelo.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ExplainabilityChart
            features={explainability.features}
          />

          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="text-xs leading-5 text-slate-400">
              A importância indica relevância para a previsão e não
              necessariamente uma relação de causa com a evasão.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-green-50">
            <Lightbulb className="size-4 text-green-700" />
          </div>

          <div>
            <p className="text-sm font-medium text-green-700">
              Interpretação
            </p>

            <h2 className="text-xl font-semibold text-slate-950">
              Principais descobertas
            </h2>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {explainability.insights.map(
            (insight, insightIndex) => (
              <article
                key={insight.feature}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="text-xs font-semibold text-green-700">
                  0{insightIndex + 1}
                </span>

                <h3 className="mt-4 text-lg font-semibold text-slate-950">
                  {insight.label}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {insight.text}
                </p>
              </article>
            ),
          )}
        </div>
      </section>

      <section className="border-t border-slate-200 py-7">
        <div className="max-w-4xl">
          <p className="text-sm font-medium text-green-700">
            Conclusão
          </p>

          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            O modelo não apenas prevê risco, mas permite entender
            quais fatores sustentam suas decisões.
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Isso torna o resultado mais transparente e mais útil para
            apoiar estratégias de acompanhamento dos estudantes.
          </p>
        </div>
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

          <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
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

function ExplainabilityLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-8">
      <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />

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

      <div className="h-[520px] animate-pulse rounded-2xl bg-slate-200" />

      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map(
          (_, insightIndex) => (
            <div
              key={insightIndex}
              className="h-48 animate-pulse rounded-2xl bg-slate-200"
            />
          ),
        )}
      </div>
    </div>
  );
}

export default function ExplainabilityPage() {
  return (
    <Suspense fallback={<ExplainabilityLoading />}>
      <ExplainabilityContent />
    </Suspense>
  );
}