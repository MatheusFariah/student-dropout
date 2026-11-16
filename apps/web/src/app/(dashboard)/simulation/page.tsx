import type { ReactNode } from "react";

import {
  Activity,
  Banknote,
  Database,
  GraduationCap,
  MessageCircleMore,
  SlidersHorizontal,
  Target,
} from "lucide-react";

import { SimulationForm } from "@/components/simulation/simulation-form";

export default function SimulationPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-9">
      <section className="border-b border-slate-200 pb-7">
        <p className="text-sm font-medium text-green-700">
          Etapa 05 · Aplicação prática
        </p>

        <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 lg:text-4xl">
          Como transformar a previsão em uma ação?
        </h1>

        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          A simulação permite alterar características de um estudante e
          observar como o modelo transforma esse perfil em uma
          probabilidade estimada de evasão.
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

          <div className="flex items-center gap-2">
            <Database className="size-4 text-green-700" />

            Perfil complementado pela base
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-medium text-slate-400">
            Como funciona
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            O que acontece durante uma simulação?
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            O modelo foi treinado com 36 atributos. Para deixar a
            demonstração simples, o formulário permite alterar apenas as
            informações mais importantes e completa automaticamente o
            restante do perfil.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <ProcessCard
            icon={SlidersHorizontal}
            step="01"
            title="Perfil informado"
            description="O usuário informa 9 características acadêmicas, pessoais e financeiras."
            example="Ex.: idade 20 anos, média 12, 5 aprovações e mensalidade em dia."
          />

          <ProcessCard
            icon={Database}
            step="02"
            title="Perfil completado"
            description="O formulário pede apenas os dados principais. As outras informações são preenchidas com valores representativos encontrados na própria base."
            example="Ex.: para um campo numérico usamos um valor central da base; para categorias usamos a opção que aparece com mais frequência."
          />

          <ProcessCard
            icon={Target}
            step="03"
            title="Probabilidade calculada"
            description="Com o perfil completo, o modelo analisa os 36 atributos e estima a chance de evasão entre 0% e 100%."
            example="Ex.: se o modelo retornar 72%, esse estudante possui probabilidade estimada de evasão de 72%."
          />
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 px-5 py-4">
          <p className="text-sm font-semibold text-slate-800">
            Por que completar o perfil automaticamente?
          </p>

          <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500">
            O modelo precisa receber os mesmos 36 atributos utilizados no
            treinamento. Como seria pouco prático preencher todos eles em
            uma demonstração, o usuário altera apenas 9 informações e o
            sistema completa as outras 27 com valores representativos da
            base.
          </p>
        </div>
      </section>

      <SimulationForm />

      <section>
        <div className="mb-5">
          <p className="text-sm font-medium text-slate-400">
            Interpretação
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            Como interpretar a probabilidade?
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            A porcentagem é calculada pelo modelo. As faixas abaixo são
            utilizadas para deixar o resultado mais fácil de interpretar
            durante o acompanhamento.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <RiskCard
            value="< 35%"
            title="Risco baixo"
            description="Probabilidade mais baixa de evasão."
            example="Ex.: 24% de risco."
          />

          <RiskCard
            value="35% – 64,9%"
            title="Risco moderado"
            description="Faixa intermediária de atenção."
            example="Ex.: 48% de risco."
          />

          <RiskCard
            value="≥ 65%"
            title="Risco alto"
            description="Probabilidade elevada de evasão."
            example="Ex.: 78% de risco."
            highlighted
          />

          <RiskCard
            value="≥ 50%"
            title="Gera alerta"
            description="Ponto de corte utilizado para acompanhamento."
            example="Ex.: 52% já gera alerta."
            alert
          />
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 px-5 py-4">
          <p className="text-sm font-semibold text-slate-800">
            Qual a diferença entre risco e alerta?
          </p>

          <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500">
            As faixas de 35% e 65% servem apenas para facilitar a leitura
            do nível de risco. Já o valor de 50% é o ponto de corte usado
            para decidir se o estudante recebe ou não um alerta.
          </p>

          <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-xs text-slate-500">
            <p>
              <span className="font-semibold text-slate-800">
                42%
              </span>{" "}
              → risco moderado, sem alerta
            </p>

            <p>
              <span className="font-semibold text-slate-800">
                58%
              </span>{" "}
              → risco moderado, com alerta
            </p>

            <p>
              <span className="font-semibold text-slate-800">
                72%
              </span>{" "}
              → risco alto, com alerta
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <div>
          <p className="text-sm font-medium text-green-700">
            Conclusão de negócio
          </p>

          <h2 className="mt-2 max-w-4xl text-2xl font-semibold tracking-tight text-slate-950">
            Quem deve receber alerta e o que fazer depois?
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            A previsão funciona como uma ferramenta de triagem. O objetivo
            é identificar estudantes que podem precisar de acompanhamento
            antes que uma possível evasão aconteça.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <BusinessCard
            icon={Target}
            title="Quem recebe alerta?"
            example="Ex.: estudante com probabilidade de 63% já seria sinalizado."
          >
            Estudantes com probabilidade igual ou superior a{" "}
            <strong className="font-semibold text-slate-900">
              50%
            </strong>{" "}
            são sinalizados para acompanhamento. A partir de{" "}
            <strong className="font-semibold text-slate-900">
              65%
            </strong>
            , o risco é apresentado como alto.
          </BusinessCard>

          <BusinessCard
            icon={GraduationCap}
            title="Intervenção acadêmica"
            example="Ex.: contato da coordenação após baixo número de aprovações."
          >
            A coordenação pode investigar dificuldades de desempenho,
            adaptação, reprovações ou outros problemas relacionados ao
            acompanhamento do curso.
          </BusinessCard>

          <BusinessCard
            icon={Banknote}
            title="Intervenção financeira"
            example="Ex.: estudante com dívida pode ser encaminhado para orientação financeira."
          >
            Situações de dívida ou mensalidade irregular podem motivar
            contato para orientação ou encaminhamento financeiro.
          </BusinessCard>
        </div>

        <div className="mt-6 flex gap-4 border-l-2 border-green-600 pl-5">
          <MessageCircleMore className="mt-1 size-5 shrink-0 text-green-700" />

          <div>
            <p className="max-w-4xl text-lg font-semibold leading-7 text-slate-950">
              O modelo não decide quem irá abandonar o curso.
            </p>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
              Ele estima risco para apoiar uma intervenção antecipada.
              A análise final deve considerar o contexto do estudante e
              permanecer sob responsabilidade humana.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

