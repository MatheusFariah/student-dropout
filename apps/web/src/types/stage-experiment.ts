export interface StageMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
}

export interface StageExperimentItem {
  key: "enrollment" | "first_semester" | "second_semester";
  label: string;
  moment: string;
  lead_time: string;
  features: number;
  metrics: StageMetrics;
}

export interface StageExperimentResult {
  model: string;
  test_students: number;
  stages: StageExperimentItem[];
}