import { fetchApi } from "@/lib/api/request";
import type { ExplainabilityResult } from "@/types/analysis";

export async function getExplainability(): Promise<ExplainabilityResult> {
  console.log("[ANALYSIS] Carregando explicabilidade");

  const explainabilityResult =
    await fetchApi<ExplainabilityResult>(
      "/api/analysis/explainability",
      {
        timeout: 15000,
      },
    );

  console.log("[ANALYSIS] Explicabilidade carregada");

  return explainabilityResult;
}