interface ProcessCardProps {
  icon: typeof Target;
  step: string;
  title: string;
  description: string;
  example: string;
}

function ProcessCard({
  icon: ProcessIcon,
  step,
  title,
  description,
  example,
}: ProcessCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-slate-50">
          <ProcessIcon className="size-5 text-slate-600" />
        </div>

        <span className="text-xs font-semibold text-green-700">
          {step}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-auto pt-4">
        <div className="border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold text-slate-700">
            Exemplo
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {example}
          </p>
        </div>
      </div>
    </article>
  );
}

interface RiskCardProps {
  value: string;
  title: string;
  description: string;
  example: string;
  highlighted?: boolean;
  alert?: boolean;
}

function RiskCard({
  value,
  title,
  description,
  example,
  highlighted = false,
  alert = false,
}: RiskCardProps) {
  return (
    <article
      className={`flex h-full flex-col rounded-2xl border p-5 ${
        alert
          ? "border-green-300 bg-green-50/60"
          : highlighted
            ? "border-red-200 bg-red-50/40"
            : "border-slate-200 bg-white"
      }`}
    >
      <p
        className={`text-2xl font-semibold tracking-[-0.04em] ${
          alert
            ? "text-green-700"
            : highlighted
              ? "text-red-600"
              : "text-slate-950"
        }`}
      >
        {value}
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-800">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>

      <p className="mt-auto pt-3 text-xs font-medium text-slate-600">
        {example}
      </p>
    </article>
  );
}

interface BusinessCardProps {
  icon: typeof Target;
  title: string;
  example: string;
  children: ReactNode;
}

function BusinessCard({
  icon: BusinessIcon,
  title,
  example,
  children,
}: BusinessCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex size-10 items-center justify-center rounded-xl bg-slate-50">
        <BusinessIcon className="size-5 text-green-700" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {children}
      </p>

      <div className="mt-auto pt-4">
        <p className="border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
          <span className="font-semibold text-slate-700">
            Exemplo:{" "}
          </span>

          {example.replace("Ex.: ", "")}
        </p>
      </div>
    </article>
  );
}