import { fetchApi } from "@/lib/api/request";

import type {
  DatasetExploration,
  DatasetSummary,
} from "@/types/dataset";

export async function getDatasetSummary(): Promise<DatasetSummary> {
  return fetchApi<DatasetSummary>(
    "/api/dataset/summary",
  );
}

export async function getDatasetExploration(): Promise<DatasetExploration> {
  return fetchApi<DatasetExploration>(
    "/api/dataset/exploration",
    {
      timeout: 30000,
    },
  );
}