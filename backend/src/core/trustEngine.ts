import { TrustResult, CategoryScores } from '../types';

export const computeTrust = (
  aiPercentage: number,
  categoryScores: CategoryScores,
  findings: string[]
): TrustResult => {
  // Defensive defaults
  const texture = categoryScores.texture || 50;
  const lighting = categoryScores.lighting || 50;
  const anatomy = categoryScores.anatomy || 50;
  const background = categoryScores.background || 50;
  const semantics = categoryScores.semantics || 50;

  // Weighted category aggregation (transparent & explainable)
  const weightedAi =
    0.25 * texture +
    0.20 * lighting +
    0.20 * anatomy +
    0.15 * background +
    0.20 * semantics;

  // Final AI probability (Gemini + AUTHENEX logic)
  const finalAiProbability = 0.6 * aiPercentage + 0.4 * weightedAi;

  // Trust score is inverse
  const trustScore = Math.round(100 - finalAiProbability);

  // Verdict thresholds (conservative, judge-safe)
  let verdict: string;
  if (trustScore >= 85) {
    verdict = "REAL";
  } else if (trustScore >= 65) {
    verdict = "LIKELY REAL";
  } else if (trustScore >= 45) {
    verdict = "SUSPICIOUS";
  } else {
    verdict = "LIKELY AI-GENERATED";
  }

  return {
    trust_score: trustScore,
    verdict,
    deepfake_probability: Math.round(finalAiProbability),
    details: {
      categoryScores,
      findings
    }
  };
};
