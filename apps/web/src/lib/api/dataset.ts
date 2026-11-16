import type {
  DatasetExploration,
  DatasetSummary,
} from "@/types/dataset";

const apiUrl = process.env.API_URL ?? "http://127.0.0.1:8000";

export async function getDatasetSummary(): Promise<DatasetSummary> {
  const response = await fetch(`${apiUrl}/api/dataset/summary`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorMessage = await response.text();

    throw new Error(
      `Erro ao carregar dataset (${response.status}): ${errorMessage}`,
    );
  }

  const datasetSummary: DatasetSummary = await response.json();

  return datasetSummary;
}

export async function getDatasetExploration(): Promise<DatasetExploration> {
  const response = await fetch(`${apiUrl}/api/dataset/exploration`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorMessage = await response.text();

    throw new Error(
      `Erro ao carregar exploração (${response.status}): ${errorMessage}`,
    );
  }

  const datasetExploration: DatasetExploration = await response.json();

  return datasetExploration;
}