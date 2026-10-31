import { RiskAnomaly, RiskAnomalySchema, RoleRubric } from "../types";
import { CandidateDossier } from "../types";
import { NormalizedPackage } from "./normalizer";
import { LLMClient } from "../providers/llmRouter";

export const RISK_DETECTOR_SYSTEM_PROMPT = `You are a Forensic Talent Risk & Consistency Analyst.
Your role is to inspect candidate profiles, resumes, and recruiter notes for discrepancies, red flags,
unrealistic claims (resume inflation), career gaps, or conflicts with role requirements.

ANOMALY CATEGORIES:
- UNEXPLAINED_GAP: Career gap > 6 months with no explanation in notes or resume.
- TENURE_INSTABILITY: Frequent short stints (< 9 months across multiple roles).
- RESUME_INFLATION: Buzzword stuffing, contradictory senior titles vs actual responsibilities, impossible metrics.
- MISSING_HARD_REQUIREMENT: Explicit knockout or must-have requirement absent.
- COMPENSATION_OR_INTENT_MISMATCH: Confirmed mismatch in recruiter notes (e.g. salary expectation $300k vs budget $180k).
- UNVERIFIED_CLAIM: Bold architectural claim without supporting scope or depth.

SEVERITY LEVELS:
- LOW: Minor flag, easily cleared in initial call.
- MEDIUM: Notable concern, needs structured behavioral probe.
- HIGH: Significant discrepancy that may disqualify candidate.
- CRITICAL: Direct knockout failure or provable misrepresentation.

Return ONLY a JSON array of anomalies. If candidate is pristine, return an empty array [].`;

/**
 * Heuristic pass to catch hard date gaps or tenure anomalies deterministically.
 */
export function heuristicRiskCheck(dossier: CandidateDossier, rubric: RoleRubric): RiskAnomaly[] {
  const heuristics: RiskAnomaly[] = [];

  // Check 1: Short average tenure
  if (dossier.workHistory.length >= 3) {
    const totalMonths = dossier.workHistory.reduce((acc, curr) => acc + (curr.durationMonths || 12), 0);
    const avgMonths = totalMonths / dossier.workHistory.length;
    if (avgMonths < 10) {
      heuristics.push({
        id: `heur_tenure_${Date.now()}_1`,
        category: "TENURE_INSTABILITY",
        severity: "MEDIUM",
        summary: `Average role duration is only ${Math.round(avgMonths)} months across ${dossier.workHistory.length} roles`,
        details: "Candidate shows multiple consecutive short tenures under 10 months.",
        evidenceSnippet: dossier.workHistory.map(w => `${w.company}: ${w.startDate} - ${w.endDate}`).join("; "),
        suggestedInterviewFollowup: "Ask candidate what drove each transition and what they are looking for in terms of long-term commitment.",
      });
    }
  }

  // Check 2: Total experience below role minimum
  const minRequiredExp = rubric.criteria.reduce((max, c) => Math.max(max, c.minYearsExperience || 0), 0);
  if (minRequiredExp > 0 && dossier.yearsOfTotalExperience < minRequiredExp) {
    heuristics.push({
      id: `heur_exp_${Date.now()}_2`,
      category: "MISSING_HARD_REQUIREMENT",
      severity: "HIGH",
      summary: `Total experience (${dossier.yearsOfTotalExperience} yrs) is below role minimum (${minRequiredExp} yrs)`,
      details: `The role strictly requires at least ${minRequiredExp} years of relevant domain experience.`,
      evidenceSnippet: `Candidate profile indicates ${dossier.yearsOfTotalExperience} years total experience.`,
      suggestedInterviewFollowup: "Assess whether exceptional project complexity or depth offsets the raw tenure delta.",
    });
  }

  return heuristics;
}

export async function detectRisksAndAnomalies(
  dossier: CandidateDossier,
  rubric: RoleRubric,
  pkg: NormalizedPackage,
  llmClient: LLMClient
): Promise<RiskAnomaly[]> {
  const prompt = `CANDIDATE DOSSIER:
${JSON.stringify(dossier, null, 2)}

ROLE RUBRIC & KNOCKOUT RULES:
Role: ${rubric.roleTitle}
Knockouts: ${JSON.stringify(rubric.knockoutRules)}

RAW NOTES AND RESUME:
${pkg.consolidatedText}

Perform forensic anomaly detection. Return a JSON array of anomalies:
[
  {
    "id": "risk_<short_id>",
    "category": "<UNEXPLAINED_GAP | TENURE_INSTABILITY | RESUME_INFLATION | MISSING_HARD_REQUIREMENT | COMPENSATION_OR_INTENT_MISMATCH | UNVERIFIED_CLAIM>",
    "severity": "<LOW | MEDIUM | HIGH | CRITICAL>",
    "summary": "<concise headline>",
    "details": "<clear explanation>",
    "evidenceSnippet": "<quote or specific data point>",
    "suggestedInterviewFollowup": "<targeted question for recruiter/HM>"
  }
]`;

  const llmAnomalies = await llmClient.generateStructuredJson<RiskAnomaly[]>({
    systemPrompt: RISK_DETECTOR_SYSTEM_PROMPT,
    userPrompt: prompt,
    schemaName: "Array<RiskAnomaly>",
  });

  const heuristicAnomalies = heuristicRiskCheck(dossier, rubric);

  // Combine and deduplicate
  const combined = [...heuristicAnomalies];
  for (const anom of llmAnomalies) {
    const isDuplicate = combined.some(c => c.category === anom.category && c.summary.toLowerCase().includes(anom.summary.toLowerCase().slice(0, 15)));
    if (!isDuplicate) {
      combined.push(RiskAnomalySchema.parse(anom));
    }
  }

  return combined;
}
