export type Finding = {
  disease: string;
  probability: number;
  bengraham_probability?: number;
  colour_probability?: number;
  threshold: number;
  flagged: boolean;
  uncertain?: boolean;
};

export type IQAStats = {
  sharpness_score: number;
  contrast_score: number;
  uniformity_score: number;
  quality_grade: string;
  fov_coverage_pct: number;
};

export type TriageUrgency = {
  level: string;
  color: "red" | "amber" | "emerald" | "slate";
  action: string;
};

export type PredictionResult = {
  is_fundus?: boolean;
  validation_message?: string;
  findings: Finding[];
  flagged_diseases: string[];
  ungradable?: boolean;
  triage_urgency?: TriageUrgency;
  iqa?: IQAStats;
  previews?: {
    bengraham: string;
    colour: string;
    red_free: string;
  };
  pipeline?: string;
  num_bg_models?: number;
  num_colour_models?: number;
  img_size: number;
};

export type PatientSessionRecord = {
  id: string;
  timestamp: string;
  patientName: string;
  eyeLaterality: string;
  primaryDisease: string;
  confidence: number;
  urgencyLevel: string;
  urgencyColor: "red" | "amber" | "emerald" | "slate";
  previewUrl: string;
  result: PredictionResult;
};

export const DISEASE_LABELS: Record<string, string> = {
  DR: "Diabetic Retinopathy",
  ARMD: "Age-Related Macular Degeneration",
  DN: "Drusen (Drusenoid Lesions)",
  MYA: "Pathologic Myopia",
  BRVO: "Branch Retinal Vein Occlusion",
  TSLN: "Tessellation (Fundus Tigroid)",
  ODC: "Optic Disc Cupping",
  Cataract: "Ocular Media Opacity / Cataract",
  Glaucoma: "Optic Neuropathy / Glaucoma",
  Normal: "Normal Retinal Fundus",
};
