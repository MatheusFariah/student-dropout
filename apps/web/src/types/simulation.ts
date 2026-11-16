export interface SimulationInput {
  age_at_enrollment: number;
  admission_grade: number;
  tuition_fees_up_to_date: boolean;
  debtor: boolean;
  scholarship_holder: boolean;
  first_sem_approved: number;
  first_sem_grade: number;
  second_sem_approved: number;
  second_sem_grade: number;
}

export interface SimulationModel {
  key: string;
  name: string;
}

export interface SimulationRisk {
  level: "low" | "moderate" | "high";
  label: string;
}

export interface SimulationSignal {
  type: "risk" | "protective";
  label: string;
}

export interface SimulationResult {
  model: SimulationModel;
  dropout_probability: number;
  threshold: number;
  alert: boolean;
  risk: SimulationRisk;
  signals: SimulationSignal[];
}