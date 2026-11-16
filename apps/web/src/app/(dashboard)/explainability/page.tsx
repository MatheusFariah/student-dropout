import { Suspense } from "react";

import {
  BrainCircuit,
  SearchCheck,
} from "lucide-react";

import { ExplainabilityChart } from "@/components/explainability/explainability-chart";
import { getExplainability } from "@/lib/api/analysis";

const loadingInsightKeys = [
  "first",
  "second",
  "third",
];

async function ExplainabilityContent() {
  const explainability =
    await getExplainability();

  return (
    <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-9">
      <section className="border-b border-slate-200 pb-7">
        <p className="text-sm font-medium text-green-700">
          Etapa 04 · Explicabilidade
        </p>

        <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 lg:text-4xl">
          O que mais influencia a previsão de evasão?
        </h1>

        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Depois de selecionar o melhor modelo, analisamos quais
          informações tiveram maior influência nas previsões realizadas.
        </p>

        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4 border-l-2 border-green-600 pl-4 text-sm text-slate-500">
          <AnalysisInfo
            label="Modelo"
            value={
              explainability.model.name
            }
          />

          <AnalysisInfo
            label="Método"
            value={
              explainability.method.name
            }
          />

          <AnalysisInfo
            label="Amostras analisadas"
            value={explainability.method.test_samples.toLocaleString(
              "pt-BR",
            )}
          />
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">
              Importância das variáveis
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Em quais informações o modelo mais se apoia?
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Cada barra representa a importância relativa de uma variável
              para a decisão do modelo.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <SearchCheck className="size-4 text-green-700" />

            Quanto maior a barra, maior a influência
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ExplainabilityChart
            features={
              explainability.features
            }
          />

          <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 md:grid-cols-3">
            <InterpretationItem
              title="Barra maior"
              description="A variável teve maior peso nas decisões do modelo."
            />

            <InterpretationItem
              title="Barra menor"
              description="A variável teve menor influência sobre a previsão."
            />

            <InterpretationItem
              title="Importante"
              description="Não significa que a variável seja a causa da evasão."
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
        <div className="flex gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white">
            <BrainCircuit className="size-5 text-slate-600" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Um ponto importante sobre este gráfico
            </p>

            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
              A importância mostra quanto uma variável influencia a
              previsão, mas não indica sozinha se ela aumenta ou reduz o
              risco de evasão. O gráfico mostra principalmente quais
              informações o modelo mais considera.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-medium text-green-700">
            Principais fatores
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            Quais variáveis mais pesaram na decisão?
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            As três primeiras posições representam as variáveis com maior
            importância relativa entre as analisadas.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {explainability.insights.map(
            (
              insight,
              insightIndex,
            ) => (
              <article
                key={insight.feature}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="text-xs font-semibold text-green-700">
                  {String(
                    insightIndex + 1,
                  ).padStart(2, "0")}
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
        <p className="text-sm font-medium text-green-700">
          Conclusão
        </p>

        <h2 className="mt-2 max-w-4xl text-xl font-semibold leading-8 text-slate-950">
          A análise mostra quais informações tiveram maior influência nas
          previsões do modelo.
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Isso torna o resultado mais transparente e ajuda a entender em
          quais características o modelo se apoia ao identificar risco de
          evasão.
        </p>
      </section>
    </div>
  );
}

interface AnalysisInfoProps {
  label: string;
  value: string;
}

function AnalysisInfo({
  label,
  value,
}: AnalysisInfoProps) {
  return (
    <p>
      {label}:{" "}
      <span className="font-semibold text-slate-900">
        {value}
      </span>
    </p>
  );
}

interface InterpretationItemProps {
  title: string;
  description: string;
}

function InterpretationItem({
  title,
  description,
}: InterpretationItemProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-800">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function ExplainabilityLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-8">
      <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />

      <div className="h-[520px] animate-pulse rounded-2xl bg-slate-200" />

      <div className="grid gap-4 lg:grid-cols-3">
        {loadingInsightKeys.map(
          (insightKey) => (
            <div
              key={insightKey}
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
    <Suspense
      fallback={
        <ExplainabilityLoading />
      }
    >
      <ExplainabilityContent />
    </Suspense>
  );
}