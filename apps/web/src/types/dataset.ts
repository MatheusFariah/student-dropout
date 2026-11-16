export interface DatasetClasses {
  graduate: number;
  dropout: number;
  enrolled: number;
}

export interface DatasetSummary {
  students: number;
  features: number;
  missing_values: number;
  classes: DatasetClasses;
}

export interface DatasetAgeOverview {
  mean: number;
  median: number;
  minimum: number;
  maximum: number;
}

export interface DatasetExplorationOverview {
  students: number;
  features: number;
  missing_values: number;
  duplicated_rows: number;
  courses: number;
  age: DatasetAgeOverview;
}

export interface AgeDistributionItem {
  range: string;
  total: number;
  dropout: number;
  dropout_rate: number;
}

export interface FinancialFactorItem {
  factor: string;
  status: string;
  label: string;
  total: number;
  dropout: number;
  dropout_rate: number;
}

export interface AcademicPerformanceItem {
  target: string;
  label: string;
  first_sem_approved: number;
  first_sem_grade: number;
  second_sem_approved: number;
  second_sem_grade: number;
}

export interface CorrelationItem {
  feature: string;
  label: string;
  correlation: number;
}

export interface ExplorationInsight {
  type: string;
  title: string;
  text: string;
}

export interface DatasetTargetPreparation {
  positive_class: string;
  positive_label: string;
  negative_classes: string[];
  negative_label: string;
}

export interface DatasetSplitPreparation {
  training_percentage: number;
  test_percentage: number;
  training_students: number;
  test_students: number;
  stratified: boolean;
  random_state: number;
  training_dropout_rate: number;
  test_dropout_rate: number;
}

export interface DatasetPreprocessing {
  categorical_features: number;
  numeric_features: number;
  encoding: string;
  scaling: string;
  transformed_features: number;
  training_rows: number;
  test_rows: number;
}

export interface DatasetPreparation {
  target: DatasetTargetPreparation;
  split: DatasetSplitPreparation;
  preprocessing: DatasetPreprocessing;
}

export interface DatasetExploration {
  overview: DatasetExplorationOverview;
  age_distribution: AgeDistributionItem[];
  financial_factors: FinancialFactorItem[];
  academic_performance: AcademicPerformanceItem[];
  correlations: CorrelationItem[];
  insights: ExplorationInsight[];
  preparation: DatasetPreparation;
}