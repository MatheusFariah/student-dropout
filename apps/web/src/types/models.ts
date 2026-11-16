export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
}

export interface ModelResult {
  key: string;
  name: string;
  category: string;
  description: string;
  metrics: ModelMetrics;
  is_best: boolean;
}

export interface BestModel {
  key: string;
  name: string;
  f1: number;
  recall: number;
  roc_auc: number;
}

export interface ModelsTraining {
  training_students: number;
  test_students: number;
}

export interface ModelsAnalysis {
  models: ModelResult[];
  best_model: BestModel;
  training: ModelsTraining;
}