export interface CategoryScores {
  texture: number;
  lighting: number;
  anatomy: number;
  background: number;
  semantics: number;
}

export interface TrustResult {
  trust_score: number;
  verdict: string;
  deepfake_probability: number;
  details: {
    categoryScores: CategoryScores;
    findings: string[];
  };
}
