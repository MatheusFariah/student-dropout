import {
  Activity,
  Banknote,
  GraduationCap,
  MessageCircleMore,
  Target,
} from "lucide-react";

import { SimulationForm } from "@/components/simulation/simulation-form";

export default function SimulationPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-8">
      <section className="border-b border-slate-200 pb-7">
        <p className="text-sm font-medium text-green-700">
          Etapa 05 · Aplicação prática
        </p>

        <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 lg:text-4xl">
          Como transformar a previsão em uma ação?
        </h1>

        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Simule um estudante e veja como a probabilidade estimada pode
          ser transformada em um alerta para acompanhamento.
        </p>

        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-l-2 border-green-600 pl-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-green-700" />

            Probabilidade individual
          </div>

          <div className="flex items-center gap-2">
            <Target className="size-4 text-green-700" />

            Alerta a partir de 50%
          </div>
        </div>
      </section>

      <SimulationForm />

      <section className="border-t border-slate-200 pt-8">
        <div>
          <p className="text-sm font-medium text-green-700">
            Conclusão de negócio
          </p>

          <h2 className="mt-2 max-w-4xl text-2xl font-semibold tracking-tight text-slate-950">
            Quem deve receber alerta e o que fazer depois?
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            A previsão serve como triagem. O objetivo é identificar
            estudantes que podem precisar de acompanhamento antes que
            uma possível evasão aconteça.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <BusinessCard
            icon={Target}
            title="Quem recebe alerta?"
          >
            Estudantes com risco igual ou superior a{" "}
            <strong className="font-semibold text-slate-900">
              50%
            </strong>
            . Acima de{" "}
            <strong className="font-semibold text-slate-900">
              65%
            </strong>
            , o caso passa a ter prioridade.
          </BusinessCard>

          <BusinessCard
            icon={GraduationCap}
            title="Intervenção acadêmica"
          >
            A coordenação pode entrar em contato para identificar
            dificuldades de desempenho, adaptação ou acompanhamento do
            curso.
          </BusinessCard>

          <BusinessCard
            icon={Banknote}
            title="Intervenção financeira"
          >
            Dívida ou mensalidade irregular podem gerar encaminhamento
            para orientação financeira antes que o problema se agrave.
          </BusinessCard>
        </div>

        <div className="mt-6 flex gap-4 border-l-2 border-green-600 pl-5">
          <MessageCircleMore className="mt-1 size-5 shrink-0 text-green-700" />

          <div>
            <p className="max-w-4xl text-lg font-semibold leading-7 text-slate-950">
              O modelo não decide quem irá abandonar o curso.
            </p>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
              Ele identifica sinais de risco para permitir uma
              intervenção antecipada. A decisão final continua sendo
              humana e contextualizada.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

interface BusinessCardProps {
  icon: typeof Target;
  title: string;
  children: React.ReactNode;
}

function BusinessCard({
  icon: BusinessIcon,
  title,
  children,
}: BusinessCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex size-10 items-center justify-center rounded-xl bg-slate-50">
        <BusinessIcon className="size-5 text-green-700" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {children}
      </p>
    </article>
  );
}