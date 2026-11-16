import {
  Clock3,
  Database,
  TrendingUp,
} from "lucide-react";

import { StageComparisonChart } from "@/components/evaluation/stage-comparison-chart";
import { getStageExperiment } from "@/lib/api/stage-experiment";

function formatMetric(value: number) {
  return `${(value * 100)
    .toFixed(1)
    .replace(".", ",")}%`;
}

export async function StageExperiment() {
  const experiment = await getStageExperiment();

  const enrollmentStage = experiment.stages.find(
    (stage) => stage.key === "enrollment",
  );

  const secondSemesterStage = experiment.stages.find(
    (stage) => stage.key === "second_semester",
  );

  const aucImprovement =
    enrollmentStage && secondSemesterStage
      ? secondSemesterStage.metrics.roc_auc -
        enrollmentStage.metrics.roc_auc
      : 0;

  return (
    <section className="border-t border-slate-200 pt-8">
      <div className="mb-6">
        <p className="text-sm font-medium text-green-700">
          Desafio extra
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          Quanto ganhamos esperando mais dados?
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          O mesmo modelo foi testado em três momentos para comparar
          desempenho e antecedência da previsão.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {experiment.stages.map((stage) => (
          <article
            key={stage.key}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">
                  {stage.moment}
                </p>

                <h3 className="mt-1 text-xl font-semibold text-slate-950">
                  {stage.label}
                </h3>
              </div>

              <Clock3 className="size-5 text-slate-400" />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
              <StageMetric
                label="F1"
                value={formatMetric(stage.metrics.f1)}
              />

              <StageMetric
                label="Recall"
                value={formatMetric(stage.metrics.recall)}
              />

              <StageMetric
                label="AUC"
                value={formatMetric(stage.metrics.roc_auc)}
              />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-xs text-slate-400">
                {stage.features} variáveis
              </span>

              <span className="text-xs font-medium text-slate-600">
                {stage.lead_time}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <p className="text-sm font-medium text-slate-400">
            Comparação
          </p>

          <h3 className="mt-1 text-xl font-semibold text-slate-950">
            Desempenho × antecedência
          </h3>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Previsões mais cedo permitem agir antes. Dados acadêmicos
            posteriores tendem a aumentar a capacidade de identificar risco.
          </p>
        </div>

        <StageComparisonChart
          stages={experiment.stages}
        />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5">
          <Database className="mt-0.5 size-5 shrink-0 text-slate-400" />

          <div>
            <p className="font-medium text-slate-950">
              Maior antecedência
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Usando apenas informações disponíveis na matrícula, já é
              possível produzir uma primeira estimativa de risco.
            </p>
          </div>
        </div>

        <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5">
          <TrendingUp className="mt-0.5 size-5 shrink-0 text-green-700" />

          <div>
            <p className="font-medium text-slate-950">
              Ganho de desempenho
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Entre matrícula e segundo semestre, a variação do ROC-AUC foi de{" "}
              <span className="font-semibold text-slate-900">
                {aucImprovement >= 0 ? "+" : ""}
                {(aucImprovement * 100)
                  .toFixed(1)
                  .replace(".", ",")}{" "}
                pontos percentuais
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

interface StageMetricProps {
  label: string;
  value: string;
}

function StageMetric({
  label,
  value,
}: StageMetricProps) {
  return (
    <div>
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-base font-semibold text-slate-950">
        {value}
      </p>
    </div>
  );
}