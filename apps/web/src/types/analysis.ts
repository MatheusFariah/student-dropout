export interface AnalysisMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
}

export interface ExplainabilityModel {
  key: string;
  name: string;
  metrics: AnalysisMetrics;
}

export interface ExplainabilityMethod {
  name: string;
  description: string;
  test_samples: number;
}

export interface ExplainabilityFeature {
  feature: string;
  label: string;
  importance: number;
  importance_std: number;
}

export interface ExplainabilityInsight {
  feature: string;
  label: string;
  text: string;
}

export interface ExplainabilityResult {
  model: ExplainabilityModel;
  method: ExplainabilityMethod;
  features: ExplainabilityFeature[];
  insights: ExplainabilityInsight[];
}