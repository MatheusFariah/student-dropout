import { Suspense } from "react";
import type { ElementType } from "react";

import {
  BrainCircuit,
  CheckCircle2,
  Scale,
  TreePine,
} from "lucide-react";

import { ModelsComparisonChart } from "@/components/models/models-comparison-chart";
import { getModelsAnalysis } from "@/lib/api/models";
import type { ModelResult } from "@/types/models";

const loadingModelKeys = [
  "dummy",
  "logistic",
  "tree",
];

function formatMetric(value: number) {
  return `${(value * 100)
    .toFixed(1)
    .replace(".", ",")}%`;
}

function getModelIcon(
  modelKey: string,
): ElementType {
  if (
    modelKey ===
    "dummy_classifier"
  ) {
    return Scale;
  }

  if (
    modelKey ===
    "decision_tree"
  ) {
    return TreePine;
  }

  return BrainCircuit;
}

function getModelDescription(
  model: ModelResult,
) {
  if (
    model.key ===
    "dummy_classifier"
  ) {
    return "Serve como referência mínima. Ele sempre escolhe a classe mais frequente do treino, que neste caso é “não evasão”.";
  }

  if (
    model.key ===
    "logistic_regression"
  ) {
    return "Estima a probabilidade de evasão combinando as características acadêmicas, financeiras e pessoais do estudante.";
  }

  if (
    model.key ===
    "decision_tree"
  ) {
    return "Cria regras de decisão a partir dos dados para separar estudantes com maior ou menor risco de evasão.";
  }

  return model.description;
}

function getModelStatus(
  model: ModelResult,
) {
  if (
    model.key ===
    "dummy_classifier"
  ) {
    return "Referência";
  }

  if (model.is_best) {
    return "Melhor resultado";
  }

  return "Modelo avaliado";
}

async function ModelsContent() {
  const analysis =
    await getModelsAnalysis();

  return (
    <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-10">
      <section className="border-b border-slate-200 pb-8">
        <p className="text-sm font-medium text-green-700">
          Etapa 02 · Comparação de modelos
        </p>

        <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 lg:text-4xl">
          Qual modelo identifica melhor o risco de evasão?
        </h1>

        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Treinamos três abordagens utilizando a mesma divisão dos dados.
          O objetivo é verificar quais modelos realmente conseguem
          aprender padrões de evasão e superar uma referência simples.
        </p>

        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          <TrainingInfo
            value={analysis.training.training_students.toLocaleString(
              "pt-BR",
            )}
            label="estudantes usados no treino"
          />

          <TrainingInfo
            value={analysis.training.test_students.toLocaleString(
              "pt-BR",
            )}
            label="estudantes reservados para teste"
          />

          <TrainingInfo
            value="80% / 20%"
            label="divisão entre treino e teste"
          />
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-400">
          Os três algoritmos receberam exatamente o mesmo conjunto de
          treino e foram avaliados sobre os mesmos estudantes de teste.
        </p>
      </section>

      <section>
        <div className="mb-6 max-w-3xl">
          <p className="text-sm font-medium text-slate-400">
            Algoritmos avaliados
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Três estratégias para o mesmo problema
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            O primeiro modelo funciona apenas como referência. Os outros
            dois precisam superá-lo para mostrar que realmente aprenderam
            informações úteis sobre a evasão.
          </p>
        </div>

        <div className="grid items-stretch gap-4 lg:grid-cols-3">
          {analysis.models.map(
            (model) => (
              <ModelCard
                key={model.key}
                model={model}
              />
            ),
          )}
        </div>
      </section>

      <section>
        <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">
              Comparação
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Como os modelos se comportaram?
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              As três métricas ajudam a entender não apenas quantos casos
              o modelo acertou, mas principalmente sua capacidade de
              encontrar estudantes que realmente evadiram.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:max-w-2xl">
            <MetricExplanation
              label="Precision"
              description="Entre os alertas emitidos, quantos estavam corretos."
            />

            <MetricExplanation
              label="Recall"
              description="Entre as evasões reais, quantas foram encontradas."
            />

            <MetricExplanation
              label="F1-score"
              description="Equilíbrio entre Precision e Recall."
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ModelsComparisonChart
            models={analysis.models}
          />
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-400">
          Neste problema, Recall merece atenção especial porque representa
          quantos estudantes que realmente evadiram foram identificados
          pelo modelo.
        </p>
      </section>

      <section className="rounded-2xl border border-green-200 bg-green-50/60 p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-700" />

              <p className="text-sm font-semibold text-green-700">
                Modelo selecionado
              </p>
            </div>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {analysis.best_model.name}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Entre os modelos preditivos avaliados, apresentou o melhor
              equilíbrio entre qualidade dos alertas e identificação das
              evasões. Por isso, será utilizado nas próximas etapas.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 border-t border-green-200 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <BestMetric
              label="F1"
              value={
                analysis.best_model.f1
              }
            />

            <BestMetric
              label="Recall"
              value={
                analysis.best_model.recall
              }
            />

            <BestMetric
              label="AUC"
              value={
                analysis.best_model.roc_auc
              }
            />
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 py-8">
        <p className="text-sm font-medium text-green-700">
          Resultado da etapa
        </p>

        <h2 className="mt-2 max-w-4xl text-xl font-semibold leading-8 text-slate-950">
          Os modelos preditivos conseguiram aprender padrões que não são
          capturados pelo baseline.
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Com o melhor modelo escolhido, a próxima etapa analisa seus
          acertos, erros e a capacidade real de identificar estudantes em
          risco.
        </p>
      </section>
    </div>
  );
}

