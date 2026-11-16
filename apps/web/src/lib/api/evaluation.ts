import { fetchApi } from "@/lib/api/request";
import type { EvaluationResult } from "@/types/evaluation";

export async function getEvaluation(): Promise<EvaluationResult> {
  console.log("[EVALUATION] Carregando avaliação");

  const evaluationResult =
    await fetchApi<EvaluationResult>(
      "/api/evaluation",
      {
        timeout: 15000,
      },
    );

  console.log("[EVALUATION] Avaliação carregada");

  return evaluationResult;
}