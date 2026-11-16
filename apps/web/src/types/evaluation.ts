export interface EvaluationMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
}

export interface EvaluationModel {
  key: string;
  name: string;
}

export interface EvaluationConfusionMatrix {
  true_negative: number;
  false_positive: number;
  false_negative: number;
  true_positive: number;
}

export interface EvaluationSummary {
  test_students: number;
  actual_dropouts: number;
  detected_dropouts: number;
  missed_dropouts: number;
  predicted_alerts: number;
  correct_alerts: number;
  detection_rate: number;
  alert_precision: number;
  missed_rate: number;
}

export interface RocCurvePoint {
  false_positive_rate: number;
  true_positive_rate: number;
  threshold: number | null;
}

export interface EvaluationResult {
  model: EvaluationModel;
  threshold: number;
  metrics: EvaluationMetrics;
  confusion_matrix: EvaluationConfusionMatrix;
  summary: EvaluationSummary;
  roc_curve: RocCurvePoint[];
}