interface TrainingInfoProps {
  value: string;
  label: string;
}

function TrainingInfo({
  value,
  label,
}: TrainingInfoProps) {
  return (
    <div className="border-l-2 border-green-600 pl-4">
      <p className="text-lg font-semibold text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {label}
      </p>
    </div>
  );
}

interface ModelCardProps {
  model: ModelResult;
}

function ModelCard({
  model,
}: ModelCardProps) {
  const ModelIcon =
    getModelIcon(model.key);

  const isBaseline =
    model.key ===
    "dummy_classifier";

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm ${
        model.is_best
          ? "border-green-300 ring-1 ring-green-100"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-slate-50">
          <ModelIcon className="size-5 text-slate-600" />
        </div>

        <span
          className={`text-xs font-semibold ${
            model.is_best
              ? "text-green-700"
              : "text-slate-400"
          }`}
        >
          {getModelStatus(model)}
        </span>
      </div>

      <p className="mt-5 text-sm text-slate-400">
        {model.category}
      </p>

      <h3 className="mt-1 text-xl font-semibold text-slate-950">
        {model.name}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {getModelDescription(
          model,
        )}
      </p>

      {isBaseline && (
        <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium text-slate-600">
            Por que as métricas ficam em 0%?
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Como o DummyClassifier classifica todos os estudantes como
            “não evasão”, ele nunca gera uma previsão de evasão. Assim,
            nenhuma evasão real é identificada e Precision, Recall e F1
            ficam em 0%.
          </p>
        </div>
      )}

      <div className="mt-auto grid grid-cols-3 gap-3 border-t border-slate-100 pt-5">
        <ModelMetric
          label="Precision"
          value={
            model.metrics.precision
          }
        />

        <ModelMetric
          label="Recall"
          value={
            model.metrics.recall
          }
        />

        <ModelMetric
          label="F1"
          value={
            model.metrics.f1
          }
        />
      </div>
    </article>
  );
}

interface MetricExplanationProps {
  label: string;
  description: string;
}

function MetricExplanation({
  label,
  description,
}: MetricExplanationProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-700">
        {label}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
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

      <p className="mt-1 text-base font-semibold text-slate-950">
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
      <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />

      <div className="grid gap-4 lg:grid-cols-3">
        {loadingModelKeys.map(
          (modelKey) => (
            <div
              key={modelKey}
              className="h-96 animate-pulse rounded-2xl bg-slate-200"
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
    <Suspense
      fallback={<ModelsLoading />}
    >
      <ModelsContent />
    </Suspense>
  );
}