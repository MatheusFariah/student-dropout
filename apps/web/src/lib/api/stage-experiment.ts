import { fetchApi } from "@/lib/api/request";

import type { StageExperimentResult } from "@/types/stage-experiment";

export async function getStageExperiment(): Promise<StageExperimentResult> {
  return fetchApi<StageExperimentResult>(
    "/api/analysis/stages",
    {
      timeout: 30000,
    },
  );
}