import { Suspense } from "react";
import type { ElementType } from "react";

import {
  BrainCircuit,
  CheckCircle2,
  GitCompareArrows,
  Scale,
  Target,
  TreePine,
} from "lucide-react";

import { ModelsComparisonChart } from "@/components/models/models-comparison-chart";
import { getModelsAnalysis } from "@/lib/api/models";
import type { ModelResult } from "@/types/models";

function formatMetric(value: number) {
  return `${(value * 100)
    .toFixed(1)
    .replace(".", ",")}%`;
}

function getModelIcon(modelKey: string): ElementType {
  if (modelKey === "dummy_classifier") {
    return Scale;
  }

  if (modelKey === "decision_tree") {
    return TreePine;
  }

  return BrainCircuit;
}

async function ModelsContent() {
  const analysis = await getModelsAnalysis();

  return (
    <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-8">
      <section className="border-b border-slate-200 pb-7">
        <p className="text-sm font-medium text-green-700">
          Etapa 02 · Modelagem
        </p>

        <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 lg:text-4xl">
          Qual modelo consegue identificar melhor o risco de evasão?
        </h1>

        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Treinamos três abordagens sobre os mesmos dados e comparamos
          seus resultados no conjunto de teste.
        </p>

        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-l-2 border-green-600 pl-4 text-sm text-slate-500">
          <p>
            <span className="font-semibold text-slate-900">
              {analysis.training.training_students.toLocaleString(
                "pt-BR",
              )}
            </span>{" "}
            estudantes para treino
          </p>

          <p>
            <span className="font-semibold text-slate-900">
              {analysis.training.test_students.toLocaleString(
                "pt-BR",
              )}
            </span>{" "}
            estudantes para teste
          </p>

          <p>Mesmo split para todos os modelos</p>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-medium text-slate-400">
            Algoritmos
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            Três formas diferentes de abordar o problema
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {analysis.models.map((model) => (
            <ModelCard
              key={model.key}
              model={model}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">
              Comparação
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Como os modelos se comportaram?
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-slate-500">
            Precision mede a qualidade dos alertas, Recall mostra
            quantas evasões foram encontradas e F1 equilibra as duas
            métricas.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ModelsComparisonChart
            models={analysis.models}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-green-200 bg-green-50/60 p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-700" />

              <p className="text-sm font-medium text-green-700">
                Modelo selecionado
              </p>
            </div>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {analysis.best_model.name}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Entre os modelos preditivos testados, apresentou o melhor
              F1-score e será utilizado nas próximas etapas do projeto.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 border-t border-green-200 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <BestMetric
              label="F1"
              value={analysis.best_model.f1}
            />

            <BestMetric
              label="Recall"
              value={analysis.best_model.recall}
            />

            <BestMetric
              label="AUC"
              value={analysis.best_model.roc_auc}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 py-7">
        <p className="text-sm font-medium text-green-700">
          Conclusão
        </p>

        <h2 className="mt-2 max-w-4xl text-xl font-semibold text-slate-950">
          Os modelos aprenderam padrões além do baseline e agora
          podemos avaliar o melhor deles com mais profundidade.
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          A próxima etapa analisa erros, acertos e a capacidade real de
          identificar estudantes em risco.
        </p>
      </section>
    </div>
  );
}

interface ModelCardProps {
  model: ModelResult;
}

function ModelCard({
  model,
}: ModelCardProps) {
  const ModelIcon = getModelIcon(model.key);

  return (
    <article
      className={`rounded-2xl border bg-white p-6 shadow-sm ${
        model.is_best
          ? "border-green-300"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-slate-50">
          <ModelIcon className="size-5 text-slate-600" />
        </div>

        {model.is_best && (
          <span className="text-xs font-semibold text-green-700">
            Melhor resultado
          </span>
        )}
      </div>

      <p className="mt-5 text-sm text-slate-400">
        {model.category}
      </p>

      <h3 className="mt-1 text-xl font-semibold text-slate-950">
        {model.name}
      </h3>

      <p className="mt-3 min-h-16 text-sm leading-6 text-slate-500">
        {model.description}
      </p>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
        <ModelMetric
          label="Precision"
          value={model.metrics.precision}
        />

        <ModelMetric
          label="Recall"
          value={model.metrics.recall}
        />

        <ModelMetric
          label="F1"
          value={model.metrics.f1}
        />
      </div>
    </article>
  );
}

interface ModelMetricProps {
  label: string;
  value: number;
}

function ModelMetric({
  label,
  value,
}: ModelMetricProps) {
  return (
    <div>
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {formatMetric(value)}
      </p>
    </div>
  );
}

interface BestMetricProps {
  label: string;
  value: number;
}

function BestMetric({
  label,
  value,
}: BestMetricProps) {
  return (
    <div>
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold text-slate-950">
        {formatMetric(value)}
      </p>
    </div>
  );
}

function ModelsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-8">
      <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />

      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map(
          (_, modelIndex) => (
            <div
              key={modelIndex}
              className="h-72 animate-pulse rounded-2xl bg-slate-200"
            />
          ),
        )}
      </div>

      <div className="h-[430px] animate-pulse rounded-2xl bg-slate-200" />
    </div>
  );
}

export default function ModelsPage() {
  return (
    <Suspense fallback={<ModelsLoading />}>
      <ModelsContent />
    </Suspense>
  );
}