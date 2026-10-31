import {
  CandidatePackage,
  RoleRubric,
  ScreeningReport,
  ScreeningReportSchema,
} from "./types";
import { normalizeCandidatePackage } from "./core/normalizer";
import { extractCandidateDossier } from "./core/extractor";
import { evaluateCriteriaEvidence } from "./core/evaluator";
import { detectRisksAndAnomalies } from "./core/riskDetector";
import { synthesizeDecision } from "./core/recommender";
import { getLLMClient, SupportedProvider } from "./providers/llmRouter";

export interface PipelineOptions {
  provider?: SupportedProvider;
}

/**
 * End-to-End Orchestrator:
 * Ingests a raw candidate package + rubric -> normalizes -> extracts factual dossier ->
 * evaluates criteria against verbatim source quotes -> detects risk anomalies ->
 * synthesizes ATS recommendations with human approval checks -> returns auditable ScreeningReport.
 */
export async function runScreeningPipeline(
  candidatePackage: CandidatePackage,
  rubric: RoleRubric,
  options: PipelineOptions = {}
): Promise<ScreeningReport> {
  const startTime = Date.now();
  const auditTrail: ScreeningReport["auditTrail"] = [];

  const addAudit = (event: string, status: "SUCCESS" | "WARNING" | "ERROR", details: string) => {
    auditTrail.push({
      timestamp: new Date().toISOString(),
      event,
      status,
      details,
    });
  };

  addAudit("INGESTION_START", "SUCCESS", `Received candidate package ${candidatePackage.candidateId} (${candidatePackage.candidateName}) for role ${rubric.roleTitle}`);

  // Step 1: Normalization & PII Sanitization
  const normalized = normalizeCandidatePackage(candidatePackage);
  addAudit(
    "NORMALIZATION_COMPLETE",
    "SUCCESS",
    `Sanitized ${normalized.piiRedactedCount} PII tokens; consolidated ${normalized.sanitizedTokensCount} tokens across ${candidatePackage.documents.length} source docs.`
  );

  // Step 2: Initialize LLM Provider
  const llmClient = getLLMClient(options.provider);
  addAudit("LLM_PROVIDER_READY", "SUCCESS", `Using execution provider: ${llmClient.providerName}`);

  // Step 3: Extract Factual Candidate Dossier
  addAudit("DOSSIER_EXTRACTION_START", "SUCCESS", "Extracting structured work history, skills, and tenure");
  const dossier = await extractCandidateDossier(normalized, llmClient);
  addAudit(
    "DOSSIER_EXTRACTION_COMPLETE",
    "SUCCESS",
    `Extracted ${dossier.yearsOfTotalExperience} yrs exp, ${dossier.workHistory.length} roles, ${dossier.extractedSkills.length} skills.`
  );

  // Step 4: Criteria Evidence Evaluation with Anti-Hallucination Quote Verification
  addAudit("EVALUATION_START", "SUCCESS", `Evaluating ${rubric.criteria.length} criteria against verbatim source text`);
  const criteriaEvaluations = await evaluateCriteriaEvidence(dossier, rubric, normalized, llmClient);
  const unverifiedCount = criteriaEvaluations.filter((c) => !c.isHallucinationChecked).length;
  if (unverifiedCount > 0) {
    addAudit(
      "EVALUATION_GUARDRAIL_TRIGGER",
      "WARNING",
      `${unverifiedCount} criteria had unverified or hallucinated quotes and were penalized automatically.`
    );
  } else {
    addAudit("EVALUATION_COMPLETE", "SUCCESS", "All criteria evaluations grounded in verified source quotes.");
  }

  // Step 5: Risk & Anomaly Detection (Gaps, Tenure, Inflation, Knockouts)
  addAudit("RISK_DETECTION_START", "SUCCESS", "Running forensic checks for tenure gaps, buzzword inflation, and knockouts");
  const risks = await detectRisksAndAnomalies(dossier, rubric, normalized, llmClient);
  if (risks.length > 0) {
    addAudit(
      "RISKS_FLAGGED",
      "WARNING",
      `Flagged ${risks.length} anomalies (${risks.filter((r) => r.severity === "CRITICAL" || r.severity === "HIGH").length} high/critical).`
    );
  } else {
    addAudit("RISKS_CLEARED", "SUCCESS", "Zero anomalies or resume discrepancies detected.");
  }

  // Step 6: Decision Synthesis & ATS Action
  addAudit("SYNTHESIS_START", "SUCCESS", "Synthesizing weighted fit score, recommendation, and ATS sync payload");
  const decision = synthesizeDecision(dossier, rubric, criteriaEvaluations, risks);
  addAudit(
    "SYNTHESIS_COMPLETE",
    "SUCCESS",
    `Fit Score: ${decision.overallFitScore}/100. Recommendation: ${decision.recommendation}. Human Signoff: ${decision.humanApprovalRequired ? "MANDATORY" : "AUTO_CLEAR"}`
  );

  const durationMs = Date.now() - startTime;
  const usage = llmClient.getLastUsage();

  const report: ScreeningReport = {
    id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    candidateId: candidatePackage.candidateId,
    candidateName: candidatePackage.candidateName,
    roleId: rubric.roleId,
    roleTitle: rubric.roleTitle,
    evaluatedAt: new Date().toISOString(),
    executionProvider: usage.provider,
    executionDurationMs: durationMs,
    tokenUsage: {
      promptTokens: usage.promptTokens,
      completionTokens: usage.completionTokens,
      estimatedCostUsd: usage.estimatedCostUsd,
    },
    dossier,
    criteriaEvaluations,
    risks,
    decision,
    auditTrail,
    humanReviewState: {
      status: decision.humanApprovalRequired ? "PENDING_REVIEW" : "APPROVED",
    },
  };

  return ScreeningReportSchema.parse(report);
}
