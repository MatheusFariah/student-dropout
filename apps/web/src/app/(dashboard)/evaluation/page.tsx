import { Suspense } from "react";
import type { ElementType } from "react";

import {
  CheckCircle2,
  Gauge,
  SearchCheck,
  Target,
  TriangleAlert,
} from "lucide-react";

import { RocCurveChart } from "@/components/evaluation/roc-curve-chart";
import { StageExperiment } from "@/components/evaluation/stage-experiment";
import { getEvaluation } from "@/lib/api/evaluation";

const loadingMetricKeys = [
  "precision",
  "recall",
  "f1",
  "auc",
];

function formatMetric(value: number) {
  return `${(value * 100)
    .toFixed(1)
    .replace(".", ",")}%`;
}

async function EvaluationContent() {
  const evaluation =
    await getEvaluation();

  const truePositive =
    evaluation.confusion_matrix.true_positive;

  const trueNegative =
    evaluation.confusion_matrix.true_negative;

  const falsePositive =
    evaluation.confusion_matrix.false_positive;

  const falseNegative =
    evaluation.confusion_matrix.false_negative;

  const metrics = [
    {
      label: "Precision",
      value: formatMetric(
        evaluation.metrics.precision,
      ),
      helper:
        "Dos alertas emitidos, quantos estavam corretos",
      icon: SearchCheck,
    },
    {
      label: "Recall",
      value: formatMetric(
        evaluation.metrics.recall,
      ),
      helper:
        "Das evasões reais, quantas foram identificadas",
      icon: Target,
    },
    {
      label: "F1-score",
      value: formatMetric(
        evaluation.metrics.f1,
      ),
      helper:
        "Equilíbrio entre Precision e Recall",
      icon: Gauge,
    },
    {
      label: "ROC-AUC",
      value: formatMetric(
        evaluation.metrics.roc_auc,
      ),
      helper:
        "Capacidade de separar as duas classes",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-9">
      <section className="border-b border-slate-200 pb-7">
        <p className="text-sm font-medium text-green-700">
          Etapa 03 · Avaliação
        </p>

        <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 lg:text-4xl">
          O modelo consegue encontrar quem realmente está em risco?
        </h1>

        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          O modelo selecionado é avaliado sobre estudantes que não
          participaram do treinamento. Assim podemos medir seu desempenho
          sobre dados ainda não vistos.
        </p>

        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-l-2 border-green-600 pl-4 text-sm text-slate-500">
          <p>
            Modelo:{" "}
            <span className="font-semibold text-slate-900">
              {evaluation.model.name}
            </span>
          </p>

          <p>
            Teste:{" "}
            <span className="font-semibold text-slate-900">
              {evaluation.summary.test_students.toLocaleString(
                "pt-BR",
              )}{" "}
              estudantes
            </span>
          </p>

          <p>
            Limiar:{" "}
            <span className="font-semibold text-slate-900">
              {formatMetric(
                evaluation.threshold,
              )}
            </span>
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ThresholdItem
            value={`≥ ${formatMetric(
              evaluation.threshold,
            )}`}
            label="Previsão de evasão"
          />

          <ThresholdItem
            value={`< ${formatMetric(
              evaluation.threshold,
            )}`}
            label="Previsão de não evasão"
          />
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-medium text-slate-400">
            Desempenho
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            Métricas principais
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Cada métrica observa um aspecto diferente do desempenho.
            Por isso, não avaliamos o modelo por apenas um único número.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(
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
            Acertos e erros
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Matriz de confusão
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Antes de calcular as métricas, comparamos a previsão do modelo
            com o resultado real de cada estudante.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <ConfusionMatrix
            trueNegative={
              trueNegative
            }
            falsePositive={
              falsePositive
            }
            falseNegative={
              falseNegative
            }
            truePositive={
              truePositive
            }
          />

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-400">
              Leitura prática
            </p>

            <div className="mt-5 space-y-6">
              <EvaluationFinding
                value={`${evaluation.summary.detected_dropouts} de ${evaluation.summary.actual_dropouts}`}
                title="evasões identificadas"
                description={`${evaluation.summary.detection_rate
                  .toFixed(1)
                  .replace(".", ",")}% das evasões reais foram encontradas.`}
                positive
              />

              <EvaluationFinding
                value={evaluation.summary.missed_dropouts.toString()}
                title="evasões não identificadas"
                description={`${evaluation.summary.missed_rate
                  .toFixed(1)
                  .replace(".", ",")}% dos casos reais passaram sem alerta.`}
              />

              <EvaluationFinding
                value={`${evaluation.summary.alert_precision
                  .toFixed(1)
                  .replace(".", ",")}%`}
                title="dos alertas estavam corretos"
                description={`${evaluation.summary.correct_alerts} dos ${evaluation.summary.predicted_alerts} alertas indicaram evasão real.`}
                positive
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-medium text-slate-400">
            Base das métricas
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            O que significam VP, FP, FN e VN?
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Esses quatro resultados da matriz de confusão são utilizados
            diretamente no cálculo de Precision e Recall.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ConfusionDefinition
            abbreviation="VP"
            title="Verdadeiro positivo"
            value={
              truePositive
            }
            description="Era evasão e o modelo identificou corretamente como evasão."
            variant="success"
          />

          <ConfusionDefinition
            abbreviation="FP"
            title="Falso positivo"
            value={
              falsePositive
            }
            description="Não era evasão, mas o modelo gerou um alerta."
            variant="warning"
          />

          <ConfusionDefinition
            abbreviation="FN"
            title="Falso negativo"
            value={
              falseNegative
            }
            description="Era evasão, mas o modelo não conseguiu identificar."
            variant="danger"
          />

          <ConfusionDefinition
            abbreviation="VN"
            title="Verdadeiro negativo"
            value={
              trueNegative
            }
            description="Não era evasão e o modelo classificou corretamente."
            variant="neutral"
          />
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-medium text-green-700">
            Cálculo das métricas
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            De onde vêm Precision, Recall e F1?
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            As porcentagens apresentadas pelo sistema são calculadas a
            partir dos próprios valores encontrados na matriz de confusão.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <MetricFormulaCard
            title="Precision"
            question="Quando o modelo alerta, ele acerta?"
            formula="VP / (VP + FP)"
            calculation={`${truePositive} / (${truePositive} + ${falsePositive})`}
            result={formatMetric(
              evaluation.metrics.precision,
            )}
            description="Mede a qualidade dos alertas de evasão emitidos pelo modelo."
          />

          <MetricFormulaCard
            title="Recall"
            question="Das evasões reais, quantas encontramos?"
            formula="VP / (VP + FN)"
            calculation={`${truePositive} / (${truePositive} + ${falseNegative})`}
            result={formatMetric(
              evaluation.metrics.recall,
            )}
            description="Mede a capacidade de localizar estudantes que realmente evadiram."
            highlighted
          />

          <MetricFormulaCard
            title="F1-score"
            question="Existe equilíbrio entre os dois?"
            formula="2 × (Precision × Recall) / (Precision + Recall)"
            calculation={`2 × (${formatMetric(
              evaluation.metrics.precision,
            )} × ${formatMetric(
              evaluation.metrics.recall,
            )}) / (${formatMetric(
              evaluation.metrics.precision,
            )} + ${formatMetric(
              evaluation.metrics.recall,
            )})`}
            result={formatMetric(
              evaluation.metrics.f1,
            )}
            description="Combina Precision e Recall em uma única medida."
          />
        </div>

        <div className="mt-4 rounded-2xl border border-green-200 bg-green-50/60 px-5 py-4">
          <p className="text-sm font-semibold text-green-800">
            Por que usamos F1 para escolher o melhor modelo?
          </p>

          <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600">
            Um modelo poderia ter alta Precision e baixo Recall, ou o
            contrário. O F1 penaliza esse desequilíbrio e favorece modelos
            que conseguem manter bons resultados nas duas métricas.
          </p>
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">
              Discriminação
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Curva ROC e ROC-AUC
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-slate-500">
            Em vez de observar somente o limiar de 50%, a curva testa
            vários limiares de classificação.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <RocCurveChart
            curve={
              evaluation.roc_curve
            }
          />

          <div className="mt-5 grid gap-5 border-t border-slate-100 pt-5 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Curva ROC
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Compara a taxa de verdadeiros positivos com a taxa de
                falsos positivos em diferentes valores de limiar.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                ROC-AUC ·{" "}
                <span className="text-green-700">
                  {formatMetric(
                    evaluation.metrics.roc_auc,
                  )}
                </span>
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Representa a área sob a curva. Quanto mais próximo de
                100%, melhor o modelo consegue separar evasão de não
                evasão.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="h-[500px] animate-pulse rounded-2xl bg-slate-200" />
        }
      >
        <StageExperiment />
      </Suspense>

      <section className="border-t border-slate-200 py-7">
        <p className="text-sm font-medium text-green-700">
          Conclusão da avaliação
        </p>

        <h2 className="mt-2 max-w-4xl text-xl font-semibold leading-8 text-slate-950">
          O modelo identifica{" "}
          {evaluation.summary.detection_rate
            .toFixed(1)
            .replace(".", ",")}
          % das evasões reais no conjunto de teste.
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Além das métricas finais, conseguimos mostrar exatamente quais
          acertos e erros deram origem a esses resultados.
        </p>
      </section>
    </div>
  );
}

interface ThresholdItemProps {
  value: string;
  label: string;
}

function ThresholdItem({
  value,
  label,
}: ThresholdItemProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-sm font-semibold text-slate-900">
        {value}
      </span>

      <span className="text-sm text-slate-500">
        {label}
      </span>
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

interface ConfusionMatrixProps {
  trueNegative: number;
  falsePositive: number;
  falseNegative: number;
  truePositive: number;
}

function ConfusionMatrix({
  trueNegative,
  falsePositive,
  falseNegative,
  truePositive,
}: ConfusionMatrixProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-[110px_1fr_1fr] gap-2">
        <div />

        <MatrixHeader>
          Previsto: não evasão
        </MatrixHeader>

        <MatrixHeader>
          Previsto: evasão
        </MatrixHeader>

        <MatrixHeader>
          Real: não evasão
        </MatrixHeader>

        <MatrixCell
          value={
            trueNegative
          }
          title="Acerto"
          variant="success"
        />

        <MatrixCell
          value={
            falsePositive
          }
          title="Falso alerta"
          variant="warning"
        />

        <MatrixHeader>
          Real: evasão
        </MatrixHeader>

        <MatrixCell
          value={
            falseNegative
          }
          title="Evasão perdida"
          variant="danger"
        />

        <MatrixCell
          value={
            truePositive
          }
          title="Evasão identificada"
          variant="success"
        />
      </div>
    </div>
  );
}

interface MatrixHeaderProps {
  children: string;
}

function MatrixHeader({
  children,
}: MatrixHeaderProps) {
  return (
    <div className="flex items-center justify-center px-2 py-3 text-center text-xs font-medium text-slate-500">
      {children}
    </div>
  );
}

interface MatrixCellProps {
  value: number;
  title: string;
  variant:
    | "success"
    | "warning"
    | "danger";
}

function MatrixCell({
  value,
  title,
  variant,
}: MatrixCellProps) {
  const styles = {
    success:
      "border-green-200 bg-green-50 text-green-800",
    warning:
      "border-amber-200 bg-amber-50 text-amber-800",
    danger:
      "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <div
      className={`flex min-h-28 flex-col items-center justify-center rounded-xl border p-4 text-center ${styles[variant]}`}
    >
      <p className="text-3xl font-semibold tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-xs font-medium">
        {title}
      </p>
    </div>
  );
}

interface ConfusionDefinitionProps {
  abbreviation: string;
  title: string;
  value: number;
  description: string;
  variant:
    | "success"
    | "warning"
    | "danger"
    | "neutral";
}

function ConfusionDefinition({
  abbreviation,
  title,
  value,
  description,
  variant,
}: ConfusionDefinitionProps) {
  const abbreviationStyles = {
    success:
      "text-green-700",
    warning:
      "text-amber-600",
    danger:
      "text-red-600",
    neutral:
      "text-slate-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <span
          className={`text-xs font-semibold ${abbreviationStyles[variant]}`}
        >
          {abbreviation}
        </span>

        <span className="text-xl font-semibold text-slate-950">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-800">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

interface MetricFormulaCardProps {
  title: string;
  question: string;
  formula: string;
  calculation: string;
  result: string;
  description: string;
  highlighted?: boolean;
}

function MetricFormulaCard({
  title,
  question,
  formula,
  calculation,
  result,
  description,
  highlighted = false,
}: MetricFormulaCardProps) {
  return (
    <article
      className={`rounded-2xl border bg-white p-6 shadow-sm ${
        highlighted
          ? "border-green-300 ring-1 ring-green-100"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400">
            {question}
          </p>

          <h3 className="mt-1 text-lg font-semibold text-slate-950">
            {title}
          </h3>
        </div>

        <span
          className={`text-xl font-semibold ${
            highlighted
              ? "text-green-700"
              : "text-slate-950"
          }`}
        >
          {result}
        </span>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-4">
        <p className="font-mono text-sm font-semibold text-slate-800">
          {formula}
        </p>

        <p className="mt-2 break-words font-mono text-xs text-slate-500">
          {calculation}
        </p>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </article>
  );
}

interface EvaluationFindingProps {
  value: string;
  title: string;
  description: string;
  positive?: boolean;
}

function EvaluationFinding({
  value,
  title,
  description,
  positive = false,
}: EvaluationFindingProps) {
  return (
    <div className="flex gap-4">
      <div className="mt-1">
        {positive ? (
          <CheckCircle2 className="size-5 text-green-700" />
        ) : (
          <TriangleAlert className="size-5 text-amber-500" />
        )}
      </div>

      <div>
        <p className="text-xl font-semibold text-slate-950">
          {value}
        </p>

        <p className="mt-1 text-sm font-medium text-slate-700">
          {title}
        </p>

        <p className="mt-1 text-sm leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function EvaluationLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-8">
      <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />

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

      <div className="h-[430px] animate-pulse rounded-2xl bg-slate-200" />
    </div>
  );
}

export default function EvaluationPage() {
  return (
    <Suspense
      fallback={
        <EvaluationLoading />
      }
    >
      <EvaluationContent />
    </Suspense>
  );
}