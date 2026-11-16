"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  LoaderCircle,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { simulateStudent } from "@/lib/api/simulation";

import type {
  SimulationInput,
  SimulationResult,
} from "@/types/simulation";

const initialSimulation: SimulationInput = {
  age_at_enrollment: 20,
  admission_grade: 130,
  tuition_fees_up_to_date: true,
  debtor: false,
  scholarship_holder: false,
  first_sem_approved: 5,
  first_sem_grade: 12,
  second_sem_approved: 5,
  second_sem_grade: 12,
};

function formatProbability(
  value: number,
) {
  return `${(value * 100)
    .toFixed(1)
    .replace(".", ",")}%`;
}

export function SimulationForm() {
  const [
    simulationInput,
    setSimulationInput,
  ] = useState<SimulationInput>(
    initialSimulation,
  );

  const [
    simulationResult,
    setSimulationResult,
  ] = useState<SimulationResult | null>(
    null,
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(
    null,
  );

  function updateNumber(
    fieldName: keyof SimulationInput,
    value: string,
  ) {
    setSimulationInput(
      (currentInput) => ({
        ...currentInput,
        [fieldName]:
          Number(value),
      }),
    );
  }

  function updateBoolean(
    fieldName: keyof SimulationInput,
    value: boolean,
  ) {
    setSimulationInput(
      (currentInput) => ({
        ...currentInput,
        [fieldName]: value,
      }),
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result =
        await simulateStudent(
          simulationInput,
        );

      setSimulationResult(
        result,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível realizar a simulação.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            Perfil do estudante
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Informe os principais dados usados pelo modelo.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <NumberField
            label="Idade na matrícula"
            value={
              simulationInput
                .age_at_enrollment
            }
            min={15}
            max={80}
            step={1}
            onChange={(value) =>
              updateNumber(
                "age_at_enrollment",
                value,
              )
            }
          />

          <NumberField
            label="Nota de admissão"
            value={
              simulationInput
                .admission_grade
            }
            min={0}
            max={200}
            step={0.1}
            onChange={(value) =>
              updateNumber(
                "admission_grade",
                value,
              )
            }
          />

          <NumberField
            label="Aprovações no 1º semestre"
            value={
              simulationInput
                .first_sem_approved
            }
            min={0}
            max={30}
            step={1}
            onChange={(value) =>
              updateNumber(
                "first_sem_approved",
                value,
              )
            }
          />

          <NumberField
            label="Média do 1º semestre"
            value={
              simulationInput
                .first_sem_grade
            }
            min={0}
            max={20}
            step={0.1}
            onChange={(value) =>
              updateNumber(
                "first_sem_grade",
                value,
              )
            }
          />

          <NumberField
            label="Aprovações no 2º semestre"
            value={
              simulationInput
                .second_sem_approved
            }
            min={0}
            max={30}
            step={1}
            onChange={(value) =>
              updateNumber(
                "second_sem_approved",
                value,
              )
            }
          />

          <NumberField
            label="Média do 2º semestre"
            value={
              simulationInput
                .second_sem_grade
            }
            min={0}
            max={20}
            step={0.1}
            onChange={(value) =>
              updateNumber(
                "second_sem_grade",
                value,
              )
            }
          />
        </div>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <p className="mb-4 text-sm font-medium text-slate-700">
            Situação financeira
          </p>

          <div className="space-y-4">
            <BooleanField
              label="Mensalidade em dia"
              value={
                simulationInput
                  .tuition_fees_up_to_date
              }
              onChange={(value) =>
                updateBoolean(
                  "tuition_fees_up_to_date",
                  value,
                )
              }
            />

            <BooleanField
              label="Possui dívida"
              value={
                simulationInput
                  .debtor
              }
              onChange={(value) =>
                updateBoolean(
                  "debtor",
                  value,
                )
              }
            />

            <BooleanField
              label="Possui bolsa de estudos"
              value={
                simulationInput
                  .scholarship_holder
              }
              onChange={(value) =>
                updateBoolean(
                  "scholarship_holder",
                  value,
                )
              }
            />
          </div>
        </div>

        {errorMessage && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Calculando risco
            </>
          ) : (
            <>
              <TrendingUp className="size-4" />
              Simular risco
            </>
          )}
        </button>
      </form>

      <SimulationResultPanel
        result={simulationResult}
      />
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (
    value: string,
  ) => void;
}

function NumberField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: NumberFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">
        {label}
      </span>

      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
      />
    </label>
  );
}

interface BooleanFieldProps {
  label: string;
  value: boolean;
  onChange: (
    value: boolean,
  ) => void;
}

function BooleanField({
  label,
  value,
  onChange,
}: BooleanFieldProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-600">
        {label}
      </span>

      <div className="flex rounded-lg border border-slate-200 p-1">
        <button
          type="button"
          onClick={() =>
            onChange(true)
          }
          className={`rounded-md px-4 py-1.5 text-xs font-medium transition ${
            value
              ? "bg-green-700 text-white"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          Sim
        </button>

        <button
          type="button"
          onClick={() =>
            onChange(false)
          }
          className={`rounded-md px-4 py-1.5 text-xs font-medium transition ${
            !value
              ? "bg-slate-700 text-white"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          Não
        </button>
      </div>
    </div>
  );
}

interface SimulationResultPanelProps {
  result: SimulationResult | null;
}

function SimulationResultPanel({
  result,
}: SimulationResultPanelProps) {
  if (!result) {
    return (
      <div className="flex min-h-[520px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8">
        <div className="max-w-sm text-center">
          <TrendingUp className="mx-auto size-8 text-slate-300" />

          <h2 className="mt-4 text-lg font-semibold text-slate-800">
            Resultado da simulação
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Preencha o perfil e clique em simular para visualizar o risco estimado de evasão.
          </p>
        </div>
      </div>
    );
  }

  const riskStyles = {
    low: {
      value:
        "text-green-700",
      background:
        "bg-green-50",
      border:
        "border-green-200",
      progress:
        "bg-green-600",
    },
    moderate: {
      value:
        "text-amber-600",
      background:
        "bg-amber-50",
      border:
        "border-amber-200",
      progress:
        "bg-amber-500",
    },
    high: {
      value:
        "text-red-600",
      background:
        "bg-red-50",
      border:
        "border-red-200",
      progress:
        "bg-red-600",
    },
  };

  const selectedStyle =
    riskStyles[
      result.risk.level
    ];

  return (
    <div className="flex flex-col gap-5">
      <section
        className={`rounded-2xl border p-7 ${selectedStyle.border} ${selectedStyle.background}`}
      >
        <p className="text-sm font-medium text-slate-500">
          Probabilidade estimada de evasão
        </p>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p
              className={`text-5xl font-semibold tracking-[-0.05em] ${selectedStyle.value}`}
            >
              {formatProbability(
                result.dropout_probability,
              )}
            </p>

            <p className="mt-2 text-sm font-medium text-slate-700">
              Risco{" "}
              {result.risk.label.toLowerCase()}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-500">
              Limiar para alerta
            </p>

            <p className="mt-1 text-lg font-semibold text-slate-900">
              {formatProbability(
                result.threshold,
              )}
            </p>
          </div>
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white">
          <div
            className={`h-full rounded-full transition-all ${selectedStyle.progress}`}
            style={{
              width: `${Math.min(
                result.dropout_probability *
                  100,
                100,
              )}%`,
            }}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          {result.alert ? (
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-500" />
          ) : (
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-700" />
          )}

          <div>
            <p className="font-semibold text-slate-950">
              {result.alert
                ? "Aluno receberia alerta"
                : "Aluno não receberia alerta"}
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {result.alert
                ? "A probabilidade ultrapassou o limiar de 50%, indicando prioridade para acompanhamento."
                : "A probabilidade ficou abaixo do limiar definido para intervenção."}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-400">
          Perfil informado
        </p>

        <h2 className="mt-1 text-xl font-semibold text-slate-950">
          Sinais observados
        </h2>

        <div className="mt-5 space-y-3">
          {result.signals.length >
          0 ? (
            result.signals.map(
              (signal) => (
                <div
                  key={`${signal.type}-${signal.label}`}
                  className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                >
                  {signal.type ===
                  "risk" ? (
                    <AlertTriangle className="size-4 shrink-0 text-amber-500" />
                  ) : (
                    <ShieldCheck className="size-4 shrink-0 text-green-700" />
                  )}

                  <span className="text-sm text-slate-600">
                    {signal.label}
                  </span>
                </div>
              ),
            )
          ) : (
            <p className="text-sm text-slate-500">
              Nenhum sinal adicional foi destacado para esse perfil.
            </p>
          )}
        </div>

        <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400">
          Os sinais ajudam a interpretar o perfil informado e não representam causalidade individual.
        </p>
      </section>

      <p className="text-xs text-slate-400">
        Predição realizada com
        {result.model.name}.
      </p>
    </div>
  );
}