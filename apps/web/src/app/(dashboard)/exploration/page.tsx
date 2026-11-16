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

const loadingMetricKeys = [
  "students",
  "courses",
  "missing",
  "duplicates",
];

const loadingChartKeys = [
  "age",
  "financial",
  "academic",
  "correlation",
];

async function ExplorationContent() {
  const exploration =
    await getDatasetExploration();

  const overviewMetrics = [
    {
      label: "Estudantes",
      value:
        exploration.overview.students.toLocaleString(
          "pt-BR",
        ),
      helper: "Registros analisados",
      icon: Database,
    },
    {
      label: "Cursos",
      value:
        exploration.overview.courses.toString(),
      helper: "Cursos presentes na base",
      icon: Layers3,
    },
    {
      label: "Valores ausentes",
      value:
        exploration.overview.missing_values.toString(),
      helper:
        exploration.overview.missing_values === 0
          ? "Nenhum valor ausente"
          : "Valores que exigem tratamento",
      icon: CheckCircle2,
    },
    {
      label: "Duplicidades",
      value:
        exploration.overview.duplicated_rows.toString(),
      helper:
        exploration.overview.duplicated_rows === 0
          ? "Nenhuma linha duplicada"
          : "Duplicidades encontradas",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-9">
      <section className="border-b border-slate-200 pb-7">
        <p className="text-sm font-medium text-green-700">
          Etapa 01 · Exploração dos dados
        </p>

        <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 lg:text-4xl">
          O que os dados mostram antes da modelagem?
        </h1>

        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Primeiro analisamos a qualidade da base e buscamos diferenças
          entre estudantes que evadiram e os que permaneceram. Depois,
          os dados são preparados para o treinamento dos modelos.
        </p>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-400">
            Visão geral
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            Qualidade da base
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Antes da análise, verificamos o tamanho da base e possíveis
            problemas que poderiam afetar os resultados.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewMetrics.map(
            (metric) => (
              <MetricCard
                key={metric.label}
                label={metric.label}
                value={metric.value}
                helper={metric.helper}
                icon={metric.icon}
              />
            ),
          )}
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
            Comparamos idade, situação financeira e desempenho acadêmico
            para identificar padrões relacionados à evasão.
          </p>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-3">
          <ReadingCard
            title="Distribuições"
            description="Comparam como uma característica se comporta entre evasão e não evasão."
          />

          <ReadingCard
            title="Proporções"
            description="Mostram em quais grupos a ocorrência de evasão é maior ou menor."
          />

          <ReadingCard
            title="Correlação"
            description="Indica a direção e a intensidade da relação entre uma variável e a evasão."
          />
        </div>

        <ExplorationCharts
          ageDistribution={
            exploration.age_distribution
          }
          financialFactors={
            exploration.financial_factors
          }
          academicPerformance={
            exploration.academic_performance
          }
          correlations={
            exploration.correlations
          }
        />

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">
            Como interpretar a correlação com a evasão?
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <CorrelationGuide
              value="+"
              title="Correlação positiva"
              description="Valores maiores da variável estão associados a maior ocorrência de evasão."
              valueClassName="text-red-600"
            />

            <CorrelationGuide
              value="−"
              title="Correlação negativa"
              description="Valores maiores da variável estão associados a menor ocorrência de evasão."
              valueClassName="text-green-700"
            />

            <CorrelationGuide
              value="0"
              title="Próximo de zero"
              description="Indica pouca relação linear entre a variável e a evasão."
              valueClassName="text-slate-500"
            />
          </div>

          <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400">
            Quanto mais distante de zero, mais forte é a associação.
            Correlação indica relação entre variáveis, mas não significa
            que uma delas seja a causa direta da evasão.
          </p>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-medium text-green-700">
            Principais descobertas
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            O que encontramos na base?
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Os resultados abaixo resumem os padrões que mais se destacaram
            durante a exploração dos dados.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {exploration.insights.map(
            (
              insight,
              insightIndex,
            ) => (
              <article
                key={insight.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="text-xs font-semibold text-green-700">
                  {String(
                    insightIndex + 1,
                  ).padStart(2, "0")}
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

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Antes do treinamento, o problema foi transformado em uma
            classificação binária e as variáveis foram convertidas para
            um formato adequado aos modelos.
          </p>
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
                {
                  exploration.preparation.target
                    .positive_class
                }{" "}
                → 1
              </p>

              <p className="mt-1">
                <span className="font-medium text-green-700">
                  Não evasão:
                </span>{" "}
                {exploration.preparation.target.negative_classes.join(
                  " + ",
                )}{" "}
                → 0
              </p>

              <p className="mt-3 text-xs leading-5 text-slate-400">
                O modelo aprende a distinguir evasão de não evasão.
              </p>
            </PreparationCard>

            <PreparationCard
              icon={Split}
              title="Treino e teste"
            >
              <p>
                <span className="font-medium text-slate-700">
                  {
                    exploration.preparation.split
                      .training_students
                  }
                </span>{" "}
                estudantes para treino
              </p>

              <p className="mt-1">
                <span className="font-medium text-slate-700">
                  {
                    exploration.preparation.split
                      .test_students
                  }
                </span>{" "}
                estudantes para teste
              </p>

              <p className="mt-3 text-xs leading-5 text-slate-400">
                {
                  exploration.preparation.split
                    .training_percentage
                }
                % /{" "}
                {
                  exploration.preparation.split
                    .test_percentage
                }
                % estratificado para manter a proporção das classes.
              </p>
            </PreparationCard>

            <PreparationCard
              icon={Layers3}
              title="Variáveis categóricas"
            >
              <p>
                <span className="font-medium text-slate-700">
                  {
                    exploration.preparation.preprocessing
                      .categorical_features
                  }
                </span>{" "}
                atributos
              </p>

              <p className="mt-1 font-medium text-slate-700">
                {
                  exploration.preparation.preprocessing
                    .encoding
                }
              </p>

              <p className="mt-3 text-xs leading-5 text-slate-400">
                As categorias são transformadas em valores que o modelo
                consegue utilizar.
              </p>
            </PreparationCard>

            <PreparationCard
              icon={Scale}
              title="Variáveis numéricas"
            >
              <p>
                <span className="font-medium text-slate-700">
                  {
                    exploration.preparation.preprocessing
                      .numeric_features
                  }
                </span>{" "}
                atributos
              </p>

              <p className="mt-1 font-medium text-slate-700">
                {
                  exploration.preparation.preprocessing
                    .scaling
                }
              </p>

              <p className="mt-3 text-xs leading-5 text-slate-400">
                Os valores são colocados em escalas comparáveis antes do
                treinamento.
              </p>
            </PreparationCard>
          </div>

          <div className="flex items-start gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-700" />

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Base pronta para modelagem
              </p>

              <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500">
                Os{" "}
                <span className="font-medium text-slate-700">
                  36 atributos originais
                </span>{" "}
                foram preparados e, após a transformação das variáveis
                categóricas, resultaram em{" "}
                <span className="font-medium text-slate-700">
                  {
                    exploration.preparation.preprocessing
                      .transformed_features
                  }{" "}
                  atributos
                </span>{" "}
                disponíveis para os modelos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 py-7">
        <p className="text-sm font-medium text-green-700">
          Conclusão
        </p>

        <h2 className="mt-2 max-w-4xl text-xl font-semibold leading-8 text-slate-950">
          A exploração revelou diferenças entre os grupos e a base está
          pronta para a comparação dos modelos.
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          A próxima etapa verifica se esses padrões podem ser utilizados
          para identificar estudantes com risco de evasão.
        </p>
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

interface ReadingCardProps {
  title: string;
  description: string;
}

function ReadingCard({
  title,
  description,
}: ReadingCardProps) {
  return (
    <div className="border-l-2 border-slate-200 pl-4">
      <p className="text-sm font-semibold text-slate-700">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

interface CorrelationGuideProps {
  value: string;
  title: string;
  description: string;
  valueClassName: string;
}

function CorrelationGuide({
  value,
  title,
  description,
  valueClassName,
}: CorrelationGuideProps) {
  return (
    <div className="flex gap-3">
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-lg font-semibold ${valueClassName}`}
      >
        {value}
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
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
        {loadingMetricKeys.map(
          (metricKey) => (
            <div
              key={metricKey}
              className="h-32 animate-pulse rounded-2xl bg-slate-200"
            />
          ),
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {loadingChartKeys.map(
          (chartKey) => (
            <div
              key={chartKey}
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
    <Suspense
      fallback={<ExplorationLoading />}
    >
      <ExplorationContent />
    </Suspense>
  );
}