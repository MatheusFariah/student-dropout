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

function formatMetric(value: number) {
  return `${(value * 100)
    .toFixed(1)
    .replace(".", ",")}%`;
}

async function EvaluationContent() {
  const evaluation = await getEvaluation();

  const metrics = [
    {
      label: "Precision",
      value: formatMetric(
        evaluation.metrics.precision,
      ),
      helper: "Dos alertas, quantos eram evasão",
      icon: SearchCheck,
    },
    {
      label: "Recall",
      value: formatMetric(
        evaluation.metrics.recall,
      ),
      helper: "Das evasões reais, quantas encontramos",
      icon: Target,
    },
    {
      label: "F1-score",
      value: formatMetric(
        evaluation.metrics.f1,
      ),
      helper: "Equilíbrio entre Precision e Recall",
      icon: Gauge,
    },
    {
      label: "ROC-AUC",
      value: formatMetric(
        evaluation.metrics.roc_auc,
      ),
      helper: "Capacidade de separar as classes",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-8">
      <section className="border-b border-slate-200 pb-7">
        <p className="text-sm font-medium text-green-700">
          Etapa 03 · Avaliação
        </p>

        <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 lg:text-4xl">
          O modelo consegue encontrar quem realmente está em risco?
        </h1>

        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          O modelo selecionado é avaliado somente nos estudantes
          reservados para teste, que não participaram do treinamento.
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
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-medium text-slate-400">
            Desempenho
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            Métricas principais
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
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
            Acertos e erros
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Matriz de confusão
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Aqui vemos exatamente quais estudantes foram classificados
            corretamente e onde o modelo ainda errou.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <ConfusionMatrix
            trueNegative={
              evaluation.confusion_matrix.true_negative
            }
            falsePositive={
              evaluation.confusion_matrix.false_positive
            }
            falseNegative={
              evaluation.confusion_matrix.false_negative
            }
            truePositive={
              evaluation.confusion_matrix.true_positive
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
        <div className="mb-5 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">
              Discriminação
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Curva ROC
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-slate-500">
            Quanto mais a curva se aproxima do canto superior esquerdo,
            melhor o modelo separa evasão de não evasão.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <RocCurveChart
            curve={evaluation.roc_curve}
          />

          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">
              ROC-AUC:{" "}
              <span className="font-semibold text-slate-900">
                {formatMetric(
                  evaluation.metrics.roc_auc,
                )}
              </span>
            </p>
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

        <h2 className="mt-2 max-w-4xl text-xl font-semibold text-slate-950">
          O modelo identifica{" "}
          {evaluation.summary.detection_rate
            .toFixed(1)
            .replace(".", ",")}
          % das evasões reais no conjunto de teste.
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Os resultados permitem transformar a previsão em um sistema
          de alerta, mantendo os erros e limitações visíveis para quem
          toma a decisão.
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
          value={trueNegative}
          title="Acerto"
          variant="success"
        />

        <MatrixCell
          value={falsePositive}
          title="Falso alerta"
          variant="warning"
        />

        <MatrixHeader>
          Real: evasão
        </MatrixHeader>

        <MatrixCell
          value={falseNegative}
          title="Evasão perdida"
          variant="danger"
        />

        <MatrixCell
          value={truePositive}
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
  variant: "success" | "warning" | "danger";
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
        {[0, 1, 2, 3].map((metricIndex) => (
          <div
            key={metricIndex}
            className="h-36 animate-pulse rounded-2xl bg-slate-200"
          />
        ))}
      </div>

      <div className="h-[430px] animate-pulse rounded-2xl bg-slate-200" />
    </div>
  );
}

export default function EvaluationPage() {
  return (
    <Suspense fallback={<EvaluationLoading />}>
      <EvaluationContent />
    </Suspense>
  );
}