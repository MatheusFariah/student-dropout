import { fetchApi } from "@/lib/api/request";
import type { ModelsAnalysis } from "@/types/models";

export async function getModelsAnalysis(): Promise<ModelsAnalysis> {
  console.log("[MODELS] Carregando comparação");

  const modelsAnalysis =
    await fetchApi<ModelsAnalysis>(
      "/api/models",
      {
        timeout: 15000,
      },
    );

  console.log("[MODELS] Comparação carregada");

  return modelsAnalysis;
}