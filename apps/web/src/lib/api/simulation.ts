import { fetchApi } from "@/lib/api/request";

import type {
  SimulationInput,
  SimulationResult,
} from "@/types/simulation";

export async function simulateStudent(
  simulationInput: SimulationInput,
): Promise<SimulationResult> {
  return fetchApi<SimulationResult>(
    "/api/simulation",
    {
      method: "POST",
      body: simulationInput,
      timeout: 15000,
    },
  );
}